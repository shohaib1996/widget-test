export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Allow all origins for this demo
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle Preflight OPTIONS request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    // Handle POST /api/widget
    if (request.method === "POST" && url.pathname === "/api/widget") {
      try {
        const body = await request.json();
        const message = body.message || "No message received";

        const responseBody = JSON.stringify({
          reply: `Widget received: ${message}`,
        });

        return new Response(responseBody, {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        });
      }
    }

    // 404 for everything else
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
