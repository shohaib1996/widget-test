export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    };

    // Handle preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Warm-init ping endpoint
    if (request.method === "GET" && url.pathname === "/api/support-bot/ping") {
      try {
        const client_id = url.searchParams.get("client_id") || "1001";
        const bot_id = url.searchParams.get("bot_id") || "2001";

        // Optional: Make a lightweight call to Ceron Engine to warm it up
        // For now, just return success to warm up this worker
        return new Response(
          JSON.stringify({
            status: "ok",
            message: "Worker warmed",
            client_id,
            bot_id,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (err) {
        console.error("Ping error:", err);
        return new Response(
          JSON.stringify({ status: "error", message: err.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    if (request.method === "POST" && url.pathname === "/api/widget") {
      try {
        const body = await request.json();

        const client_id = body.client_id || "1001";
        const bot_id = body.bot_id || "2001";
        const session_id = body.session_id || null;
        const user_message = body.user_message || "";
        const api_key = body.api_key || "cr_test_1234567890abcdef";
        const page_url = body.page_url || null;

        // Call the Ceron Engine API
        const ceronApiUrl =
          "https://cr-engine.jnowlan21.workers.dev/api/support-bot/query";

        const ceronPayload = {
          bot_id: bot_id,
          client_id: client_id,
          session_id: session_id,
          user_message: user_message,
          page_url: page_url,
        };

        const ceronResponse = await fetch(ceronApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": api_key,
          },
          body: JSON.stringify(ceronPayload),
        });

        if (!ceronResponse.ok) {
          const errorText = await ceronResponse.text();
          console.error("Ceron API error:", ceronResponse.status, errorText);

          return new Response(
            JSON.stringify({
              error: "API request failed",
              status: ceronResponse.status,
              details: errorText,
            }),
            {
              status: ceronResponse.status,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        const ceronData = await ceronResponse.json();

        // Transform Ceron API response to widget format
        const responseBody = {
          reply: ceronData.bot_answer || "Sorry, I didn't get that.",
          client_id,
          bot_id,
          session_id,
          confidence: ceronData.confidence || null,
          meta: ceronData.meta || {},
          messages: [
            {
              role: "bot",
              text: ceronData.bot_answer || "Sorry, I didn't get that.",
            },
          ],
        };

        return new Response(JSON.stringify(responseBody), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        console.error("Worker error:", err);
        return new Response(
          JSON.stringify({
            error: "Internal server error",
            message: err.message,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
