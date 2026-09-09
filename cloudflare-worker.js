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

    // ─── 2. GET /api/entrenamientos — Proxy Strava ────────────────
    if (url.pathname === '/api/entrenamientos') {
      try {
        const tokenResponse = await fetch('https://www.strava.com/api/v3/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id:     env.STRAVA_CLIENT_ID,
            client_secret: env.STRAVA_CLIENT_SECRET,
            refresh_token: env.STRAVA_REFRESH_TOKEN,
            grant_type:    'refresh_token',
          }),
        });

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) throw new Error('No se pudo obtener el access_token de Strava');

        const activitiesResponse = await fetch(
          'https://www.strava.com/api/v3/athlete/activities?per_page=15',
          { headers: { Authorization: `Bearer ${tokenData.access_token}` } }
        );

        return corsResponse(await activitiesResponse.json(), 200);

      } catch (err) {
        return corsResponse({ error: err.message }, 500);
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

        const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest'];
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
            }
          } catch (e) {
            lastErrorText = e.message;
          }
        }

        if (!geminiData || !geminiData.candidates || !geminiData.candidates[0]) {
          return corsResponse({ error: 'Fallo al invocar Gemini API', detail: lastErrorText }, 502);
        }

        const geminiData = await geminiRes.json();
        const analysis = JSON.parse(geminiData.candidates[0].content.parts[0].text);

        return corsResponse({
          metrics: {
            totalKmDone,
            targetKm,
            completionPct: Math.round((totalKmDone / (targetKm || 1)) * 100),
            avgSleep,
            avgRPE
          },
          analysis
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

// Helper: respuesta JSON con cabeceras CORS
function corsResponse(body, status = 200) {
  return new Response(body !== null ? JSON.stringify(body) : null, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
