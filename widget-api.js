/**
 * Widget API Module
 * Handles all API communication with the Ceron Engine backend
 */

export class WidgetAPI {
  constructor(config = {}) {
    this.apiUrl =
      config.apiUrl ||
      "https://cr-engine.jnowlan21.workers.dev/api/support-bot/query";
    this.apiKey = config.apiKey || null;
    this.clientId = config.clientId || null;
    this.botId = config.botId || null;
  }

  /**
   * Get API key from config or localStorage
   */
  getApiKey() {
    if (this.apiKey) {
      return this.apiKey;
    }
    return localStorage.getItem("generated_api_key");
  }

  /**
   * Send a chat message to the API
   */
  async sendMessage(payload) {
    const apiKey = this.getApiKey();

    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      throw new Error(
        "API key not found. Please generate an API key in your dashboard."
      );
    }

    console.log("Sending message to API:", {
      clientId: payload.client_id,
      botId: payload.bot_id,
      hasApiKey: !!apiKey,
    });

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const backendError =
        errorData.error ||
        errorData.message ||
        "Something went wrong. Please try again.";
      throw new Error(backendError);
    }

    const data = await response.json();
    return this.extractBotResponse(data);
  }

  /**
   * Extract bot response from API response
   */
  extractBotResponse(data) {
    return (
      data.bot_answer ||
      data.reply ||
      (data.messages && data.messages[0]?.text) ||
      "Sorry, I didn't get that."
    );
  }

  /**
   * Send warmup ping to reduce first-message latency
   */
  async sendWarmupPing(sessionId) {
    if (!this.clientId || !this.botId) {
      console.warn("Cannot send warmup ping: missing clientId or botId");
      return;
    }

    const apiKey = this.getApiKey();
    if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
      console.warn("Cannot send warmup ping: missing API key");
      return;
    }

    console.log("Sending warmup request to warm up the backend...");

    try {
      await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          client_id: this.clientId,
          bot_id: this.botId,
          session_id: sessionId,
          user_message: "__warmup__",
          page_url: window.location.href,
        }),
      });
    } catch (error) {
      console.warn("Warmup ping failed:", error);
    }
  }

  /**
   * Create message payload
   */
  createPayload(userMessage, sessionId) {
    return {
      client_id: this.clientId,
      bot_id: this.botId,
      session_id: sessionId,
      user_message: userMessage,
      page_url: window.location.href,
    };
  }
}
