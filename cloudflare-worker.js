export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Endpoint para proxy de calendario iCal/ICS
    if (url.pathname === '/api/calendar') {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      }
      
      const icalUrl = url.searchParams.get("url");
      if (!icalUrl) {
        return new Response(JSON.stringify({ error: "Falta el parámetro 'url' en la consulta" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }

      try {
        const res = await fetch(icalUrl);
        if (!res.ok) throw new Error("No se pudo obtener el feed del calendario de Google");
        const icsText = await res.text();
        return new Response(icsText, {
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    // 2. Interceptar solo la ruta de la API de entrenamientos
    if (url.pathname === '/api/entrenamientos') {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        });
      }

      try {
        const tokenResponse = await fetch("https://www.strava.com/api/v3/oauth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: env.STRAVA_CLIENT_ID,
            client_secret: env.STRAVA_CLIENT_SECRET,
            refresh_token: env.STRAVA_REFRESH_TOKEN,
            grant_type: "refresh_token",
          }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
          throw new Error("No se pudo obtener el token de acceso");
        }

        const activitiesResponse = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=15", {
          headers: {
            "Authorization": `Bearer ${tokenData.access_token}`
          }
        });

        const activitiesData = await activitiesResponse.json();

        return new Response(JSON.stringify(activitiesData), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Access-Control-Allow-Origin": "*" }
        });
      }
    }

    // 3. Para todo lo demás (HTML, CSS, JS), servir los archivos estáticos evitando caché agresiva en archivos clave
    const response = await env.ASSETS.fetch(request);
    
    // Si es index.html, sw.js, o archivos JS/CSS principales, forzar validación inmediata
    const newHeaders = new Headers(response.headers);
    if (url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.endsWith('sw.js') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
      newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      newHeaders.set('Pragma', 'no-cache');
      newHeaders.set('Expires', '0');
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }
};
