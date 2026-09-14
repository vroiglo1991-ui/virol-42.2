/**
 * VIROL // Cloudflare Worker
 * ─────────────────────────────────────────────────────
 * Rutas:
 *   GET  /api/me             → perfil + objetivos + plan semanal + comidas + suplementos
 *   GET  /api/entrenamientos → proxy Strava (usa refresh_token guardado en env)
 *   GET  /api/calendar       → proxy CORS para ficheros .ics
 *   *    /*                  → sirve los assets estáticos (index.html, css, js...)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ─── CORS preflight ───────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return corsResponse(null, 204);
    }

    // ─── 1. GET /api/me ───────────────────────────────────────────
    // Devuelve el perfil completo del usuario 'u_victor' leyendo de D1.
    // Cuando haya login, el user_id vendrá de la sesión; ahora está hardcodeado.
    if (url.pathname === '/api/me' && request.method === 'GET') {
      try {
        const userId = 'u_victor'; // TODO: extraer de cookie/JWT cuando haya auth

        // Perfil + objetivos
        const user = await env.DB.prepare(
          'SELECT id, name, email, weight_kg, height_cm, role FROM users WHERE id = ?'
        ).bind(userId).first();

        if (!user) {
          return corsResponse({ error: 'Usuario no encontrado' }, 404);
        }

        const goals = await env.DB.prepare(
          'SELECT label, goal_type, distance_km, target_date, priority FROM goals WHERE user_id = ? ORDER BY priority ASC'
        ).bind(userId).all();

        // Plan activo + sesiones semanales
        const plan = await env.DB.prepare(
          'SELECT id, name, weekly_km_target FROM training_plans WHERE user_id = ? AND is_active = 1 LIMIT 1'
        ).bind(userId).first();

        let sessions = { results: [] };
        if (plan) {
          sessions = await env.DB.prepare(
            'SELECT day_of_week, session_type, badge, title, description, target_km, tags FROM weekly_sessions WHERE plan_id = ? ORDER BY sort_order ASC'
          ).bind(plan.id).all();
        }

        // Comidas activas
        const mealPlan = await env.DB.prepare(
          'SELECT id, daily_kcal, protein_g, carbs_g, fat_g FROM meal_plans WHERE user_id = ? AND is_active = 1 LIMIT 1'
        ).bind(userId).first();

        let meals = { results: [] };
        if (mealPlan) {
          meals = await env.DB.prepare(
            'SELECT slot, title, time_window, summary FROM meals WHERE meal_plan_id = ? ORDER BY sort_order ASC'
          ).bind(mealPlan.id).all();
        }

        // Suplementos activos
        const supplements = await env.DB.prepare(
          'SELECT name, dose, timing_note, purpose_note, alarm_time FROM supplements WHERE user_id = ? AND is_active = 1 ORDER BY alarm_time ASC'
        ).bind(userId).all();

        // Notificaciones activas
        const notifications = await env.DB.prepare(
          'SELECT trigger_time, icon, title, body FROM notifications WHERE user_id = ? AND is_active = 1 ORDER BY trigger_time ASC'
        ).bind(userId).all();

        const payload = {
          user,
          goals: goals.results,
          plan: plan ? { name: plan.name, weekly_km_target: plan.weekly_km_target } : null,
          sessions: sessions.results,
          meal_plan: mealPlan ? {
            daily_kcal: mealPlan.daily_kcal,
            protein_g: mealPlan.protein_g,
            carbs_g: mealPlan.carbs_g,
            fat_g: mealPlan.fat_g,
            meals: meals.results
          } : null,
          supplements: supplements.results,
          notifications: notifications.results
        };

        return corsResponse(payload, 200);

      } catch (err) {
        // Si DB no está disponible (desarrollo local sin binding), devolvemos aviso claro
        return corsResponse({ error: 'DB no disponible', detail: err.message }, 503);
      }
    }

    // ─── 1.5. GET, PUT, POST /api/sync — Sincronización en la Nube PC ↔ Móvil ───
    if (url.pathname === '/api/sync') {
      const userId = 'u_victor';

      // Asegurar tabla app_state en D1 si existe binding
      if (env.DB) {
        try {
          await env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS app_state (
              user_id TEXT PRIMARY KEY,
              state_json TEXT NOT NULL,
              last_updated INTEGER NOT NULL,
              updated_at TEXT DEFAULT (datetime('now'))
            )
          `).run();
        } catch (_) {}
      }

      // GET /api/sync: Descargar último estado guardado
      if (request.method === 'GET') {
        try {
          if (env.DB) {
            const row = await env.DB.prepare(
              'SELECT state_json, last_updated FROM app_state WHERE user_id = ?'
            ).bind(userId).first();

            if (row && row.state_json) {
              try {
                const parsed = JSON.parse(row.state_json);
                return corsResponse(parsed, 200);
              } catch (_) {
                return new Response(row.state_json, {
                  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
              }
            }
          }
          return corsResponse({ message: 'No hay datos previos', lastUpdated: 0 }, 200);
        } catch (err) {
          return corsResponse({ error: true, message: err.message }, 500);
        }
      }

      // PUT / POST /api/sync: Guardar estado desde PC o Móvil con fusión granular
      if (request.method === 'PUT' || request.method === 'POST') {
        try {
          let body = {};
          try { body = await request.json(); } catch (_) {
            return corsResponse({ error: 'Payload no es JSON válido' }, 400);
          }

          if (env.DB) {
            let mergedState = { ...body };
            try {
              const existingRow = await env.DB.prepare(
                'SELECT state_json, last_updated FROM app_state WHERE user_id = ?'
              ).bind(userId).first();

              if (existingRow && existingRow.state_json) {
                const prevState = JSON.parse(existingRow.state_json);
                mergedState = mergeAppStates(prevState, body);
              }
            } catch (mergeErr) {
              console.warn('Advertencia al fusionar estado en D1:', mergeErr.message);
            }

            const lastUpdated = mergedState.lastUpdated || Date.now();
            const stateStr = JSON.stringify(mergedState);

            await env.DB.prepare(`
              INSERT INTO app_state (user_id, state_json, last_updated, updated_at)
              VALUES (?, ?, ?, datetime('now'))
              ON CONFLICT(user_id) DO UPDATE SET
                state_json = excluded.state_json,
                last_updated = excluded.last_updated,
                updated_at = datetime('now')
            `).bind(userId, stateStr, lastUpdated).run();

            return corsResponse({
              success: true,
              lastUpdated,
              state: mergedState,
              message: 'Sincronizado y fusionado en D1'
            }, 200);
          }

          const lastUpdated = body.lastUpdated || Date.now();
          return corsResponse({ success: true, lastUpdated, message: 'Recibido sin DB' }, 200);
        } catch (err) {
          return corsResponse({ error: true, message: err.message }, 500);
        }
      }
    }

    // ─── 2. GET /api/entrenamientos — Proxy Strava & Rate Limits ────────────────
    if (url.pathname === '/api/entrenamientos') {
      try {
        let accessToken = null;
        let refreshToken = request.headers.get('X-Strava-Refresh-Token') || env.STRAVA_REFRESH_TOKEN || null;
        let newTokens = null;

        // A. Token desde cabecera Authorization enviada por el cliente
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          accessToken = authHeader.replace('Bearer ', '').trim();
        }

        // B. Token desde query param
        if (!accessToken && url.searchParams.get('token')) {
          accessToken = url.searchParams.get('token').trim();
        }

        // C. Si no viene token o si viene el token caducado antiguo, buscar en D1
        if (!accessToken || accessToken === 'e879a9119db61a2e1c8edaa6bf2c10faa9bad366') {
          if (env.DB) {
            try {
              const u = await env.DB.prepare('SELECT strava_access_token, strava_refresh_token FROM users WHERE id = ?').bind('u_victor').first();
              if (u) {
                if (u.strava_access_token) accessToken = u.strava_access_token;
                if (u.strava_refresh_token) refreshToken = u.strava_refresh_token;
              }
            } catch (_) {}
          }
        }

        // D. Si aún no hay token válido pero sí refresh_token, refrescar de inmediato
        if ((!accessToken || accessToken === 'e879a9119db61a2e1c8edaa6bf2c10faa9bad366') && refreshToken) {
          const refreshed = await refreshStravaOAuthToken(refreshToken, env);
          if (refreshed && refreshed.access_token) {
            accessToken = refreshed.access_token;
            refreshToken = refreshed.refresh_token || refreshToken;
            newTokens = {
              access_token: refreshed.access_token,
              refresh_token: refreshed.refresh_token,
              expires_at: refreshed.expires_at
            };
          }
        }

        if (!accessToken || accessToken === 'e879a9119db61a2e1c8edaa6bf2c10faa9bad366') {
          return corsResponse({
            error: true,
            status: 401,
            message: 'No se ha proporcionado un token de Strava válido. Conecta tu cuenta pulsando "AUTORIZAR EN STRAVA" en el modal de Strava.'
          }, 401);
        }

        // Llamar a Strava API
        let stravaRes = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=20', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        // Si Strava devuelve 401 (token expirado) y tenemos refresh_token, autorefrescar de forma transparente
        if (stravaRes.status === 401 && refreshToken) {
          console.log('🔄 Token 401 de Strava. Intentando autorrefresco automático...');
          const refreshed = await refreshStravaOAuthToken(refreshToken, env);
          if (refreshed && refreshed.access_token) {
            accessToken = refreshed.access_token;
            newTokens = {
              access_token: refreshed.access_token,
              refresh_token: refreshed.refresh_token,
              expires_at: refreshed.expires_at
            };
            stravaRes = await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=20', {
              headers: { Authorization: `Bearer ${accessToken}` }
            });
          }
        }

        const rateLimit = stravaRes.headers.get('x-ratelimit-limit');
        const rateUsage = stravaRes.headers.get('x-ratelimit-usage');

        if (!stravaRes.ok) {
          const errText = await stravaRes.text();
          let parsedErr = {};
          try { parsedErr = JSON.parse(errText); } catch (_) {}

          let friendlyMsg = `Error Strava (HTTP ${stravaRes.status})`;
          if (stravaRes.status === 401) {
            friendlyMsg = 'Token de Strava caducado (HTTP 401). Pulsa "AUTORIZAR EN STRAVA" para renovar automáticamente el acceso.';
          } else if (stravaRes.status === 403) {
            friendlyMsg = 'Acceso prohibido (HTTP 403). Faltan permisos necesarios (scopes activity:read_all / activity:write).';
          } else if (stravaRes.status === 429) {
            friendlyMsg = 'Límite de peticiones de Strava excedido (HTTP 429: max 200 cada 15 min o 2.000 al día).';
          }

          return corsResponse({
            error: true,
            status: stravaRes.status,
            message: friendlyMsg,
            detail: parsedErr.message || errText,
            rateLimit,
            rateUsage
          }, stravaRes.status >= 400 && stravaRes.status <= 499 ? stravaRes.status : 502);
        }

        const activities = await stravaRes.json();
        return corsResponse({
          success: true,
          activities: Array.isArray(activities) ? activities : [],
          new_tokens: newTokens,
          rateLimit,
          rateUsage
        }, 200);

      } catch (err) {
        return corsResponse({ error: true, status: 500, message: err.message }, 500);
      }
    }

    // ─── 2.1. POST /api/strava/activity — Registrar entrenamiento en Strava ───
    if (url.pathname === '/api/strava/activity' && request.method === 'POST') {
      try {
        let body = {};
        try { body = await request.json(); } catch (_) {}

        const authHeader = request.headers.get('Authorization');
        const token = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.replace('Bearer ', '').trim() : body.token;

        if (!token) {
          return corsResponse({ error: true, status: 401, message: 'Falta token de Strava con permiso activity:write' }, 401);
        }

        const payload = {
          name: body.name || 'Entrenamiento Valencia 42K',
          sport_type: body.sport_type || body.type || 'Run',
          start_date_local: body.start_date_local || new Date().toISOString(),
          elapsed_time: Math.round(Number(body.elapsed_time || 1800)),
          distance: Number(body.distance || 0),
          description: body.description || 'Registrado desde BIOFLOW // Valencia 42K PRO'
        };

        const uploadRes = await fetch('https://www.strava.com/api/v3/activities', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const rateLimit = uploadRes.headers.get('x-ratelimit-limit');
        const rateUsage = uploadRes.headers.get('x-ratelimit-usage');
        const resText = await uploadRes.text();
        let resData = {};
        try { resData = JSON.parse(resText); } catch (_) {}

        if (!uploadRes.ok) {
          return corsResponse({
            error: true,
            status: uploadRes.status,
            message: uploadRes.status === 403 ? 'Permiso activity:write no concedido en Strava' : (resData.message || resText),
            rateLimit,
            rateUsage
          }, uploadRes.status);
        }

        return corsResponse({ success: true, activity: resData, rateLimit, rateUsage }, 201);

      } catch (err) {
        return corsResponse({ error: true, message: err.message }, 500);
      }
    }

    // ─── 2.2. POST /api/strava/refresh — Refresco de Token OAuth ───────────────
    if (url.pathname === '/api/strava/refresh' && request.method === 'POST') {
      try {
        let body = {};
        try { body = await request.json(); } catch (_) {}

        const clientId = env.STRAVA_CLIENT_ID || '243799';
        const clientSecret = env.STRAVA_CLIENT_SECRET;

        if (!clientSecret) {
          return corsResponse({
            error: true,
            message: 'STRAVA_CLIENT_SECRET no configurada en las variables de entorno de Cloudflare'
          }, 500);
        }

        const refreshToken = body.refresh_token || env.STRAVA_REFRESH_TOKEN;

        if (!refreshToken) {
          return corsResponse({
            error: true,
            message: 'Se requiere refresh_token para renovar el token de Strava'
          }, 400);
        }

        const refreshRes = await fetch('https://www.strava.com/api/v3/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token'
          })
        });

        const refreshData = await refreshRes.json();
        if (!refreshRes.ok) {
          return corsResponse({ error: true, status: refreshRes.status, detail: refreshData }, refreshRes.status);
        }

        if (env.DB && refreshData.access_token) {
          try {
            await env.DB.prepare(`
              UPDATE users 
              SET strava_access_token = ?, strava_refresh_token = ?, strava_token_expires_at = datetime(?, 'unixepoch'), updated_at = datetime('now')
              WHERE id = 'u_victor'
            `).bind(refreshData.access_token, refreshData.refresh_token, refreshData.expires_at).run();
          } catch (_) {}
        }

        return corsResponse({
          success: true,
          access_token: refreshData.access_token,
          refresh_token: refreshData.refresh_token,
          expires_at: refreshData.expires_at,
          expires_in: refreshData.expires_in
        }, 200);

      } catch (err) {
        return corsResponse({ error: true, message: err.message }, 500);
      }
    }

    // ─── 2.3. GET /api/strava/callback — Intercambio de OAuth Code y Redirección ─
    if (url.pathname === '/api/strava/callback') {
      const code = url.searchParams.get('code');
      const scope = url.searchParams.get('scope') || '';
      const error = url.searchParams.get('error');

      if (error) {
        return new Response(`<html><body style="font-family:sans-serif; background:#0B0E14; color:#fff; padding:30px; text-align:center;">
          <h2 style="color:#EF4444;">❌ Autorización cancelada en Strava</h2>
          <p>Motivo: ${error}</p>
          <a href="/" style="color:#FC4C02; font-weight:bold;">Volver a BIOFLOW</a>
        </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }

      if (code) {
        const clientId = env.STRAVA_CLIENT_ID || '243799';
        const clientSecret = env.STRAVA_CLIENT_SECRET;

        if (!clientSecret) {
          return new Response(`<html><body style="font-family:sans-serif; background:#0B0E14; color:#fff; padding:30px; text-align:center;">
            <h2 style="color:#EF4444;">❌ Error de configuración</h2>
            <p>STRAVA_CLIENT_SECRET no está configurada en Cloudflare Secrets.</p>
            <a href="/" style="color:#FC4C02; font-weight:bold;">Volver a BIOFLOW</a>
          </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' }, status: 500 });
        }

        try {
          const tokenRes = await fetch('https://www.strava.com/api/v3/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              client_id: clientId,
              client_secret: clientSecret,
              code: code,
              grant_type: 'authorization_code'
            })
          });

          const tokenData = await tokenRes.json();

          if (!tokenRes.ok || !tokenData.access_token) {
            return new Response(`<html><body style="font-family:sans-serif; background:#0B0E14; color:#fff; padding:30px; text-align:center;">
              <h2 style="color:#EF4444;">❌ Error canjeando código con Strava</h2>
              <p>${JSON.stringify(tokenData)}</p>
              <a href="/" style="color:#FC4C02; font-weight:bold;">Volver a BIOFLOW</a>
            </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
          }

          if (env.DB) {
            try {
              await env.DB.prepare(`
                UPDATE users 
                SET strava_athlete_id = ?, strava_access_token = ?, strava_refresh_token = ?, strava_token_expires_at = datetime(?, 'unixepoch'), updated_at = datetime('now')
                WHERE id = 'u_victor'
              `).bind(
                tokenData.athlete?.id ? String(tokenData.athlete.id) : null,
                tokenData.access_token,
                tokenData.refresh_token,
                tokenData.expires_at
              ).run();
            } catch (dbErr) {
              console.warn('Error guardando tokens en D1:', dbErr.message);
            }
          }

          let redirectBase = url.origin;
          const stateParam = url.searchParams.get('state');
          if (stateParam) {
            try {
              const parsed = new URL(stateParam);
              if (parsed.hostname.includes('github.io') || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.includes('workers.dev')) {
                redirectBase = stateParam;
              }
            } catch (_) {}
          }

          const redirectUrl = new URL(redirectBase);
          redirectUrl.searchParams.set('strava_connected', '1');
          redirectUrl.searchParams.set('access_token', tokenData.access_token);
          redirectUrl.searchParams.set('refresh_token', tokenData.refresh_token || '');
          redirectUrl.searchParams.set('expires_at', String(tokenData.expires_at || 0));
          return Response.redirect(redirectUrl.toString(), 302);

        } catch (exchangeErr) {
          return new Response(`<html><body style="font-family:sans-serif; background:#0B0E14; color:#fff; padding:30px; text-align:center;">
            <h2 style="color:#EF4444;">❌ Error de conexión al autorizar</h2>
            <p>${exchangeErr.message}</p>
            <a href="/" style="color:#FC4C02; font-weight:bold;">Volver a BIOFLOW</a>
          </body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
      }
    }

    // ─── 2.4. POST /api/strava/exchange — Intercambio directo de OAuth Code ────────
    if (url.pathname === '/api/strava/exchange' && request.method === 'POST') {
      try {
        let body = {};
        try { body = await request.json(); } catch (_) {}
        const code = body.code;
        if (!code) return corsResponse({ error: true, message: 'Falta código OAuth' }, 400);

        const clientId = env.STRAVA_CLIENT_ID || '243799';
        const clientSecret = env.STRAVA_CLIENT_SECRET;
        if (!clientSecret) {
          return corsResponse({ error: true, message: 'STRAVA_CLIENT_SECRET no configurada en las variables de entorno de Cloudflare' }, 500);
        }

        const tokenRes = await fetch('https://www.strava.com/api/v3/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code'
          })
        });

        const tokenData = await tokenRes.json();
        if (!tokenRes.ok) return corsResponse({ error: true, detail: tokenData }, tokenRes.status);

        if (env.DB && tokenData.access_token) {
          try {
            await env.DB.prepare(`
              UPDATE users 
              SET strava_athlete_id = ?, strava_access_token = ?, strava_refresh_token = ?, strava_token_expires_at = datetime(?, 'unixepoch'), updated_at = datetime('now')
              WHERE id = 'u_victor'
            `).bind(
              tokenData.athlete?.id ? String(tokenData.athlete.id) : null,
              tokenData.access_token,
              tokenData.refresh_token,
              tokenData.expires_at
            ).run();
          } catch (_) {}
        }

        return corsResponse({
          success: true,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
          athlete: tokenData.athlete
        }, 200);
      } catch (err) {
        return corsResponse({ error: true, message: err.message }, 500);
      }
    }

    // ─── 3. GET /api/calendar — Proxy CORS para .ics ─────────────
    if (url.pathname === '/api/calendar') {
      const icalUrl = url.searchParams.get('url');
      if (!icalUrl) return corsResponse({ error: "Falta el parámetro 'url'" }, 400);

      try {
        const res = await fetch(icalUrl);
        if (!res.ok) throw new Error('No se pudo obtener el feed del calendario');
        const icsText = await res.text();
        return new Response(icsText, {
          headers: {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store',
          },
        });
      } catch (err) {
        return corsResponse({ error: err.message }, 500);
      }
    }

    // ─── 3.1. POST /api/archive-week — Archivo Relacional en SQLite D1 ──────────
    if (url.pathname === '/api/archive-week' && request.method === 'POST') {
      try {
        const userId = 'u_victor';
        let body = {};
        try { body = await request.json(); } catch (_) {
          return corsResponse({ error: 'Payload JSON no válido' }, 400);
        }

        if (!env.DB) {
          return corsResponse({ success: true, message: 'Recibido sin DB binding activo' }, 200);
        }

        // Asegurar tablas necesarias en D1
        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS weekly_archives (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            week_start TEXT NOT NULL,
            week_end TEXT NOT NULL,
            total_km REAL,
            sessions_completed INTEGER,
            sessions_total INTEGER,
            avg_sleep_hours REAL,
            summary_json TEXT,
            archived_at TEXT DEFAULT (datetime('now'))
          )
        `).run().catch(() => {});

        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS session_logs (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            session_id TEXT,
            log_date TEXT NOT NULL,
            completed INTEGER DEFAULT 0,
            strava_activity_id TEXT,
            distance_km REAL,
            duration_sec INTEGER,
            avg_pace_sec_km INTEGER,
            perceived_effort INTEGER,
            sleep_hours REAL,
            notes TEXT,
            created_at TEXT DEFAULT (datetime('now'))
          )
        `).run().catch(() => {});

        await env.DB.prepare(`
          CREATE TABLE IF NOT EXISTS supplement_logs (
            id TEXT PRIMARY KEY,
            supplement_id TEXT NOT NULL,
            log_date TEXT NOT NULL,
            taken INTEGER DEFAULT 0,
            taken_at TEXT
          )
        `).run().catch(() => {});

        const archiveId = `wa_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const weekStart = body.week_start || new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        const weekEnd = body.week_end || new Date().toISOString().split('T')[0];

        // 1. Insertar resumen en weekly_archives
        await env.DB.prepare(`
          INSERT INTO weekly_archives (id, user_id, week_start, week_end, total_km, sessions_completed, sessions_total, avg_sleep_hours, summary_json, archived_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `).bind(
          archiveId,
          userId,
          weekStart,
          weekEnd,
          Number(body.total_km || 0),
          Number(body.sessions_completed || 0),
          Number(body.sessions_total || 7),
          Number(body.avg_sleep_hours || 8),
          JSON.stringify(body.summary_json || {})
        ).run();

        // 2. Insertar sesiones individuales si vienen en el payload
        if (Array.isArray(body.sessions)) {
          for (const s of body.sessions) {
            const slogId = `slog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            await env.DB.prepare(`
              INSERT INTO session_logs (id, user_id, log_date, completed, strava_activity_id, distance_km, duration_sec, avg_pace_sec_km, perceived_effort, sleep_hours, notes, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            `).bind(
              slogId,
              userId,
              s.log_date || weekEnd,
              s.completed ? 1 : 0,
              s.strava_activity_id || null,
              Number(s.distance_km || 0),
              Number(s.duration_sec || 0),
              s.avg_pace_sec_km ? Number(s.avg_pace_sec_km) : null,
              s.perceived_effort ? Number(s.perceived_effort) : null,
              s.sleep_hours ? Number(s.sleep_hours) : null,
              s.notes || null
            ).run().catch(() => {});
          }
        }

        // 3. Insertar registros de suplementación
        if (Array.isArray(body.supplements)) {
          for (const sup of body.supplements) {
            const suplogId = `suplog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            await env.DB.prepare(`
              INSERT INTO supplement_logs (id, supplement_id, log_date, taken, taken_at)
              VALUES (?, ?, ?, ?, datetime('now'))
            `).bind(
              suplogId,
              sup.supplement_id || 'sup_general',
              sup.log_date || weekEnd,
              sup.taken ? 1 : 0
            ).run().catch(() => {});
          }
        }

        return corsResponse({
          success: true,
          archiveId,
          message: 'Semana archivada con éxito en SQLite D1 relacional'
        }, 200);

      } catch (err) {
        return corsResponse({ error: true, message: err.message }, 500);
      }
    }

    // ─── 3.2. GET /api/archives — Consultar historial archivado en D1 ───────────
    if (url.pathname === '/api/archives' && request.method === 'GET') {
      try {
        const userId = 'u_victor';
        if (!env.DB) return corsResponse({ archives: [] }, 200);
        const rows = await env.DB.prepare(`
          SELECT * FROM weekly_archives WHERE user_id = ? ORDER BY archived_at DESC LIMIT 20
        `).bind(userId).all();
        return corsResponse({ success: true, archives: rows.results || [] }, 200);
      } catch (err) {
        return corsResponse({ error: true, message: err.message }, 500);
      }
    }

    // ─── 3.3. POST /api/ai/nutrition-menu — Proxy Gemini para Menú Zero-Waste ────
    if (url.pathname === '/api/ai/nutrition-menu' && request.method === 'POST') {
      try {
        let body = {};
        try { body = await request.json(); } catch (_) {}

        const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];
        const targetKcal = body.targetKcal || 2850;
        const targetProtein = body.targetProtein || 150;

        if (ingredients.length === 0) {
          return corsResponse({ error: 'Debes proporcionar al menos un ingrediente' }, 400);
        }

        const systemInstruction = `Eres un nutricionista deportivo de élite para un maratoniano de 73 kg preparando la Maratón de Valencia.
Objetivo: Generar un menú diario con 5 comidas (desayuno, snack, comida, merienda, cena) alcanzando exactamente ~${targetKcal} kcal y ~${targetProtein}g de proteína.
CRUCIAL: Debes utilizar ÚNICAMENTE o prioritariamente los siguientes ingredientes de su compra:
${ingredients.join(', ')}.
Devuelve estrictamente un JSON válido con las claves exactas: "desayuno", "snack", "comida", "merienda", "cena". Cada comida debe contener: "name", "time", "desc" y un array "items" con objetos {"qty": "...", "text": "..."}.`;

        const userPrompt = `Genera el menú deportivo con los ingredientes disponibles: ${ingredients.join(', ')}. Objetivo: ${targetKcal} kcal y ${targetProtein}g de proteína.`;

        const generatedMenu = await callGeminiApi(userPrompt, systemInstruction, true, env);
        return corsResponse({ success: true, menu: generatedMenu }, 200);

      } catch (err) {
        return corsResponse({ error: true, message: err.message }, 500);
      }
    }

    // ─── 3.4. POST /api/ai/shopping-recs — Proxy Gemini para Recomendaciones Compra ──
    if (url.pathname === '/api/ai/shopping-recs' && request.method === 'POST') {
      try {
        let body = {};
        try { body = await request.json(); } catch (_) {}

        const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];

        const systemInstruction = `Eres un nutricionista deportivo experto en running y maratón.
Un corredor de 73 kg prepara la Maratón de Valencia y actualmente tiene estos ingredientes en casa:
${ingredients.join(', ')}.

Analiza su lista y recomiéndale exactamente 6-8 productos que le FALTAN o que mejorarían notablemente su nutrición deportiva (recuperación, hidratación, proteína, carbohidratos de calidad, micronutrientes).
IMPORTANTE: Solo recomienda productos que se vendan habitualmente en Mercadona o supermercados similares.
Devuelve OBLIGATORIAMENTE un JSON válido con la estructura estricta:
{
  "recommendations": [
    {"product": "nombre del producto", "reason": "por qué lo necesita (máx 1 frase)", "category": "Proteína|Carbohidrato|Grasa|Hidratación|Micronutriente|Suplemento"}
  ],
  "summary": "Breve resumen de las carencias principales (1-2 frases)"
}`;

        const userPrompt = `Analiza estos ingredientes actuales y recomienda la lista de la compra deportiva óptima: ${ingredients.join(', ')}`;

        const recs = await callGeminiApi(userPrompt, systemInstruction, true, env);
        return corsResponse({ success: true, ...recs }, 200);

      } catch (err) {
        return corsResponse({ error: true, message: err.message }, 500);
      }
    }

    // ─── 4. POST /api/ai/weekly-review — Análisis Semanal con Gemini ───
    if (url.pathname === '/api/ai/weekly-review' && request.method === 'POST') {
      try {
        const userId = 'u_victor';
        const geminiApiKey = env.GEMINI_API_KEY;

        if (!geminiApiKey) {
          return corsResponse({ error: 'GEMINI_API_KEY no configurada en Cloudflare Secrets' }, 500);
        }

        let clientData = {};
        try {
          clientData = await request.json();
        } catch (_) {}

        let logs = [];
        let plan = null;
        let suppAdherence = [];

        if (env.DB) {
          try {
            const logsRes = await env.DB.prepare(`
              SELECT log_date, completed, distance_km, duration_sec, 
                     avg_pace_sec_km, perceived_effort, sleep_hours, notes
              FROM session_logs
              WHERE user_id = ? AND log_date >= date('now', '-7 days')
              ORDER BY log_date ASC
            `).bind(userId).all();
            logs = logsRes.results || [];

            plan = await env.DB.prepare(`
              SELECT weekly_km_target FROM training_plans 
              WHERE user_id = ? AND is_active = 1 LIMIT 1
            `).bind(userId).first();

            const suppRes = await env.DB.prepare(`
              SELECT s.name, COUNT(sl.id) as tomas, SUM(sl.taken) as completados
              FROM supplements s
              LEFT JOIN supplement_logs sl ON s.id = sl.supplement_id 
                AND sl.log_date >= date('now', '-7 days')
              WHERE s.user_id = ? AND s.is_active = 1
              GROUP BY s.id
            `).bind(userId).all();
            suppAdherence = suppRes.results || [];
          } catch (dbErr) {
            console.warn('D1 no disponible o vacía:', dbErr.message);
          }
        }

        const totalKmDone = clientData.totalKmDone !== undefined 
          ? Number(clientData.totalKmDone) 
          : logs.reduce((acc, l) => acc + (l.distance_km || 0), 0);
        const targetKm = clientData.targetKm !== undefined 
          ? Number(clientData.targetKm) 
          : (plan ? plan.weekly_km_target : 60);
        const avgSleep = clientData.avgSleep !== undefined 
          ? Number(clientData.avgSleep) 
          : (logs.length ? (logs.reduce((acc, l) => acc + (l.sleep_hours || 0), 0) / logs.length).toFixed(1) : 7.0);
        const avgRPE = clientData.avgRPE !== undefined 
          ? Number(clientData.avgRPE) 
          : (logs.length ? (logs.reduce((acc, l) => acc + (l.perceived_effort || 0), 0) / logs.length).toFixed(1) : 6.5);

        const systemInstruction = `
Eres un entrenador de atletismo de élite y fisiólogo deportivo especializado en maratón (preparación Maratón Valencia 42K).
Analiza las métricas semanales del atleta Víctor (volumen en km, esfuerzo percibido RPE, horas de sueño y consistencia).
Debes ser riguroso, directo, sin frases motivacionales vacías y con base científica.
Devuelve OBLIGATORIAMENTE un JSON válido con el esquema estricto solicitado.
`;

        const userPrompt = `
DATOS SEMANALES:
- Objetivo semanal: ${targetKm} km
- Volumen completado: ${totalKmDone} km (${Math.round((totalKmDone / (targetKm || 1)) * 100)}%)
- Media de Sueño: ${avgSleep} horas/noche
- RPE Medio (1-10): ${avgRPE}
- Registros diarios: ${JSON.stringify(logs.length ? logs : clientData.recentSessions || [])}
- Suplementación: ${JSON.stringify(suppAdherence.length ? suppAdherence : clientData.supplements || [])}

Genera el diagnóstico de estado para la preparación de la Maratón Valencia 42K.
`;

        const promptPayload = {
          contents: [{
            parts: [{
              text: `${systemInstruction}\n\n${userPrompt}\n\nDevuelve ÚNICAMENTE un objeto JSON con las claves: status_badge, fatigue_score, injury_risk, summary_headline, weekly_diagnosis, actionable_adjustments, nutrition_focus.`
            }]
          }],
          generationConfig: {
            response_mime_type: 'application/json'
          }
        };

        const models = [
          'gemini-2.0-flash',
          'gemini-1.5-flash',
          'gemini-1.5-pro',
          'gemini-flash-latest'
        ];
        let geminiData = null;
        let lastErrorText = '';

        for (const model of models) {
          try {
            const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(promptPayload)
            });

            if (geminiRes.ok) {
              geminiData = await geminiRes.json();
              break;
            } else {
              lastErrorText = await geminiRes.text();
              console.warn(`Fallback modelo ${model} falló:`, geminiRes.status, lastErrorText);
            }
          } catch (fetchErr) {
            lastErrorText = fetchErr.message;
          }
        }

        if (!geminiData || !geminiData.candidates || !geminiData.candidates[0]) {
          return corsResponse({ error: 'Fallo al invocar Gemini API', detail: lastErrorText }, 502);
        }

        const rawText = geminiData.candidates[0].content.parts[0].text;
        let parsedResult = null;
        try {
          parsedResult = JSON.parse(rawText);
        } catch (_) {
          parsedResult = {
            raw_text: rawText,
            status_badge: 'OPTIMIZACIÓN REQUERIDA',
            fatigue_score: 5,
            injury_risk: 'Medio',
            summary_headline: 'Análisis generado',
            weekly_diagnosis: rawText,
            actionable_adjustments: ['Revisar hidratación', 'Mantener descanso'],
            nutrition_focus: 'Priorizar carbohidratos complejos'
          };
        }

        return corsResponse({
          metrics: {
            totalKmDone,
            targetKm,
            completionPct: Math.round((totalKmDone / (targetKm || 1)) * 100),
            avgSleep,
            avgRPE
          },
          ...parsedResult
        }, 200);

      } catch (err) {
        return corsResponse({ error: err.message }, 500);
      }
    }

    // ─── 4.5. POST /api/ai/chat — Chatbot Agéntico con Tool Use (Claude / Gemini) ───
    if (url.pathname === '/api/ai/chat' && request.method === 'POST') {
      try {
        let body = {};
        try {
          body = await request.json();
        } catch (_) {
          return corsResponse({ error: 'Payload JSON inválido' }, 400);
        }

        const anthropicApiKey = env.ANTHROPIC_API_KEY || env.CLAUDE_API_KEY || body.anthropicApiKey;
        const geminiApiKey = env.GEMINI_API_KEY || body.geminiApiKey;

        if (!anthropicApiKey && !geminiApiKey) {
          return corsResponse({ error: 'Ninguna API Key configurada (se requiere ANTHROPIC_API_KEY o GEMINI_API_KEY en Cloudflare Secrets o en el cliente)' }, 500);
        }

        const userMessage = body.message || '';
        const contextData = body.context || {};
        const conversationHistory = Array.isArray(body.history) ? body.history : [];
        const selectedDayIndex = typeof body.selectedDayIndex === 'number' ? body.selectedDayIndex : (contextData.todayState?.dayIndex ?? 1);

        const DEFAULT_WORKOUTS_FALLBACK = {
          1: { name: "LUNES", discipline: "GYM // PULL", title: "TRACCIÓN & ESPALDA DE HIERRO", km: 0, steps: [{ name: "Dominadas pronadas o Jalón al pecho", reps: "4 series x 8-10 reps" }, { name: "Remo con barra o mancuerna pesada", reps: "4 series x 8-10 reps" }, { name: "Curl de bíceps", reps: "3 series x 10 reps" }] },
          2: { name: "MARTES", discipline: "RUN // 12 KM Z2", title: "12 KM RODAJE ZONA 2 CONTINUO", km: 12, steps: [{ name: "Rodaje continuo Zona 2", reps: "12 km continuos" }, { name: "Técnica de carrera", reps: "5 min" }] },
          3: { name: "MIÉRCOLES", discipline: "GYM // PUSH", title: "EMPUJE, PECTORAL & HOMBROS", km: 0, steps: [{ name: "Press banca plano", reps: "4 series x 8 reps" }, { name: "Press militar", reps: "3 series x 8 reps" }, { name: "Fondos en paralelas", reps: "4 series x 10 reps" }] },
          4: { name: "JUEVES", discipline: "RUN // 12 KM CALIDAD", title: "12 KM CALIDAD / RITMO MEDIA MARATÓN", km: 12, steps: [{ name: "Calentamiento", reps: "2 km" }, { name: "Bloque ritmo Media Maratón", reps: "8 km" }, { name: "Vuelta a la calma", reps: "2 km" }] },
          5: { name: "VIERNES", discipline: "GYM // LEGS CORREDOR", title: "PIERNA FUNCIONAL & PREVENCIÓN", km: 0, steps: [{ name: "Sentadilla búlgara", reps: "3 series x 8 reps por pierna" }, { name: "Peso muerto rumano", reps: "3 series x 8 reps" }, { name: "Elevación de talones sóleo/gemelo", reps: "4 series x 15 reps" }, { name: "Abducción glúteo medio", reps: "3 series x 15 reps" }] },
          6: { name: "SÁBADO", discipline: "DESCANSO SAGRADO", title: "DÍA DE DESCANSO ABSOLUTO", isRest: true, km: 0, steps: [{ name: "Dormir 8 horas completas", reps: "Reparación celular" }, { name: "Carga de hidratos", reps: "Depósitos al 100%" }] },
          0: { name: "DOMINGO", discipline: "RUN // 18-22 KM", title: "LA SESIÓN REINA // 20 KM VALENCIA", km: 20, steps: [{ name: "Tirada larga continua", reps: "20 km a ritmo cómodo" }, { name: "Nutrición en carrera", reps: "1 gel cada 45 min" }] }
        };

        const currentWorkouts = (body.workouts && typeof body.workouts === 'object')
          ? JSON.parse(JSON.stringify(body.workouts))
          : JSON.parse(JSON.stringify(DEFAULT_WORKOUTS_FALLBACK));

        function resolveDayIndex(dayStr, currentDayIdx = 1) {
          if (typeof dayStr === 'number' && dayStr >= 0 && dayStr <= 6) return dayStr;
          if (!dayStr || typeof dayStr !== 'string') return null;

          const normalized = dayStr
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

          if (normalized === 'hoy') return currentDayIdx;
          if (normalized === 'manana') return (currentDayIdx + 1) % 7;
          if (normalized === 'pasado manana') return (currentDayIdx + 2) % 7;
          if (normalized === 'ayer') return (currentDayIdx + 6) % 7;

          const map = {
            domingo: 0, dom: 0,
            lunes: 1, lun: 1,
            martes: 2, mar: 2,
            miercoles: 3, mie: 3,
            jueves: 4, jue: 4,
            viernes: 5, vie: 5,
            sabado: 6, sab: 6
          };

          for (const [key, val] of Object.entries(map)) {
            if (normalized.includes(key)) return val;
          }
          return null;
        }

        const modifiedWorkouts = [];
        const toolExecutions = [];
        const clientActions = [];

        function executeConsultarEntrenamiento(args, workouts, currentDayIdx) {
          const diaStr = args?.dia;
          const dayIdx = resolveDayIndex(diaStr, currentDayIdx);

          if (dayIdx === null || dayIdx === undefined) {
            return {
              success: false,
              error: `El día '${diaStr}' no es válido. Los días válidos son: lunes, martes, miércoles, jueves, viernes, sábado, domingo, hoy o mañana.`
            };
          }

          const workout = workouts[dayIdx] || DEFAULT_WORKOUTS_FALLBACK[dayIdx];
          if (!workout) {
            return {
              success: false,
              error: `No hay ningún entrenamiento configurado para el día '${diaStr}' (índice ${dayIdx}).`
            };
          }

          return {
            success: true,
            dia: workout.name,
            dia_indice: dayIdx,
            disciplina: workout.discipline || '',
            titulo: workout.title || '',
            intensidad: workout.intensity || '',
            km: workout.km || 0,
            es_descanso: !!workout.isRest,
            ejercicios_actuales: (workout.steps || []).map(s => ({
              nombre: s.name,
              reps_series: s.reps || ''
            }))
          };
        }

        function executeModificarEntrenamiento(args, workouts, currentDayIdx) {
          const diaStr = args?.dia;
          const dayIdx = resolveDayIndex(diaStr, currentDayIdx);

          if (dayIdx === null || dayIdx === undefined) {
            return {
              success: false,
              error: `El día '${diaStr}' no es válido. Especifica: lunes, martes, miércoles, jueves, viernes, sábado, domingo, hoy o mañana.`
            };
          }

          const ejercicios = args?.ejercicios;
          if (!Array.isArray(ejercicios) || ejercicios.length === 0) {
            return {
              success: false,
              error: `No se proporcionaron ejercicios válidos para modificar el entrenamiento. Debe ser una lista de ejercicios con nombre y repeticiones/series.`
            };
          }

          const parsedSteps = ejercicios.map(ex => {
            let repsStr = '';
            if (ex.series && ex.reps) {
              repsStr = `${ex.series} series x ${ex.reps}`;
            } else if (ex.reps) {
              repsStr = String(ex.reps);
            } else if (ex.series) {
              repsStr = `${ex.series} series`;
            }
            if (ex.notas) {
              repsStr = repsStr ? `${repsStr} (${ex.notas})` : String(ex.notas);
            }
            return {
              name: String(ex.nombre || 'Ejercicio').trim(),
              reps: repsStr.trim()
            };
          });

          const prev = workouts[dayIdx] || DEFAULT_WORKOUTS_FALLBACK[dayIdx] || { name: `DÍA ${dayIdx}` };
          const modo = args?.modo || 'reemplazar';

          let finalSteps = parsedSteps;
          if (modo === 'anadir' && Array.isArray(prev.steps)) {
            finalSteps = [...prev.steps, ...parsedSteps];
          }

          const updatedWorkout = {
            ...prev,
            discipline: args?.disciplina || prev.discipline || '',
            title: args?.titulo || prev.title || '',
            steps: finalSteps
          };
          workouts[dayIdx] = updatedWorkout;

          clientActions.push({
            type: 'ADJUST_WORKOUT',
            dayIdx,
            km: updatedWorkout.km || 0,
            note: updatedWorkout.title || ''
          });

          return {
            success: true,
            dia: updatedWorkout.name || diaStr,
            dia_indice: dayIdx,
            mensaje: `Entrenamiento de ${updatedWorkout.name || diaStr} actualizado con éxito (${finalSteps.length} ejercicios).`,
            steps: finalSteps,
            updatedWorkout
          };
        }

        function executeModificarMercadona(args) {
          const accion = (args?.accion || 'anadir').toLowerCase();
          const nombre = String(args?.nombre || '').trim();
          if (!nombre) {
            return { success: false, error: 'Debes indicar el nombre del producto de Mercadona.' };
          }
          const peso = String(args?.peso_o_cantidad || '1 ud').trim();
          let cat = (args?.categoria || '').toLowerCase().trim();
          if (!['fresh', 'pantry', 'supplements', 'snacks'].includes(cat)) {
            const nLow = nombre.toLowerCase();
            if (nLow.includes('creatina') || nLow.includes('proteina') || nLow.includes('whey') || nLow.includes('magnesio') || nLow.includes('omega') || nLow.includes('suplemento')) {
              cat = 'supplements';
            } else if (nLow.includes('avena') || nLow.includes('arroz') || nLow.includes('pasta') || nLow.includes('pan') || nLow.includes('aceite') || nLow.includes('atun') || nLow.includes('legumbre') || nLow.includes('garbanzo') || nLow.includes('lenteja')) {
              cat = 'pantry';
            } else if (nLow.includes('fruto') || nLow.includes('nuez') || nLow.includes('almendra') || nLow.includes('tortita') || nLow.includes('chocolate') || nLow.includes('snack') || nLow.includes('barrita')) {
              cat = 'snacks';
            } else {
              cat = 'fresh';
            }
          }

          if (accion === 'eliminar') {
            clientActions.push({ type: 'REMOVE_MERCADONA_ITEM', name: nombre });
            return { success: true, mensaje: `Producto '${nombre}' marcado para retirar de Mercadona.` };
          } else {
            clientActions.push({ type: 'ADD_MERCADONA_ITEM', name: nombre, weight: peso, category: cat });
            return { success: true, mensaje: `Producto '${nombre}' (${peso}) añadido a ${cat} de Mercadona.` };
          }
        }

        function executeModificarComida(args) {
          const accion = (args?.accion || 'anadir').toLowerCase();
          const comida = (args?.comida || 'snack').toLowerCase().trim();
          const nombre = String(args?.nombre || '').trim();
          if (!nombre) {
            return { success: false, error: 'Debes indicar el nombre del alimento.' };
          }
          const cantidad = String(args?.cantidad || '1 ud').trim();

          if (accion === 'eliminar') {
            clientActions.push({ type: 'REMOVE_MEAL_ITEM', meal: comida, text: nombre });
            return { success: true, mensaje: `Alimento '${nombre}' retirado de la comida '${comida}'.` };
          } else {
            clientActions.push({ type: 'ADD_MEAL_ITEM', meal: comida, qty: cantidad, text: nombre });
            return { success: true, mensaje: `Alimento '${nombre}' (${cantidad}) añadido a la comida '${comida}'.` };
          }
        }

        function executeMarcarChecklist(args) {
          const elemento = String(args?.elemento || '').toLowerCase().trim();
          const completado = args?.completado !== false;

          const mapKeys = {
            creatina: 'supp_creatina',
            omega3: 'supp_omega3',
            whey: 'supp_whey',
            magnesio: 'supp_magnesio',
            desayuno: 'meal_desayuno',
            snack: 'meal_snack',
            comida: 'meal_comida',
            merienda: 'meal_merienda',
            cena: 'meal_cena',
            entrenamiento: 'workoutCompleted',
            entreno: 'workoutCompleted'
          };

          const key = mapKeys[elemento];
          if (!key) {
            return {
              success: false,
              error: `Elemento '${elemento}' desconocido. Opciones válidas: creatina, omega3, whey, magnesio, desayuno, snack, comida, merienda, cena, entrenamiento.`
            };
          }

          clientActions.push({ type: completado ? 'CHECK_ITEM' : 'UNCHECK_ITEM', key });
          return {
            success: true,
            mensaje: `Elemento '${elemento}' ${completado ? 'marcado como completado' : 'desmarcado'}.`
          };
        }

        function executeRegistrarMetricas(args) {
          const act = { type: 'LOG_DAILY_METRIC' };
          const items = [];

          if (args?.sueno_horas !== undefined && args.sueno_horas !== null && args.sueno_horas !== '') {
            act.sleepHours = Number(args.sueno_horas);
            items.push(`Sueño: ${act.sleepHours}h`);
          }
          if (args?.rpe !== undefined && args.rpe !== null && args.rpe !== '') {
            act.rpe = Math.min(10, Math.max(1, Number(args.rpe)));
            items.push(`RPE: ${act.rpe}/10`);
          }
          if (args?.peso_kg !== undefined && args.peso_kg !== null && args.peso_kg !== '') {
            act.weight = Number(args.peso_kg);
            items.push(`Peso: ${act.weight} kg`);
          }

          if (items.length === 0) {
            return { success: false, error: 'No se indicaron métricas válidas (sueno_horas, rpe, peso_kg).' };
          }

          clientActions.push(act);
          return { success: true, mensaje: `Métricas registradas: ${items.join(' • ')}` };
        }

        function executeProgramarAlarma(args) {
          const alarma = (args?.alarma || 'workout').toLowerCase();
          const hora = args?.hora;
          if (!hora || !/^\d{1,2}:\d{2}$/.test(hora)) {
            return { success: false, error: 'Formato de hora inválido. Usa formato HH:MM (ej. 08:30 o 21:00).' };
          }
          clientActions.push({
            type: 'SET_ALARM',
            alarm: alarma,
            time: hora,
            title: args?.titulo || undefined
          });
          return { success: true, mensaje: `Alarma '${alarma}' programada para las ${hora}.` };
        }

        function executeToolByName(name, args) {
          let result = null;
          if (name === 'consultar_entrenamiento') {
            result = executeConsultarEntrenamiento(args, currentWorkouts, selectedDayIndex);
          } else if (name === 'modificar_entrenamiento') {
            result = executeModificarEntrenamiento(args, currentWorkouts, selectedDayIndex);
            if (result.success) modifiedWorkouts.push(result);
          } else if (name === 'modificar_mercadona') {
            result = executeModificarMercadona(args);
          } else if (name === 'modificar_comida') {
            result = executeModificarComida(args);
          } else if (name === 'marcar_checklist') {
            result = executeMarcarChecklist(args);
          } else if (name === 'registrar_metricas') {
            result = executeRegistrarMetricas(args);
          } else if (name === 'programar_alarma') {
            result = executeProgramarAlarma(args);
          } else {
            result = { success: false, error: `Herramienta '${name}' no implementada.` };
          }
          return result;
        }

        const contextStr = JSON.stringify(contextData, null, 2);

        const systemInstruction = `Eres Virol AI Coach, el entrenador de atletismo de élite y nutricionista personal de Víctor (73 kg, 178 cm, objetivo Maratón Valencia 42K).
Eres directo, riguroso, de corte militar-atlético brutalista y científico: sin clichés ni frases vacías. Hablas con seguridad, claridad y autoridad técnica.

CONTEXTO DEL ATLETA:
${contextStr}

CAPACIDAD DE ACCIÓN TOTAL EN EL SISTEMA (HERRAMIENTAS / FUNCTION CALLING):
Tienes acceso a herramientas reales conectadas a la base de datos y la interfaz de la app:
1. "consultar_entrenamiento": Consulta los ejercicios de cualquier día antes de modificarlos para no inventar ni borrar rutinas previas.
2. "modificar_entrenamiento": Modifica o añade ejercicios a un día de la semana. Puedes usar modo "anadir" para sumar ejercicios a los existentes o "reemplazar" para sustituir la lista.
3. "modificar_mercadona": Añade o retira productos de la lista de la compra de Mercadona en la app (con su peso/unidad y categoría).
4. "modificar_comida": Añade o retira alimentos de las 5 comidas diarias (desayuno, snack, comida, merienda, cena).
5. "marcar_checklist": Marca o desmarca suplementos tomados (creatina, omega3, whey, magnesio), comidas o el entreno de hoy.
6. "registrar_metricas": Registra horas de sueño de anoche, RPE de esfuerzo de la sesión (1-10) o peso corporal.
7. "programar_alarma": Ajusta y activa alarmas (workout, creatina, hidratacion, magnesio) con hora HH:MM.

REGLAS DE ORO:
- Si el usuario te pide añadir o modificar algo, EJECUTA SIEMPRE la herramienta correspondiente.
- NUNCA respondas diciendo "Hecho" o "Te lo he apuntado" si no has ejecutado antes la herramienta. Confirma la acción REALIZADA basándote en el resultado que te devuelva la herramienta.`;

        // ── Claude API Tools definition (Anthropic JSON Schema) ──
        const CLAUDE_TOOLS = [
          {
            name: 'consultar_entrenamiento',
            description: 'Consulta el entrenamiento programado para un día específico de la semana (ej. "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "hoy", "mañana").',
            input_schema: {
              type: 'object',
              properties: {
                dia: { type: 'string', description: 'Día de la semana a consultar' }
              },
              required: ['dia']
            }
          },
          {
            name: 'modificar_entrenamiento',
            description: 'Modifica o añade ejercicios al entrenamiento de un día de la semana en la app.',
            input_schema: {
              type: 'object',
              properties: {
                dia: { type: 'string', description: 'Día a modificar' },
                modo: { type: 'string', enum: ['reemplazar', 'anadir'], description: 'Si es "anadir" conserva los ejercicios actuales y suma los nuevos. Si es "reemplazar" sustituye todos.' },
                disciplina: { type: 'string', description: 'Nombre de la disciplina (opcional)' },
                titulo: { type: 'string', description: 'Título de la sesión (opcional)' },
                ejercicios: {
                  type: 'array',
                  description: 'Array de ejercicios',
                  items: {
                    type: 'object',
                    properties: {
                      nombre: { type: 'string', description: 'Nombre del ejercicio' },
                      series: { type: 'string', description: 'Número de series' },
                      reps: { type: 'string', description: 'Repeticiones o tiempo' },
                      notas: { type: 'string', description: 'Notas técnicas o RPE' }
                    },
                    required: ['nombre']
                  }
                }
              },
              required: ['dia', 'ejercicios']
            }
          },
          {
            name: 'modificar_mercadona',
            description: 'Añade o elimina productos de la lista de la compra de Mercadona en la app.',
            input_schema: {
              type: 'object',
              properties: {
                accion: { type: 'string', enum: ['anadir', 'eliminar'], description: 'Acción a realizar' },
                nombre: { type: 'string', description: 'Nombre del producto de Mercadona' },
                peso_o_cantidad: { type: 'string', description: 'Peso o cantidad (ej. "1 kg", "500g", "2 botes")' },
                categoria: { type: 'string', enum: ['fresh', 'pantry', 'supplements', 'snacks'], description: 'Categoría en Mercadona' }
              },
              required: ['accion', 'nombre']
            }
          },
          {
            name: 'modificar_comida',
            description: 'Añade o retira alimentos de una comida del plan diario (desayuno, snack, comida, merienda, cena).',
            input_schema: {
              type: 'object',
              properties: {
                accion: { type: 'string', enum: ['anadir', 'eliminar'], description: 'Acción a realizar' },
                comida: { type: 'string', enum: ['desayuno', 'snack', 'comida', 'merienda', 'cena'], description: 'Comida a modificar' },
                nombre: { type: 'string', description: 'Nombre del alimento' },
                cantidad: { type: 'string', description: 'Cantidad o ración' }
              },
              required: ['accion', 'comida', 'nombre']
            }
          },
          {
            name: 'marcar_checklist',
            description: 'Marca o desmarca elementos completados hoy (suplementos, comidas o entreno).',
            input_schema: {
              type: 'object',
              properties: {
                elemento: { type: 'string', enum: ['creatina', 'omega3', 'whey', 'magnesio', 'desayuno', 'snack', 'comida', 'merienda', 'cena', 'entrenamiento'], description: 'Elemento a marcar' },
                completado: { type: 'boolean', description: 'true para marcar completado, false para desmarcar' }
              },
              required: ['elemento']
            }
          },
          {
            name: 'registrar_metricas',
            description: 'Registra métricas diarias del atleta: horas de sueño de anoche, RPE de esfuerzo percibido (1-10) o peso corporal en kg.',
            input_schema: {
              type: 'object',
              properties: {
                sueno_horas: { type: 'number', description: 'Horas de sueño dormidas' },
                rpe: { type: 'number', description: 'Nivel de esfuerzo percibido (1 a 10)' },
                peso_kg: { type: 'number', description: 'Peso corporal en kg' }
              }
            }
          },
          {
            name: 'programar_alarma',
            description: 'Configura la hora y activa una alarma en la app.',
            input_schema: {
              type: 'object',
              properties: {
                alarma: { type: 'string', enum: ['workout', 'creatina', 'hidratacion', 'magnesio'], description: 'Tipo de alarma' },
                hora: { type: 'string', description: 'Hora en formato HH:MM (ej. 09:30)' },
                titulo: { type: 'string', description: 'Título personalizado opcional' }
              },
              required: ['alarma', 'hora']
            }
          }
        ];

        // ── Gemini API Tools definition ──
        const geminiTools = [{
          function_declarations: [
            {
              name: 'consultar_entrenamiento',
              description: 'Consulta el entrenamiento de un día de la semana (lunes a domingo, hoy o mañana).',
              parameters: {
                type: 'OBJECT',
                properties: {
                  dia: { type: 'STRING', description: 'Día de la semana a consultar' }
                },
                required: ['dia']
              }
            },
            {
              name: 'modificar_entrenamiento',
              description: 'Modifica o añade ejercicios al plan de entrenamiento de un día específico en la app.',
              parameters: {
                type: 'OBJECT',
                properties: {
                  dia: { type: 'STRING', description: 'Día de la semana a modificar' },
                  modo: { type: 'STRING', description: 'reemplazar o anadir' },
                  disciplina: { type: 'STRING', description: 'Disciplina del entrenamiento' },
                  titulo: { type: 'STRING', description: 'Título de la sesión' },
                  ejercicios: {
                    type: 'ARRAY',
                    description: 'Lista de ejercicios a programar',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        nombre: { type: 'STRING', description: 'Nombre del ejercicio' },
                        series: { type: 'STRING', description: 'Número de series' },
                        reps: { type: 'STRING', description: 'Repeticiones' },
                        notas: { type: 'STRING', description: 'Notas técnicas' }
                      },
                      required: ['nombre']
                    }
                  }
                },
                required: ['dia', 'ejercicios']
              }
            },
            {
              name: 'modificar_mercadona',
              description: 'Añade o elimina productos de la lista de la compra de Mercadona en la app.',
              parameters: {
                type: 'OBJECT',
                properties: {
                  accion: { type: 'STRING', description: 'anadir o eliminar' },
                  nombre: { type: 'STRING', description: 'Nombre del producto de Mercadona' },
                  peso_o_cantidad: { type: 'STRING', description: 'Peso o cantidad (ej. 1 kg, 500g)' },
                  categoria: { type: 'STRING', description: 'fresh, pantry, supplements o snacks' }
                },
                required: ['accion', 'nombre']
              }
            },
            {
              name: 'modificar_comida',
              description: 'Añade o retira alimentos de una comida del plan diario (desayuno, snack, comida, merienda, cena).',
              parameters: {
                type: 'OBJECT',
                properties: {
                  accion: { type: 'STRING', description: 'anadir o eliminar' },
                  comida: { type: 'STRING', description: 'desayuno, snack, comida, merienda o cena' },
                  nombre: { type: 'STRING', description: 'Nombre del alimento' },
                  cantidad: { type: 'STRING', description: 'Cantidad o ración' }
                },
                required: ['accion', 'comida', 'nombre']
              }
            },
            {
              name: 'marcar_checklist',
              description: 'Marca o desmarca elementos completados hoy (suplementos, comidas o entreno).',
              parameters: {
                type: 'OBJECT',
                properties: {
                  elemento: { type: 'STRING', description: 'creatina, omega3, whey, magnesio, desayuno, snack, comida, merienda, cena, o entrenamiento' },
                  completado: { type: 'BOOLEAN', description: 'true para completado, false para desmarcar' }
                },
                required: ['elemento']
              }
            },
            {
              name: 'registrar_metricas',
              description: 'Registra horas de sueño, nivel RPE (1-10) o peso corporal en kg.',
              parameters: {
                type: 'OBJECT',
                properties: {
                  sueno_horas: { type: 'NUMBER', description: 'Horas de sueño' },
                  rpe: { type: 'NUMBER', description: 'RPE 1-10' },
                  peso_kg: { type: 'NUMBER', description: 'Peso en kg' }
                }
              }
            },
            {
              name: 'programar_alarma',
              description: 'Configura y activa una alarma en la app.',
              parameters: {
                type: 'OBJECT',
                properties: {
                  alarma: { type: 'STRING', description: 'workout, creatina, hidratacion o magnesio' },
                  hora: { type: 'STRING', description: 'Hora en formato HH:MM (ej. 09:30)' },
                  titulo: { type: 'STRING', description: 'Título personalizado opcional' }
                },
                required: ['alarma', 'hora']
              }
            }
          ]
        }];

        // ════════════════════════════════════════════════════════════════
        // CAMINO A: CLAUDE API (Anthropic Messages API con Tool Use Multi-Turn)
        // ════════════════════════════════════════════════════════════════
        if (anthropicApiKey) {
          const claudeMessages = [];
          for (const h of conversationHistory.slice(-6)) {
            claudeMessages.push({
              role: h.role === 'user' ? 'user' : 'assistant',
              content: typeof h.content === 'string' ? h.content : JSON.stringify(h.content)
            });
          }
          claudeMessages.push({
            role: 'user',
            content: userMessage
          });

          let finalReply = '';
          let turns = 0;

          while (turns < 4) {
            const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': anthropicApiKey,
                'anthropic-version': '2023-06-01'
              },
              body: JSON.stringify({
                model: env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
                max_tokens: 1500,
                system: systemInstruction,
                messages: claudeMessages,
                tools: CLAUDE_TOOLS
              })
            });

            if (!claudeRes.ok) {
              const errBody = await claudeRes.text();
              throw new Error(`Error en Claude API (${claudeRes.status}): ${errBody}`);
            }

            const claudeData = await claudeRes.json();
            const contentBlocks = claudeData.content || [];

            const textBlocks = contentBlocks.filter(b => b.type === 'text').map(b => b.text).join('\n');
            if (textBlocks) finalReply = textBlocks;

            if (claudeData.stop_reason === 'tool_use') {
              claudeMessages.push({ role: 'assistant', content: contentBlocks });

              const toolUseBlocks = contentBlocks.filter(b => b.type === 'tool_use');
              const toolResultBlocks = [];

              for (const tu of toolUseBlocks) {
                const result = executeToolByName(tu.name, tu.input);
                toolExecutions.push({ id: tu.id, name: tu.name, input: tu.input, result });
                toolResultBlocks.push({
                  type: 'tool_result',
                  tool_use_id: tu.id,
                  content: JSON.stringify(result),
                  is_error: !result.success
                });
              }

              claudeMessages.push({ role: 'user', content: toolResultBlocks });
              turns++;
            } else {
              break;
            }
          }

          return corsResponse({
            reply: finalReply || 'Petición procesada correctamente por el Coach.',
            modified_workouts: modifiedWorkouts,
            tool_executions: toolExecutions,
            actions: clientActions
          }, 200);
        }

        // ════════════════════════════════════════════════════════════════
        // CAMINO B: GEMINI FUNCTION CALLING (Bucle Multi-Turn con Tools Activos)
        // ════════════════════════════════════════════════════════════════
        const contents = [];
        for (const h of conversationHistory.slice(-4)) {
          contents.push({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: typeof h.content === 'string' ? h.content : JSON.stringify(h.content) }]
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: userMessage }]
        });

        const callGeminiWithFallback = async (payload) => {
          const candidateModels = [
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-flash-latest'
          ];
          let lastErrText = '';
          for (const model of candidateModels) {
            try {
              const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (res.ok) {
                return await res.json();
              }
              const errTxt = await res.text();
              lastErrText = `(${model} ${res.status}): ${errTxt}`;
              console.warn(`Fallback modelo Gemini ${model} falló:`, res.status, errTxt);
            } catch (err) {
              lastErrText = `(${model}): ${err.message}`;
            }
          }
          throw new Error(`Gemini API error: ${lastErrText}`);
        };

        let finalReply = '';
        let turns = 0;

        while (turns < 4) {
          const geminiData = await callGeminiWithFallback({
            contents,
            systemInstruction: { parts: [{ text: systemInstruction }] },
            tools: geminiTools
          });

          const candidate = geminiData.candidates?.[0];
          const parts = candidate?.content?.parts || [];
          const functionCallPart = parts.find(p => p.functionCall);

          if (functionCallPart && functionCallPart.functionCall) {
            const fc = functionCallPart.functionCall;
            const result = executeToolByName(fc.name, fc.args);

            toolExecutions.push({ name: fc.name, input: fc.args, result });

            contents.push(candidate.content);
            contents.push({
              role: 'user',
              parts: [{
                functionResponse: {
                  name: fc.name,
                  response: result
                }
              }]
            });

            turns++;
          } else {
            finalReply = parts.map(p => p.text || '').join('\n');
            break;
          }
        }

        return corsResponse({
          reply: finalReply || 'Petición procesada correctamente por el Coach.',
          modified_workouts: modifiedWorkouts,
          tool_executions: toolExecutions,
          actions: clientActions
        }, 200);

      } catch (err) {
        return corsResponse({ error: err.message }, 500);
      }
    }

    // ─── 4.6. RUTAS DE NOTIFICACIONES PUSH EN SEGUNDO PLANO (W3C Push API + VAPID) ───
    if (url.pathname === '/api/push/vapid-public-key' && request.method === 'GET') {
      return corsResponse({ publicKey: VAPID_PUBLIC_KEY }, 200);
    }

    if (url.pathname === '/api/push/subscribe' && request.method === 'POST') {
      try {
        let body = {};
        try { body = await request.json(); } catch (_) {}
        const sub = body.subscription || body;
        if (!sub || !sub.endpoint) {
          return corsResponse({ error: 'Endpoint de suscripción requerido' }, 400);
        }

        const endpoint = sub.endpoint;
        const p256dh = sub.keys?.p256dh || '';
        const auth = sub.keys?.auth || '';
        const userId = body.userId || 'u_victor';

        if (env.DB) {
          await ensurePushTables(env);
          const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          await env.DB.prepare(`
            INSERT INTO push_subscriptions (id, user_id, endpoint, p256dh, auth, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'))
            ON CONFLICT(endpoint) DO UPDATE SET
              p256dh = excluded.p256dh,
              auth = excluded.auth,
              updated_at = datetime('now')
          `).bind(subId, userId, endpoint, p256dh, auth).run();
        }

        return corsResponse({ success: true, message: 'Dispositivo registrado para Web Push en segundo plano' }, 200);
      } catch (err) {
        return corsResponse({ error: err.message }, 500);
      }
    }

    if (url.pathname === '/api/push/test' && request.method === 'POST') {
      try {
        let body = {};
        try { body = await request.json(); } catch (_) {}
        const delaySeconds = parseInt(body.delaySeconds, 10) || 0;
        const alertData = {
          title: body.title || '⚡ VIROL // VALENCIA 42K PRO',
          body: body.body || '¡Prueba en segundo plano! Tu móvil recibe esto con la pantalla apagada.',
          tag: 'virol-test-alert',
          url: './index.html'
        };

        if (!env.DB) {
          return corsResponse({ error: 'Base de datos D1 no configurada' }, 500);
        }

        await ensurePushTables(env);
        const subs = await env.DB.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?').bind('u_victor').all();
        const results = subs.results || [];

        if (results.length === 0) {
          return corsResponse({
            success: false,
            message: 'No hay dispositivos suscritos. Pulsa primero "Activar Notificaciones Push" en la app desde tu móvil.'
          }, 200);
        }

        const dispatchAll = async () => {
          if (delaySeconds > 0) {
            await new Promise(r => setTimeout(r, delaySeconds * 1000));
          }
          for (const s of results) {
            await sendWebPushNotification(s, alertData, env);
          }
        };

        if (ctx && typeof ctx.waitUntil === 'function') {
          ctx.waitUntil(dispatchAll());
        } else {
          await dispatchAll();
        }

        return corsResponse({
          success: true,
          message: delaySeconds > 0 
            ? `Notificación programada en ${delaySeconds} segundos. ¡Bloquea la pantalla de tu móvil ahora!`
            : `Notificación enviada a ${results.length} dispositivo(s).`
        }, 200);
      } catch (err) {
        return corsResponse({ error: err.message }, 500);
      }
    }

    if (url.pathname === '/api/push/pending' && request.method === 'GET') {
      try {
        if (!env.DB) return corsResponse({ title: 'VIROL 42K PRO', body: '¡Recordatorio de entrenamiento!' }, 200);
        const row = await env.DB.prepare("SELECT title, body, tag, url FROM pending_push_alerts WHERE id = 'latest_alert'").first().catch(() => null);
        return corsResponse(row || { title: 'VIROL 42K PRO', body: '¡Recordatorio de entrenamiento!' }, 200);
      } catch (_) {
        return corsResponse({ title: 'VIROL 42K PRO', body: '¡Recordatorio de entrenamiento!' }, 200);
      }
    }

    // ─── 5. Archivos estáticos ────────────────────────────────────
    const response = await env.ASSETS.fetch(request);
    const newHeaders = new Headers(response.headers);
    const p = url.pathname;
    if (p === '/' || p.endsWith('.html') || p.endsWith('sw.js') || p.endsWith('.js') || p.endsWith('.css')) {
      newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      newHeaders.set('Pragma', 'no-cache');
      newHeaders.set('Expires', '0');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },

  async scheduled(event, env, ctx) {
    const madridDateStr = new Intl.DateTimeFormat('es-ES', {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date());

    console.log(`⏰ [CRON SCHEDULED] Minuto activo en Madrid: ${madridDateStr}`);

    const alarmsMap = {
      '09:00': { title: '🏋️‍♂️ ENTRENO DEL DÍA', body: 'Víctor, hora de tu sesión de entrenamiento programada.' },
      '12:00': { title: '⚡ CREATINA & RECUPERACIÓN', body: 'Víctor: 5g de Creatina en agua y batido de 30g de Proteína Whey.' },
      '16:00': { title: '💧 CONTROL DE HIDRATACIÓN', body: 'Asegura 2.0 L de agua acumulados antes de la tarde.' },
      '21:30': { title: '🌙 MAGNESIO & DESCANSO', body: 'Víctor: Toma el magnesio y registra tus sensaciones en la app.' }
    };

    const currentAlarm = alarmsMap[madridDateStr];
    if (!currentAlarm || !env.DB) return;

    try {
      await ensurePushTables(env);
      const subs = await env.DB.prepare('SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?').bind('u_victor').all();
      const results = subs.results || [];
      for (const sub of results) {
        ctx.waitUntil(sendWebPushNotification(sub, currentAlarm, env));
      }
    } catch (e) {
      console.warn('[CRON] Error al despachar alarmas:', e.message);
    }
  }
};

// ─── CONFIGURACIÓN Y HELPERS DE WEB PUSH (VAPID RFC 8292) ────────
const VAPID_PUBLIC_KEY = 'BAJv4jQOIroFQWmVW5Q-xMYsZeKU7_M4jltMoC4c9NRWKNWcM0Vi96Yt4u_j7tCqbsqqOsy5zrPx82uQswvzeUY';
const VAPID_PRIVATE_KEY = 'NVWaW1lA9JX33r23nrBGLF1IktN8u64RdjTKzS4CrM0';
const VAPID_SUBJECT = 'mailto:victor@valencia42k.pro';

function b64UrlToBuf(b64url) {
  let b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bufToB64Url(buf) {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function createVapidJwt(audience) {
  const privRaw = b64UrlToBuf(VAPID_PRIVATE_KEY);
  const pubRaw = b64UrlToBuf(VAPID_PUBLIC_KEY);

  const jwk = {
    kty: 'EC',
    crv: 'P-256',
    x: bufToB64Url(pubRaw.slice(1, 33)),
    y: bufToB64Url(pubRaw.slice(33, 65)),
    d: bufToB64Url(privRaw)
  };

  const key = await crypto.subtle.importKey(
    'jwk',
    jwk,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const header = { alg: 'ES256', typ: 'JWT' };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: VAPID_SUBJECT
  };

  const encHeader = bufToB64Url(new TextEncoder().encode(JSON.stringify(header)));
  const encPayload = bufToB64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const dataToSign = new TextEncoder().encode(encHeader + '.' + encPayload);

  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    key,
    dataToSign
  );

  return encHeader + '.' + encPayload + '.' + bufToB64Url(sig);
}

async function ensurePushTables(env) {
  if (!env.DB) return;
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'u_victor',
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run().catch(() => {});

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS pending_push_alerts (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT 'u_victor',
      title TEXT,
      body TEXT,
      tag TEXT,
      url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run().catch(() => {});
}

async function sendWebPushNotification(sub, alertData, env) {
  const endpoint = sub.endpoint;
  if (!endpoint) return { success: false, error: 'No endpoint' };

  try {
    const url = new URL(endpoint);
    const audience = `${url.protocol}//${url.host}`;
    const jwt = await createVapidJwt(audience);

    // Guardar última alerta pendiente en D1 para lectura si el push despierta sin payload
    if (env.DB) {
      await ensurePushTables(env);
      await env.DB.prepare(`
        INSERT OR REPLACE INTO pending_push_alerts (id, user_id, title, body, tag, url, created_at)
        VALUES ('latest_alert', 'u_victor', ?, ?, ?, ?, datetime('now'))
      `).bind(
        alertData.title || 'VIROL 42K PRO',
        alertData.body || '¡Recordatorio de entrenamiento!',
        alertData.tag || 'virol-alert',
        alertData.url || './index.html'
      ).run().catch(() => {});
    }

    const headers = {
      'TTL': '86400',
      'Urgency': 'high',
      'Authorization': `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`
    };

    const pushRes = await fetch(endpoint, {
      method: 'POST',
      headers
    });

    console.log(`[PUSH] Disparado a ${endpoint.substring(0, 45)}... HTTP: ${pushRes.status}`);

    if (pushRes.status === 410 || pushRes.status === 404) {
      if (env.DB) {
        await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').bind(endpoint).run().catch(() => {});
      }
      return { success: false, expired: true, status: pushRes.status };
    }

    return { success: pushRes.ok, status: pushRes.status };
  } catch (err) {
    console.error('[PUSH ERROR]:', err);
    return { success: false, error: err.message };
  }
}

// Helper: refresco automático de token OAuth Strava y persistencia en D1
async function refreshStravaOAuthToken(refreshToken, env) {
  const clientId = env.STRAVA_CLIENT_ID || '243799';
  const clientSecret = env.STRAVA_CLIENT_SECRET;

  if (!clientSecret) {
    console.error('STRAVA_CLIENT_SECRET no configurada en Cloudflare Secrets');
    return null;
  }

  if (!refreshToken) return null;

  try {
    const res = await fetch('https://www.strava.com/api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (!res.ok) {
      console.warn('Fallo refresco Strava OAuth:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    if (env.DB && data.access_token) {
      try {
        await env.DB.prepare(`
          UPDATE users 
          SET strava_access_token = ?, strava_refresh_token = ?, strava_token_expires_at = datetime(?, 'unixepoch'), updated_at = datetime('now')
          WHERE id = 'u_victor'
        `).bind(data.access_token, data.refresh_token, data.expires_at).run();
      } catch (e) {
        console.warn('Error actualizando tokens en D1:', e.message);
      }
    }
    return data;
  } catch (err) {
    console.error('Excepción refrescando token Strava:', err);
    return null;
  }
}

// Helper: respuesta JSON con cabeceras CORS
function corsResponse(body, status = 200) {
  return new Response(body !== null ? JSON.stringify(body) : null, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Strava-Refresh-Token',
    },
  });
}

// Helper: fusión inteligente y granular de estados entre clientes (PC/Móvil) y D1
function mergeAppStates(prev = {}, incoming = {}) {
  const merged = { ...prev, ...incoming };

  // 1. Fusión granular de días
  merged.days = { ...(prev.days || {}) };
  if (incoming.days && typeof incoming.days === 'object') {
    for (const [dayKey, inDay] of Object.entries(incoming.days)) {
      if (!merged.days[dayKey]) {
        merged.days[dayKey] = { ...inDay };
      } else {
        merged.days[dayKey] = {
          ...merged.days[dayKey],
          ...inDay
        };
        // Preservar actividad Strava si el estado entrante no la traía pero el previo sí
        if (!inDay.stravaActivity && merged.days[dayKey].stravaActivity) {
          merged.days[dayKey].stravaActivity = merged.days[dayKey].stravaActivity;
        }
      }
    }
  }

  // 2. Fusión de lista de la compra de Mercadona
  if (incoming.mercadonaList && typeof incoming.mercadonaList === 'object') {
    merged.mercadonaList = { ...(prev.mercadonaList || {}) };
    for (const [catKey, inCat] of Object.entries(incoming.mercadonaList)) {
      if (!merged.mercadonaList[catKey]) {
        merged.mercadonaList[catKey] = inCat;
      } else if (Array.isArray(inCat.items)) {
        const prevItems = prev.mercadonaList?.[catKey]?.items || [];
        const inItems = inCat.items || [];
        const itemMap = new Map();
        for (const it of prevItems) {
          if (it && it.name) itemMap.set(it.name.trim().toLowerCase(), { ...it });
        }
        for (const it of inItems) {
          if (it && it.name) {
            const key = it.name.trim().toLowerCase();
            const existing = itemMap.get(key);
            itemMap.set(key, { ...(existing || {}), ...it });
          }
        }
        merged.mercadonaList[catKey] = {
          ...inCat,
          items: Array.from(itemMap.values())
        };
      }
    }
  }

  // 3. Fusión de historial semanal (único por timestamp o fecha)
  if (Array.isArray(incoming.history) || Array.isArray(prev.history)) {
    const histMap = new Map();
    for (const h of (prev.history || [])) {
      if (h) histMap.set(String(h.timestamp || h.date), h);
    }
    for (const h of (incoming.history || [])) {
      if (h) histMap.set(String(h.timestamp || h.date), h);
    }
    merged.history = Array.from(histMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }

  // 4. Timestamp consolidado
  merged.lastUpdated = Math.max(prev.lastUpdated || 0, incoming.lastUpdated || 0, Date.now());

  return merged;
}

// Helper: llamada unificada y resiliente a la API de Gemini con fallback de modelos
async function callGeminiApi(prompt, systemInstruction = '', jsonMimeType = true, env) {
  const geminiApiKey = env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error('GEMINI_API_KEY no configurada en las variables o secretos de Cloudflare');
  }

  const payload = {
    contents: [{
      parts: [{
        text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt
      }]
    }]
  };

  if (jsonMimeType) {
    payload.generationConfig = { response_mime_type: 'application/json' };
  }

  const candidateModels = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-flash-latest'
  ];

  let lastErrorText = '';
  for (const model of candidateModels) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          if (jsonMimeType) {
            try {
              return JSON.parse(rawText);
            } catch (_) {
              return { raw_text: rawText };
            }
          }
          return rawText;
        }
      } else {
        lastErrorText = await res.text();
        console.warn(`Fallback modelo Gemini ${model} falló:`, res.status, lastErrorText);
      }
    } catch (err) {
      lastErrorText = err.message;
    }
  }

  throw new Error(`Error en llamada a Gemini API: ${lastErrorText}`);
}

