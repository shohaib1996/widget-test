/**
 * CipherRow Chat Widget
 * Main orchestrator that brings together all widget modules
 */

import { WIDGET_STYLES } from "./widget-styles.js";
import { WidgetUI } from "./widget-ui.js";
import { WidgetAPI } from "./widget-api.js";

(function () {
  class CRWidget {
    constructor() {
      this.container = null;
      this.shadow = null;
      this.ui = null;
      this.api = null;
      this.sessionId = null;
      this.isOpen = false;
      this.loading = false;
      this.lastPayload = null;
      this.greeted = false;
      this.warmupPingSent = false;
      this.primaryColor = "#8A06E6";
      this.greetingMessage = "Hi there! How can I help today?";
      this.position = "bottom-right";
    }

    /**
     * Initialize the widget
     */
    init(config = {}) {
      const globalConfig = window.CipherRowConfig || {};

      // Load configuration
      this.loadConfig(config, globalConfig);

      // Validate required config
      if (!this.api.clientId && !this.api.apiUrl) {
        console.error("CRWidget: clientId or apiUrl required");
        return;
      }

      // Setup container and session
      this.setupContainer();
      this.sessionId = this.getOrCreateSession();
      this.loadCustomization(globalConfig);

      // Setup shadow DOM
      this.setupShadowDOM();

      // Initialize UI and attach listeners
      this.ui = new WidgetUI(this.shadow, {
        greetingMessage: this.greetingMessage,
        primaryColor: this.primaryColor,
        position: this.position,
      });

      this.ui.renderShell();
      this.applyCustomization();
      this.ui.setupResize(); // Enable resize functionality
      this.attachListeners();

      console.log("Widget initialized successfully");
    }

    /**
     * Load configuration from passed config and global config
     */
    loadConfig(config, globalConfig) {
      this.api = new WidgetAPI({
        apiUrl: config.apiUrl,
        apiKey: config.apiKey || globalConfig.apiKey || null,
        clientId: config.clientId || globalConfig.clientId || null,
        botId: config.botId || globalConfig.botId || null,
      });

      if (globalConfig.primaryColor) {
        this.primaryColor = globalConfig.primaryColor;
      }
      if (globalConfig.greeting && globalConfig.greeting.trim()) {
        this.greetingMessage = globalConfig.greeting;
      }
      if (globalConfig.position) {
        this.position = globalConfig.position;
      }

      console.log("Widget initialized with:", {
        clientId: this.api.clientId,
        botId: this.api.botId,
        hasApiKey: !!this.api.apiKey,
        greetingMessage: this.greetingMessage,
        primaryColor: this.primaryColor,
        position: this.position,
      });
    }

    /**
     * Setup container element
     */
    setupContainer() {
      this.container = document.getElementById("cr-widget");
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.id = "cr-widget";
        document.body.appendChild(this.container);
      }
    }

    /**
     * Setup shadow DOM with styles
     */
    setupShadowDOM() {
      this.shadow = this.container.attachShadow({ mode: "open" });

      const style = document.createElement("style");
      style.textContent = WIDGET_STYLES;
      this.shadow.appendChild(style);

      this.customStyle = document.createElement("style");
      this.shadow.appendChild(this.customStyle);
    }

    /**
     * Get or create session ID
     */
    getOrCreateSession() {
      try {
        const key = "cr_widget_session_id";
        let sid = localStorage.getItem(key);
        if (!sid) {
          sid =
            (crypto && crypto.randomUUID && crypto.randomUUID()) ||
            this.uuidv4();
          localStorage.setItem(key, sid);
        }
        return sid;
      } catch (e) {
        return this.uuidv4();
      }
    }

    /**
     * Generate UUID v4
     */
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }

    /**
     * Load customization from localStorage (fallback)
     */
    loadCustomization(globalConfig) {
      try {
        if (!globalConfig.primaryColor) {
          const savedColor = localStorage.getItem("widget_primary_color");
          if (savedColor) this.primaryColor = savedColor;
        }

        if (!globalConfig.greeting) {
          const savedGreeting = localStorage.getItem("widget_greeting");
          if (savedGreeting && savedGreeting.trim()) {
            this.greetingMessage = savedGreeting;
          }
        }

        if (!globalConfig.position) {
          const savedPosition = localStorage.getItem("widget_position");
          if (savedPosition) this.position = savedPosition;
        }
      } catch (e) {
        console.warn("Failed to load widget customization:", e);
      }
    }

    /**
     * Apply customization to UI
     */
    applyCustomization() {
      if (this.ui && this.customStyle) {
        this.ui.applyCustomization(this.customStyle);
      }
    }

    /**
     * Attach event listeners
     */
    attachListeners() {
      // Toggle chat window
      this.ui.elements.bubble.addEventListener("click", () =>
        this.toggleChat()
      );

      // Input change
      this.ui.elements.input.addEventListener("input", () => {
        const hasText = this.ui.getInputValue().length > 0;
        this.ui.setSendButtonState(hasText && !this.loading);
      });

      // Send button click
      this.ui.elements.sendBtn.addEventListener("click", () => this.onSend());

      // Enter key press
      this.ui.elements.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.onSend();
        }
      });

      // Escape key to close
      this.shadow.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.toggleChat();
        }
      });
    }

    /**
     * Toggle chat window open/close
     */
    toggleChat() {
      this.isOpen = !this.isOpen;
      this.ui.toggleWindow(this.isOpen);

      if (this.isOpen) {
        setTimeout(() => this.ui.focusInput(), 120);

        // Send warmup ping and show greeting on first open
        if (!this.warmupPingSent) {
          console.log("Sending warmup ping...");
          this.api.sendWarmupPing(this.sessionId);
          this.warmupPingSent = true;
        }

        if (!this.greeted) {
          console.log("Showing greeting message:", this.greetingMessage);
          this.ui.showGreeting();
          this.greeted = true;
        }
      }
    }

    /**
     * Handle send message
     */
    onSend() {
      if (this.loading) return;

      const text = this.ui.getInputValue();
      if (!text) return;

      this.ui.renderUserRow(text);
      this.ui.scrollToBottom(true);
      this.ui.clearInput();
      this.ui.setSendButtonState(false);
      this.ui.focusInput();

      const payload = this.api.createPayload(text, this.sessionId);
      this.lastPayload = { payload };

      this.callApiAndRender(payload);
    }

    /**
     * Call API and render response
     */
    async callApiAndRender(payload) {
      this.ui.showTyping(true);
      this.loading = true;
      this.ui.setSendButtonState(false);

      try {
        const botText = await this.api.sendMessage(payload);
        await this.ui.showBotMessage(botText, {
          animated: true,
          persist: true,
        });
      } catch (err) {
        console.error("Widget network error:", err);
        const errorMessage =
          err.message || "Oops — something went wrong. Please retry.";
        const errorRow = await this.ui.showBotMessage(errorMessage, {
          animated: false,
          persist: true,
          error: true,
        });

        // Attach retry handler
        const retryBtn = errorRow.querySelector(".btn-retry");
        if (retryBtn) {
          retryBtn.addEventListener("click", () => {
            if (this.lastPayload && this.lastPayload.payload) {
              this.callApiAndRender(this.lastPayload.payload);
              errorRow.remove();
            }
          });
        }
      } finally {
        this.ui.showTyping(false);
        this.loading = false;
        const hasText = this.ui.getInputValue().length > 0;
        this.ui.setSendButtonState(hasText && !this.loading);
      }
    }
  }

  // Auto-initialize widget
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      window.CRWidget = new CRWidget();
      window.CRWidget.init(window.CipherRowConfig || {});
    });
  } else {
    window.CRWidget = new CRWidget();
    window.CRWidget.init(window.CipherRowConfig || {});
  }
})();
