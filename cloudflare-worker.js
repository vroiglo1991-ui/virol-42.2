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
  async fetch(request, env) {
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

        const clientId = body.client_id || env.STRAVA_CLIENT_ID || '243799';
        const clientSecret = body.client_secret || env.STRAVA_CLIENT_SECRET || '74c79e75d6bbe253d1f91606ee06f074262fe096';
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
        const clientSecret = env.STRAVA_CLIENT_SECRET || '74c79e75d6bbe253d1f91606ee06f074262fe096';

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

          const redirectUrl = new URL('/', url.origin);
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
        const clientSecret = env.STRAVA_CLIENT_SECRET || '74c79e75d6bbe253d1f91606ee06f074262fe096';

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
          'gemini-3.7-flash',
          'gemini-3.6-flash',
          'gemini-3.5-flash',
          'gemini-3.5-flash-lite',
          'gemini-flash-latest',
          'gemini-2.5-flash'
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
        const geminiApiKey = env.GEMINI_API_KEY;

        if (!anthropicApiKey && !geminiApiKey) {
          return corsResponse({ error: 'Ninguna API Key configurada (se requiere ANTHROPIC_API_KEY o GEMINI_API_KEY)' }, 500);
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
              error: `El día '${diaStr}' no es válido. No se puede modificar el entrenamiento. Especifica: lunes, martes, miércoles, jueves, viernes, sábado, domingo, hoy o mañana.`
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
          const updatedWorkout = {
            ...prev,
            steps: parsedSteps
          };
          workouts[dayIdx] = updatedWorkout;

          return {
            success: true,
            dia: updatedWorkout.name || diaStr,
            dia_indice: dayIdx,
            mensaje: `Entrenamiento de ${updatedWorkout.name || diaStr} actualizado con éxito con ${parsedSteps.length} ejercicios.`,
            steps: parsedSteps,
            updatedWorkout
          };
        }

        const contextStr = JSON.stringify(contextData, null, 2);

        const systemInstruction = `Eres Virol AI Coach, el entrenador de atletismo de élite y nutricionista personal de Víctor (73 kg, 178 cm, objetivo Maratón Valencia 42K).
Eres directo, riguroso, de corte militar-atlético brutalista y científico: sin clichés ni frases vacías. Hablas con seguridad, claridad y autoridad técnica.

CONTEXTO DEL ATLETA:
${contextStr}

CAPACIDAD DE ACCIÓN REAL (TOOL USE / FUNCTION CALLING):
Tienes acceso a herramientas para consultar y modificar directamente los entrenamientos del plan semanal de la app (la misma estructura que alimenta la pestaña "Plan 7 días" y el día activo):
1. "consultar_entrenamiento": Úsala cuando el atleta pregunte por su entrenamiento de un día o antes de modificarlo para conocer la rutina actual y evitar inventar ejercicios inexistentes.
2. "modificar_entrenamiento": Úsala cuando el usuario pida cambiar o ajustar un entrenamiento (ej: "cámbiame el entreno de pierna de mañana", "ponme sentadilla búlgara el viernes").
   - Debes indicar el "dia" y la lista de "ejercicios" con su nombre, series, reps y notas.
   - REGLA ESTRICTA: Confirma al usuario el cambio REALIZADO ÚNICAMENTE DESPUÉS de que la herramienta se haya ejecutado con éxito en el sistema. Nunca antes.
   - Si la herramienta falla (por ejemplo, si el día es inválido), debes explicarle explícitamente al usuario el motivo del fallo y qué días son válidos, sin dar confirmaciones falsas.`;

        // ── Claude API Tools definition (Anthropic JSON Schema) ──
        const CLAUDE_TOOLS = [
          {
            name: 'consultar_entrenamiento',
            description: 'Consulta el entrenamiento programado para un día específico de la semana (ej. "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "hoy", "mañana"). Devuelve la disciplina, título, kilometraje y lista detallada de ejercicios actuales.',
            input_schema: {
              type: 'object',
              properties: {
                dia: {
                  type: 'string',
                  description: 'Día de la semana a consultar (ej: "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "hoy", "mañana")'
                }
              },
              required: ['dia']
            }
          },
          {
            name: 'modificar_entrenamiento',
            description: 'Modifica y actualiza directamente el plan de entrenamiento de un día de la semana en la app. Actualiza la estructura de datos que alimenta la pestaña "Plan 7 días" y el día seleccionado, sustituyendo o reprogramando los ejercicios de ese día.',
            input_schema: {
              type: 'object',
              properties: {
                dia: {
                  type: 'string',
                  description: 'Día de la semana a modificar (ej: "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "hoy", "mañana")'
                },
                ejercicios: {
                  type: 'array',
                  description: 'Array de ejercicios que compondrán el entrenamiento',
                  items: {
                    type: 'object',
                    properties: {
                      nombre: { type: 'string', description: 'Nombre del ejercicio (ej. Sentadilla búlgara, Press militar)' },
                      series: { type: 'string', description: 'Número de series (ej. "4", "3-4")' },
                      reps: { type: 'string', description: 'Repeticiones o tiempo (ej. "8-10 reps", "15 reps", "45 seg")' },
                      notas: { type: 'string', description: 'Notas técnicas o RPE (ej. "descanso 90s, control excéntrico 2s")' }
                    },
                    required: ['nombre']
                  }
                }
              },
              required: ['dia', 'ejercicios']
            }
          }
        ];

        const modifiedWorkouts = [];
        const toolExecutions = [];

        // ════════════════════════════════════════════════════════════════
        // CAMINO A: CLAUDE API (Anthropic Messages API con Tool Use)
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
                let result = null;
                if (tu.name === 'consultar_entrenamiento') {
                  result = executeConsultarEntrenamiento(tu.input, currentWorkouts, selectedDayIndex);
                } else if (tu.name === 'modificar_entrenamiento') {
                  result = executeModificarEntrenamiento(tu.input, currentWorkouts, selectedDayIndex);
                  if (result.success) {
                    modifiedWorkouts.push(result);
                  }
                } else {
                  result = { success: false, error: `Herramienta '${tu.name}' no implementada.` };
                }

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
            reply: finalReply || 'Entrenamiento procesado correctamente por el Coach.',
            modified_workouts: modifiedWorkouts,
            tool_executions: toolExecutions,
            actions: modifiedWorkouts.map(m => `Entreno de ${m.dia} actualizado en la app (${m.steps.length} ejercicios)`)
          }, 200);
        }

        // ════════════════════════════════════════════════════════════════
        // CAMINO B: GEMINI FUNCTION CALLING (Fallback resiliente)
        // ════════════════════════════════════════════════════════════════
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
              description: 'Modifica los ejercicios del plan de entrenamiento de un día específico en la app.',
              parameters: {
                type: 'OBJECT',
                properties: {
                  dia: { type: 'STRING', description: 'Día de la semana a modificar' },
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
            }
          ]
        }];

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

        const geminiRes1 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemInstruction }] },
            tools: geminiTools
          })
        });

        if (!geminiRes1.ok) {
          const errTxt = await geminiRes1.text();
          throw new Error(`Gemini API error (${geminiRes1.status}): ${errTxt}`);
        }

        const geminiData1 = await geminiRes1.json();
        const candidate = geminiData1.candidates?.[0];
        const parts = candidate?.content?.parts || [];
        const functionCallPart = parts.find(p => p.functionCall);

        let finalReply = '';

        if (functionCallPart && functionCallPart.functionCall) {
          const fc = functionCallPart.functionCall;
          let result = null;

          if (fc.name === 'consultar_entrenamiento') {
            result = executeConsultarEntrenamiento(fc.args, currentWorkouts, selectedDayIndex);
          } else if (fc.name === 'modificar_entrenamiento') {
            result = executeModificarEntrenamiento(fc.args, currentWorkouts, selectedDayIndex);
            if (result.success) {
              modifiedWorkouts.push(result);
            }
          }

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

          const geminiRes2 = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemInstruction }] }
            })
          });

          if (geminiRes2.ok) {
            const geminiData2 = await geminiRes2.json();
            finalReply = geminiData2.candidates?.[0]?.content?.parts?.[0]?.text || '';
          }
        } else {
          finalReply = parts.map(p => p.text || '').join('\n');
        }

        return corsResponse({
          reply: finalReply || 'Entrenamiento procesado correctamente.',
          modified_workouts: modifiedWorkouts,
          tool_executions: toolExecutions,
          actions: modifiedWorkouts.map(m => `Entreno de ${m.dia} actualizado en la app (${m.steps.length} ejercicios)`)
        }, 200);

      } catch (err) {
        return corsResponse({ error: err.message }, 500);
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
};

// Helper: refresco automático de token OAuth Strava y persistencia en D1
async function refreshStravaOAuthToken(refreshToken, env) {
  const clientId = env.STRAVA_CLIENT_ID || '243799';
  const clientSecret = env.STRAVA_CLIENT_SECRET || '74c79e75d6bbe253d1f91606ee06f074262fe096';

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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Strava-Refresh-Token',
    },
  });
}
