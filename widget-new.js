/**
 * CipherRow Chat Widget - Main Entry Point
 * Orchestrates UI, API, and state management
 */

import { STYLES } from "./src/widget-styles.js";
import { WidgetUI } from "./src/widget-ui.js";
import { WidgetAPI } from "./src/widget-api.js";

(function () {
  class CRWidget {
    constructor() {
      this.apiKey = null;
      this.clientId = null;
      this.botId = null;
      this.sessionId = null;
      this.container = null;
      this.shadow = null;
      this.customStyle = null;
      this.ui = null;
      this.api = null;
      this.isOpen = false;
      this.loading = false;
      this.lastPayload = null;
      this.greeted = false;
      this.warmupPingSent = false;
      this.initialized = false;
      this.primaryColor = "#8A06E6";
      this.greetingMessage = "Hi there! How can I help today?";
      this.position = "bottom-right";
    }

    init(opts = {}) {
      // Prevent double initialization
      if (window.__CR_WIDGET_BOOTED__) {
        console.warn(
          "CRWidget: Widget already initialized. Skipping duplicate initialization."
        );
        return;
      }

      if (this.initialized) {
        console.warn("CRWidget: This instance is already initialized.");
        return;
      }

      // Read config from window.CipherRowConfig
      const globalConfig = window.CipherRowConfig;

      if (!globalConfig) {
        console.error(
          "CipherRowConfig not found. Please define window.CipherRowConfig before initializing."
        );
        return;
      }

      this.apiKey = globalConfig.apiKey || null;
      this.clientId = globalConfig.clientId || null;
      this.botId = globalConfig.botId || null;

      // Process customization
      if (globalConfig.primaryColor) {
        this.primaryColor = globalConfig.primaryColor;
      }
      if (globalConfig.greeting && globalConfig.greeting.trim()) {
        this.greetingMessage = globalConfig.greeting;
      }
      if (globalConfig.position) {
        this.position = globalConfig.position;
      }

      console.log("Widget initialized with config:", {
        clientId: this.clientId,
        botId: this.botId,
        primaryColor: this.primaryColor,
        position: this.position,
      });

      if (!this.clientId && !this.apiKey) {
        console.error("CRWidget: Configuration missing clientId or apiKey");
        return;
      }

      // Setup container
      this.container = document.getElementById("cipher-row-widget");
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.id = "cipher-row-widget";
        document.body.appendChild(this.container);
      } else {
        if (this.container.shadowRoot) {
          console.warn(
            "CRWidget: Root element already has a shadow DOM. Skipping initialization."
          );
          return;
        }
      }

      this.sessionId = this._getOrCreateSession();

      // Setup shadow DOM
      this.shadow = this.container.attachShadow({ mode: "open" });

      const style = document.createElement("style");
      style.textContent = STYLES;
      this.shadow.appendChild(style);

      this.customStyle = document.createElement("style");
      this.shadow.appendChild(this.customStyle);

      // Initialize API and UI modules
      this.api = new WidgetAPI({
        apiKey: this.apiKey,
        clientId: this.clientId,
        botId: this.botId,
      });

      this.ui = new WidgetUI(this.shadow, {
        greetingMessage: this.greetingMessage,
        primaryColor: this.primaryColor,
        position: this.position,
      });

      this.ui.renderShell();
      this.ui.applyCustomization(this.customStyle);
      this._attachListeners();

      // Set initial visibility state (hidden/closed)
      this._setVisibilityState(false);

      // Mark as initialized
      this.initialized = true;
      window.__CR_WIDGET_BOOTED__ = true;

      console.log("CRWidget: Successfully initialized and booted.");
    }

    _getOrCreateSession() {
      try {
        const key = "cr_widget_session_id";
        let sid = localStorage.getItem(key);
        if (!sid) {
          sid =
            (crypto && crypto.randomUUID && crypto.randomUUID()) ||
            this._uuidv4();
          localStorage.setItem(key, sid);
        }
        return sid;
      } catch (e) {
        return this._uuidv4();
      }
    }

    _uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    }

    _setVisibilityState(isOpen) {
      if (!this.container) return;

      if (isOpen) {
        // On open: add cipher-row-open, remove cipher-row-hidden
        this.container.classList.add("cipher-row-open");
        this.container.classList.remove("cipher-row-hidden");
        this.container.setAttribute("data-cr-state", "open");
      } else {
        // On minimize/close: add cipher-row-hidden, remove cipher-row-open
        this.container.classList.add("cipher-row-hidden");
        this.container.classList.remove("cipher-row-open");
        this.container.setAttribute("data-cr-state", "hidden");
      }
    }

    _attachListeners() {
      const toggle = () => {
        this.isOpen = !this.isOpen;
        this.ui.toggleWindow(this.isOpen);

        // Set visibility state (classes and data attribute)
        this._setVisibilityState(this.isOpen);

        if (this.isOpen) {
          setTimeout(() => this.ui.focusInput(), 120);

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
      };

      this.ui.elements.bubble.addEventListener("click", toggle);

      this.ui.elements.input.addEventListener("input", () => {
        const hasText = this.ui.getInputValue().length > 0;
        this.ui.setSendButtonState(hasText && !this.loading);
      });

      this.ui.elements.sendBtn.addEventListener("click", () => this._onSend());
      this.ui.elements.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this._onSend();
        }
      });

      this.shadow.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.isOpen = false;
          this.ui.toggleWindow(false);
          // Set visibility state when closing with Escape
          this._setVisibilityState(false);
        }
      });
    }

    _onSend() {
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

      this._callApiAndRender(payload);
    }

    async _callApiAndRender(payload) {
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

        const retryBtn = errorRow.querySelector(".btn-retry");
        if (retryBtn) {
          retryBtn.addEventListener("click", () => {
            if (this.lastPayload && this.lastPayload.payload) {
              this._callApiAndRender(this.lastPayload.payload);
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

  window.CRWidget = new CRWidget();
})();
