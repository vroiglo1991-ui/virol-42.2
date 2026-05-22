export default {
  async fetch(request, env) {
    // 1. Manejar las preflight requests de CORS (OPTIONS)
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
      // 2. Obtener un nuevo Access Token de Strava usando el Refresh Token
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
        throw new Error("No se pudo obtener el token de acceso de Strava");
      }

      // 3. Obtener las últimas actividades con el nuevo Access Token
      const activitiesResponse = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=15", {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`
        }
      });

      const activitiesData = await activitiesResponse.json();

      // 4. Devolver los datos al frontend con cabeceras CORS
      return new Response(JSON.stringify(activitiesData), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // Permitir acceso desde tu frontend
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }
      });
    }
  }
};
