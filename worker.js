export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // IMPORTANT: Handle preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST" && url.pathname === "/api/widget") {
      try {
        const body = await request.json();

        const client_id = body.client_id || null;
        const bot_id = body.bot_id || null;
        const session_id = body.session_id || null;
        const user_message = body.user_message || "";

        const PRESET_REPLIES = [
          "Hi there! Thanks for reaching out — how can I help you today?",
          "Hello! I'm here to answer anything you need. What’s on your mind?",
          "Hey! Great to see you here. How can I assist?",
          "Hi! I’m ready whenever you are. What would you like to talk about?",
          "Welcome! Tell me what you’re looking for and I’ll do my best to help.",
          "Hello! Happy to help — just type your question below.",
          "Hi! What brings you here today?",
          "Hey there! How can I support you right now?",
          "Hello! Need assistance? Ask me anything.",
          "Hi! I’m here and ready to assist you — go ahead!",
          "Hi! Feel free to ask me anything.",
          "Hello! How can I make your day easier?",
          "Hey! What would you like help with today?",
          "Hi! I’m listening — what’s your question?",
          "Hello! What can I do for you?",
        ];

        const randomReply =
          PRESET_REPLIES[Math.floor(Math.random() * PRESET_REPLIES.length)];

        const responseBody = {
          reply: randomReply,
          client_id,
          bot_id,
          session_id,
          messages: [{ role: "bot", text: randomReply }],
        };

        return new Response(JSON.stringify(responseBody), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Invalid JSON" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
