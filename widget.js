(function () {
  /* -------------------------
     STYLES (single template literal)
     ------------------------- */
  const STYLES = `
    .messages::-webkit-scrollbar { width: 6px; }
    .messages::-webkit-scrollbar-track { background: transparent; }
    .messages::-webkit-scrollbar-thumb {
      background: rgba(156,163,175,0.45);
      border-radius: 20px;
    }
    .messages::-webkit-scrollbar-thumb:hover { background: rgba(156,163,175,0.7); }

    :host { all: initial; }
    :host, * { box-sizing: border-box; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    :host {
      --primary: var(--widget-primary, #8A06E6);
      --primary-600: var(--widget-primary-600, #7505C7);
      --bg-window: #ffffff;
      --bg-header: var(--widget-bg-header, linear-gradient(90deg,#8A06E6,#7A05D0));
      --bg-messages: #F5F7FA;
      --bg-input: #FBFBFD;
      --text-main: #111827;
      --text-muted: #6B7280;
      --border: #E5E7EB;
      --bubble-bot: #ffffff;
      --bubble-user: var(--widget-bubble-user, #8A06E6);
      --bubble-user-text: #ffffff;
      --shadow: 0 10px 25px rgba(2,6,23,0.08);
    }

    .wrapper {
      z-index: 9999;
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
      width: 360px;
      max-width: calc(100vw - 40px);
      font-size: 14px;
    }

    .bubble {
      width: 60px;
      height: 60px;
      background: var(--primary);
      border-radius: 50%;
      box-shadow: var(--shadow);
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: transform .12s ease, background .12s;
    }
    .bubble:hover { transform: scale(1.05); background: var(--primary-600); }
    .bubble svg { pointer-events: none; }

    .chat-window {
      width: 100%;
      height: 520px;
      max-height: 520px;
      background: var(--bg-window);
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transform-origin: bottom right;
      opacity: 0;
      transform: translateY(10px) scale(.98);
      pointer-events: none;
      transition: opacity .22s ease, transform .22s ease;
    }
    .chat-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

    .header {
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      padding:12px 14px;
      background: var(--bg-header);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      color: #fff;
    }
    .header-left { display:flex; align-items:center; gap:12px; }
    .title { font-size: 15px; font-weight: 600; color: white; display:flex; align-items:center; gap:8px; }

    .header-icon {
      width:36px;
      height:36px;
      border-radius: 36px;
      background: rgba(255,255,255,0.18);
      display:grid;
      place-items:center;
      flex-shrink:0;
    }
    .header-icon-inner {
      width:18px;
      height:18px;
      background:white;
      transform: rotate(45deg);
      border-radius:3px;
    }

    .status-dot {
      width:10px;
      height:10px;
      border-radius:999px;
      background:#10B981;
      box-shadow: 0 0 0 6px rgba(16,185,129,0.06);
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
        box-shadow: 0 0 0 8px rgba(16,185,129,0.15);
      }
    }

    .messages {
      flex: 1;
      padding: 12px;
      display:flex;
      flex-direction: column;
      gap: 12px;
      overflow-y: auto;
      background: var(--bg-messages);
    }

    .row { display:flex; gap:10px; align-items:flex-end; }
    .row.bot { justify-content:flex-start; }
    .row.user { justify-content:flex-end; }

    .avatar {
      width:34px; height:34px; border-radius:50%; flex:0 0 34px;
      display:grid; place-items:center; font-weight:700; color:white;
      user-select:none; font-size:12px;
    }
    .avatar.bot { background: var(--primary); color: white; }
    .avatar.user { background: var(--primary); color: white; }

  .bubble-content {
  max-width: 92%;
  padding:12px 14px;
  border-radius:12px;
  line-height:1.45;
  white-space:pre-wrap;
  word-break:break-word;
  box-shadow: 0 2px 6px rgba(2,6,23,0.04);
  font-size: 14px;
  color: var(--text-main);
  background: var(--bubble-bot);
  border: 1px solid var(--border);
}
    .bubble-content.bot { border-top-left-radius: 4px; }
    
.bubble-content.user {
  max-width: 92%;
  background: var(--bubble-user);
  color: var(--bubble-user-text);
  border: none;
  border-top-right-radius: 4px;
  box-shadow: 0 2px 6px rgba(138,6,230,0.18);
}

    .chip {
      background: var(--primary);
      color: white;
      padding:8px 12px;
      border-radius: 16px;
      font-size: 13px;
      box-shadow: 0 6px 14px rgba(138,6,230,0.12);
    }

    .typing { display:inline-flex; gap:6px; align-items:center; }
    .dot { width:7px; height:7px; background:#9CA3AF; border-radius:50%; opacity:0.9; transform:translateY(0); animation: typing 1s infinite; }
    .dot:nth-child(1){ animation-delay:0s; } .dot:nth-child(2){ animation-delay:.12s; } .dot:nth-child(3){ animation-delay:.24s; }
    @keyframes typing { 0%{ transform:translateY(0); opacity:.3;} 50%{ transform:translateY(-6px); opacity:1;} 100%{ transform:translateY(0); opacity:.3;} }

    .input-area { display:flex; gap:8px; padding:8px 10px; background: transparent; align-items:center; position:relative; }
    .input-pill { 
      width:100%; 
      background: #f3f4f6; 
      border-radius: 999px; 
      padding: 6px 16px; 
      display:flex; 
      align-items:center; 
      gap:12px; 
      box-shadow: 0 4px 14px rgba(2,6,23,0.04);
      border: 2px solid transparent;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .input-pill:focus-within {
      border-color: var(--primary);
      box-shadow: 0 4px 14px rgba(138,6,230,0.15);
    }
    .input-pill input { border:0; outline:none; background: transparent; flex:1; font-size:15px; color: #374151; padding:0; min-height:20px; }
    .send-btn {
      width:36px; height:36px; border-radius:12px; border:none; cursor:pointer;
      background: var(--primary); color:white; display:grid; place-items:center;
      box-shadow: 0 6px 18px rgba(138,6,230,0.18); transition: transform .12s ease, opacity .12s;
      flex-shrink:0;
    }
    .send-btn[disabled] { opacity: 0.38; cursor: not-allowed; transform:none; }

    .footer { text-align: center; font-size: 12px; color: var(--text-muted); padding: 10px 0 14px 0; }
    .footer a { color: var(--primary); text-decoration:none; font-weight:500; }
    .footer a:hover { text-decoration:underline; }

    .toast { position: absolute; right: 8px; bottom: 8px; background: rgba(0,0,0,0.8); color: #fff; padding:8px 10px; border-radius:8px; font-size:12px; box-shadow: 0 6px 18px rgba(0,0,0,.12); opacity:0; transform:translateY(8px); transition:opacity .18s, transform .18s; }
    .toast.show { opacity:1; transform:translateY(0); }

    @media (max-width:420px) {
      .wrapper { width: calc(100vw - 28px); right:14px; bottom:14px; }
      .chat-window { max-height: 70vh; }
    }
  `;

  /* -------------------------
     ICONS
     ------------------------- */
  const ICONS = {
    chat: '<svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>',
    close:
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  };

  /* -------------------------
     WIDGET CLASS
     ------------------------- */
  class CRWidget {
    constructor() {
      this.apiUrl = null;
      this.apiKey = null;
      this.clientId = null;
      this.botId = null;
      this.sessionId = null;
      this.container = null;
      this.shadow = null;
      this.elements = {};
      this.isOpen = false;
      this.loading = false;
      this.lastPayload = null;
      this.greeted = false;
      this.warmupPingSent = false;
      this.primaryColor = "#8A06E6"; // Default color
      this.greetingMessage = "Hi there! How can I help today?"; // Default greeting
      this.position = "bottom-right"; // Default position
    }

    init(config = {}) {
      // Check for global config first, then use passed config
      const globalConfig = window.CipherRowConfig || {};

      this.apiUrl = config.apiUrl;
      this.apiKey = config.apiKey || globalConfig.apiKey || null;
      this.clientId = config.clientId || globalConfig.clientId || null;
      this.botId = config.botId || globalConfig.botId || null;

      // Load customization from global config if available
      if (globalConfig.primaryColor) {
        this.primaryColor = globalConfig.primaryColor;
      }
      // Use globalConfig.greeting if provided, otherwise keep the default
      if (globalConfig.greeting && globalConfig.greeting.trim()) {
        this.greetingMessage = globalConfig.greeting;
      }
      if (globalConfig.position) {
        this.position = globalConfig.position;
      }

      console.log("Widget initialized with:", {
        clientId: this.clientId,
        botId: this.botId,
        hasApiKey: !!this.apiKey,
        greetingMessage: this.greetingMessage,
        primaryColor: this.primaryColor,
        position: this.position,
        source: globalConfig.apiKey ? "global config" : "passed config",
      });

      if (!this.clientId && !this.apiUrl) {
        console.error("CRWidget: clientId or apiUrl required");
        return;
      }

      // Create container if it doesn't exist
      this.container = document.getElementById("cr-widget");
      if (!this.container) {
        this.container = document.createElement("div");
        this.container.id = "cr-widget";
        document.body.appendChild(this.container);
      }

      this.sessionId = this._getOrCreateSession();

      // Load widget customization from localStorage (fallback)
      // This will only override if values weren't set by globalConfig
      this._loadCustomization();

      this.shadow = this.container.attachShadow({ mode: "open" });

      // Create base styles
      const style = document.createElement("style");
      style.textContent = STYLES;
      this.shadow.appendChild(style);

      // Create custom properties style
      this.customStyle = document.createElement("style");
      this.shadow.appendChild(this.customStyle);

      this._renderShell();
      this._applyCustomization();
      this._attachListeners();
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

    _loadCustomization() {
      try {
        // Only load from localStorage if not already set by global config
        const globalConfig = window.CipherRowConfig || {};

        // Load primary color (only if not set by global config)
        if (!globalConfig.primaryColor) {
          const savedColor = localStorage.getItem("widget_primary_color");
          console.log("Loaded color from localStorage:", savedColor);
          if (savedColor) {
            this.primaryColor = savedColor;
          }
        }

        // Load greeting message (only if not set by global config)
        if (!globalConfig.greeting) {
          const savedGreeting = localStorage.getItem("widget_greeting");
          console.log("Loaded greeting from localStorage:", savedGreeting);
          if (savedGreeting && savedGreeting.trim()) {
            this.greetingMessage = savedGreeting;
          }
        }

        // Load position (only if not set by global config)
        if (!globalConfig.position) {
          const savedPosition = localStorage.getItem("widget_position");
          console.log("Loaded position from localStorage:", savedPosition);
          if (savedPosition) {
            this.position = savedPosition;
          }
        }

        console.log("Final widget config:", {
          primaryColor: this.primaryColor,
          greetingMessage: this.greetingMessage,
          position: this.position,
          source: globalConfig.primaryColor ? "global config" : "localStorage",
        });
      } catch (e) {
        console.warn("Failed to load widget customization:", e);
      }
    }

    _applyCustomization() {
      if (!this.shadow || !this.customStyle) return;

      const wrapper = this.shadow.querySelector(".wrapper");
      if (!wrapper) return;

      // Calculate darker shade for hover (reduce brightness by ~10%)
      const darkerColor = this._adjustColorBrightness(this.primaryColor, -10);

      console.log(
        "Applying customization - Primary:",
        this.primaryColor,
        "Darker:",
        darkerColor
      );

      // Inject CSS custom properties into shadow DOM
      this.customStyle.textContent = `
        :host {
          --primary: ${this.primaryColor} !important;
          --primary-600: ${darkerColor} !important;
          --bubble-user: ${this.primaryColor} !important;
          --bg-header: linear-gradient(90deg, ${this.primaryColor}, ${darkerColor}) !important;
        }
      `;

      // Apply position
      if (this.position === "bottom-left") {
        wrapper.style.right = "auto";
        wrapper.style.left = "20px";
      }

      console.log("Customization applied successfully");
    }

    _adjustColorBrightness(hex, percent) {
      // Remove # if present
      hex = hex.replace("#", "");

      // Convert to RGB
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Adjust brightness
      const newR = Math.max(0, Math.min(255, r + (r * percent) / 100));
      const newG = Math.max(0, Math.min(255, g + (g * percent) / 100));
      const newB = Math.max(0, Math.min(255, b + (b * percent) / 100));

      // Convert back to hex
      const toHex = (n) => {
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };

      return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
    }

    _renderShell() {
      const wrapper = document.createElement("div");
      wrapper.className = "wrapper";

      // Build inner HTML via concatenation to avoid accidental template literal interpolation
      let inner = "";
      inner +=
        '<div class="chat-window" role="region" aria-label="Chat window" tabindex="0">';
      inner += '  <div class="header">';
      inner += '    <div class="header-left">';
      inner +=
        '      <div class="header-icon"><img src="https://cdn.cipherandrow.com/images/Text.png" alt="Icon" style="width:24px; height:24px; object-fit:contain;" /></div>';
      inner += '      <div class="title">Support Assistant</div>';
      inner += "    </div>";
      inner += '    <div style="display:flex; gap:10px; align-items:center;">';
      inner += '      <div class="status-dot" title="Active"></div>';
      inner += "    </div>";
      inner += "  </div>";
      inner += '  <div class="messages" role="log" aria-live="polite"></div>';

      inner += '  <div class="input-area">';
      inner += '    <div class="input-pill">';
      inner +=
        '      <input type="text" placeholder="Type your message..." aria-label="Type your message" />';
      inner +=
        '      <button class="send-btn" aria-label="Send message" disabled>' +
        ICONS.send +
        "</button>";
      inner += "    </div>";
      inner += "  </div>";

      inner +=
        '  <div class="footer">Powered by <a href="https://cipherandrow.com/" target="_blank">Cipher & Row</a></div>';
      inner += "</div>";

      inner += '<div class="bubble" title="Open chat">' + ICONS.chat + "</div>";
      inner += '<div class="toast" aria-hidden="true"></div>';

      wrapper.innerHTML = inner;
      this.shadow.appendChild(wrapper);

      this.elements = {
        wrapper,
        window: this.shadow.querySelector(".chat-window"),
        bubble: this.shadow.querySelector(".bubble"),
        messages: this.shadow.querySelector(".messages"),
        input: this.shadow.querySelector(".input-pill input"),
        sendBtn: this.shadow.querySelector(".input-pill .send-btn"),
        toast: this.shadow.querySelector(".toast"),
      };
    }

    _attachListeners() {
      const toggle = () => {
        this.isOpen = !this.isOpen;
        this.elements.window.classList.toggle("open", this.isOpen);

        // Toggle icon
        this.elements.bubble.innerHTML = this.isOpen ? ICONS.close : ICONS.chat;
        this.elements.bubble.title = this.isOpen ? "Close chat" : "Open chat";

        if (this.isOpen) {
          setTimeout(() => this.elements.input.focus(), 120);

          // Send warmup ping and show greeting on first open
          if (!this.warmupPingSent) {
            console.log("Sending warmup ping...");
            this._sendWarmupPing();
            this.warmupPingSent = true;
          }

          if (!this.greeted) {
            console.log("Showing greeting message:", this.greetingMessage);
            this._renderBotRow(this.greetingMessage);
            this.greeted = true;
          }
        }
      };

      this.elements.bubble.addEventListener("click", toggle);

      this.elements.input.addEventListener("input", () => {
        const hasText = this.elements.input.value.trim().length > 0;
        this.elements.sendBtn.disabled = !hasText || this.loading;
      });

      this.elements.sendBtn.addEventListener("click", () => this._onSend());
      this.elements.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this._onSend();
        }
      });

      this.elements.messages.addEventListener("scroll", () => {
        const el = this.elements.messages;
        const atBottom = el.scrollTop + el.clientHeight + 60 >= el.scrollHeight;
      });

      this.shadow.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.elements.window.classList.remove("open");
          this.isOpen = false;
          this.elements.bubble.innerHTML = ICONS.chat;
          this.elements.bubble.title = "Open chat";
        }
      });
    }

    _onSend() {
      if (this.loading) return;
      const text = this.elements.input.value.trim();
      if (!text) return;

      this._renderUserRow(text);
      this._scrollToBottom(true);
      this.elements.input.value = "";
      this.elements.sendBtn.disabled = true;
      this.elements.input.focus();

      const payload = {
        client_id: this.clientId,
        bot_id: this.botId,
        session_id: this.sessionId,
        user_message: text,
        page_url: window.location.href,
      };
      this.lastPayload = { payload };

      this._callApiAndRender(payload);
    }

    async _callApiAndRender(payload) {
      this._showTyping(true);
      this.loading = true;
      this.elements.sendBtn.disabled = true;

      try {
        // Use API key from global config, or fallback to localStorage
        let apiKey = this.apiKey;
        if (!apiKey) {
          apiKey = localStorage.getItem("generated_api_key");
        }

        // Check if user has an API key configured
        if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
          const errorText =
            "API key not found. Please generate an API key in your dashboard.";
          throw new Error(errorText);
        }

        console.log(
          "Using API key from:",
          this.apiKey ? "global config" : "localStorage"
        );

        // Call Ceron Engine API directly
        const res = await fetch(
          "https://cr-engine.jnowlan21.workers.dev/api/support-bot/query",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              "x-api-key": apiKey,
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
        const botText =
          data.bot_answer ||
          data.reply ||
          (data.messages && data.messages[0]?.text) ||
          "Sorry, I didn't get that.";

        await this._showBotMessage(botText, { animated: true, persist: true });
      } catch (err) {
        console.error("Widget network error:", err);
        const errorMessage =
          err.message || "Oops — something went wrong. Please retry.";
        this._showBotMessage(errorMessage, {
          animated: false,
          persist: true,
          error: true,
        });
      } finally {
        this._showTyping(false);
        this.loading = false;
        const hasText = this.elements.input.value.trim().length > 0;
        this.elements.sendBtn.disabled = !hasText || this.loading;
      }
    }

    _showTyping(show) {
      if (show) {
        if (!this.shadow.querySelector(".typing-row")) {
          const row = document.createElement("div");
          row.className = "row bot typing-row";
          row.innerHTML =
            '<div class="avatar bot">AI</div>' +
            '<div class="bubble-content bot"><span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span></div>';
          this.elements.messages.appendChild(row);
          this._maybeAutoScroll();
        }
      } else {
        const t = this.shadow.querySelector(".typing-row");
        if (t) t.remove();
      }
    }

    async _showBotMessage(
      text,
      opts = { animated: true, persist: true, error: false }
    ) {
      const row = document.createElement("div");
      row.className = "row bot";

      const avatarHtml = '<div class="avatar bot">AI</div>';
      const content = document.createElement("div");
      content.className = "bubble-content bot";
      content.innerHTML = '<span class="bot-text"></span>';

      row.innerHTML = avatarHtml;
      row.appendChild(content);

      if (opts.error) {
        const errDiv = document.createElement("div");
        errDiv.className = "message-error";
        errDiv.innerHTML =
          '<span style="color:#b91c1c">Failed to get reply</span> <button class="btn-retry">Retry</button>';
        row.appendChild(errDiv);
        const btn = errDiv.querySelector(".btn-retry");
        if (btn) {
          btn.addEventListener("click", () => {
            if (this.lastPayload && this.lastPayload.payload) {
              this._callApiAndRender(this.lastPayload.payload);
              row.remove();
            }
          });
        }
      }

      this.elements.messages.appendChild(row);
      this._maybeAutoScroll();

      if (opts.animated) {
        this._showTyping(false);
        const span = content.querySelector(".bot-text");
        const speed = text && text.length > 200 ? 8 : 10;
        await this._typeWrite(span, text, speed);
      } else {
        this._showTyping(false);
        const span = content.querySelector(".bot-text");
        if (span) span.textContent = text;
      }

      // Messages are no longer persisted to localStorage
    }

    // Messages are no longer loaded from localStorage

    _renderUserRow(text) {
      const row = document.createElement("div");
      row.className = "row user";
      row.innerHTML =
        '<div class="bubble-content user">' +
        this._escape(text) +
        "</div>" +
        '<div class="avatar user">You</div>';
      this.elements.messages.appendChild(row);
      this._maybeAutoScroll();
    }

    _renderBotRow(text) {
      const row = document.createElement("div");
      row.className = "row bot";
      row.innerHTML =
        '<div class="avatar bot">AI</div>' +
        '<div class="bubble-content bot">' +
        this._escape(text) +
        "</div>";
      this.elements.messages.appendChild(row);
      this._maybeAutoScroll();
    }

    _escape(s) {
      if (!s) return "";
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    _maybeAutoScroll() {
      const el = this.elements.messages;
      const atBottom = el.scrollTop + el.clientHeight + 60 >= el.scrollHeight;
      if (atBottom) this._scrollToBottom();
    }

    _scrollToBottom(immediate = false) {
      const el = this.elements.messages;
      if (immediate) el.scrollTop = el.scrollHeight;
      else el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }

    _showToast(msg, ms = 3000) {
      const t = this.elements.toast;
      t.textContent = msg;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), ms);
    }

    _sendWarmupPing() {
      // Fire warmup ping in background to reduce first-message latency
      if (!this.clientId || !this.botId) {
        console.warn("Cannot send warmup ping: missing clientId or botId");
        return;
      }

      // Get API key from global config or localStorage
      let apiKey = this.apiKey;
      if (!apiKey) {
        apiKey = localStorage.getItem("generated_api_key");
      }

      if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        console.warn("Cannot send warmup ping: missing API key");
        return;
      }

      console.log("Sending warmup request to warm up the backend...");

      // Send a lightweight warmup request to the main endpoint
      fetch("https://cr-engine.jnowlan21.workers.dev/api/support-bot/query", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          client_id: this.clientId,
          bot_id: this.botId,
          session_id: this.sessionId,
          user_message: "ping", // Warmup message - response will be discarded
          page_url: window.location.href,
        }),
      })
        .then(async (response) => {
          if (response.ok) {
            // Consume the response body but don't display it
            const data = await response.json();
            console.log("Warmup complete - backend is ready:", response.status);
            // Response is discarded - not shown to user
          } else {
            console.warn("Warmup request returned error:", response.status);
          }
        })
        .catch((err) => {
          // Silently fail - not critical
          console.warn("Warmup request failed:", err);
        });
    }

    _typeWrite(el, text, speed = 10) {
      return new Promise((resolve) => {
        if (!el) return resolve();
        el.textContent = "";
        let i = 0;
        const step = () => {
          if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            this._maybeAutoScroll();
            setTimeout(step, speed + Math.random() * 6);
          } else resolve();
        };
        setTimeout(step, 220 + Math.random() * 200);
      });
    }
  }

  window.CRWidget = new CRWidget();
})();
