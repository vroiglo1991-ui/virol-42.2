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

    // ─── 4. Archivos estáticos ────────────────────────────────────
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
