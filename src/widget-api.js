/**
 * Widget API Module
 * Handles all API communication with the backend
 */

export class WidgetAPI {
  constructor(config = {}) {
    this.apiKey = config.apiKey || null;
    this.clientId = config.clientId || null;
    this.botId = config.botId || null;
  }

  /**
   * Create message payload
   */
  createPayload(userMessage, sessionId) {
    return {
      client_id: this.clientId,
      user_message: userMessage,
      session_id: sessionId,
      page_url: window.location.href,
      bot_id: this.botId,
    };
  }

  /**
   * Send message to API
   */
  async sendMessage(payload) {
    if (!this.apiKey || this.apiKey === "YOUR_API_KEY_HERE") {
      throw new Error(
        "API key not found. Please generate an API key in your dashboard."
      );
    }

    const res = await fetch(
      "https://cr-engine.jnowlan21.workers.dev/api/support-bot/query",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Api-Key": this.apiKey,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const backendError =
        errorData.error ||
        errorData.message ||
        "Something went wrong. Please try again.";
      throw new Error(backendError);
    }

    const data = await res.json();
    console.log("API Response:", data);

    const botText =
      data.bot_answer ||
      data.reply ||
      (data.messages && data.messages[0]?.text) ||
      "Sorry, I didn't get that.";

    console.log("Extracted bot text:", botText);
    return botText;
  }

  /**
   * Send warmup ping to reduce first-message latency
   */
  sendWarmupPing(sessionId) {
    if (!this.clientId || !this.botId) {
      console.warn("Cannot send warmup ping: missing clientId or botId");
      return;
    }

    if (!this.apiKey || this.apiKey === "YOUR_API_KEY_HERE") {
      console.warn("Cannot send warmup ping: missing API key");
      return;
    }

    console.log("Sending warmup request to warm up the backend...");

    fetch("https://cr-engine.jnowlan21.workers.dev/api/support-bot/query", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
      },
      body: JSON.stringify({
        client_id: this.clientId,
        user_message: "ping",
        session_id: sessionId,
        page_url: window.location.href,
        bot_id: this.botId,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          await response.json();
          console.log("Warmup complete - backend is ready:", response.status);
        } else {
          console.warn("Warmup request returned error:", response.status);
        }
      })
      .catch((err) => {
        console.warn("Warmup request failed:", err);
      });
  }
}
