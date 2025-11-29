(function () {
  /***** Styles *****/
  const STYLES = `
  /* --- Modern minimal scrollbar inside widget --- */
   .messages::-webkit-scrollbar {
       width: 6px;
   }

   .messages::-webkit-scrollbar-track {
       background: transparent;
   }

   .messages::-webkit-scrollbar-thumb {
       background: rgba(156, 163, 175, 0.45);
       border-radius: 20px;
   }

   :host(.dark) .messages::-webkit-scrollbar-thumb {
       background: rgba(255, 255, 255, 0.32);
   }

   .messages::-webkit-scrollbar-thumb:hover {
       background: rgba(156, 163, 175, 0.7);
   }

   :host(.dark) .messages::-webkit-scrollbar-thumb:hover {
       background: rgba(255, 255, 255, 0.45);
    }
    :host { all: initial; }
    :host, * { box-sizing: border-box; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
    :host {
      --primary: #4F46E5;
      --primary-600: #4338CA;
      --bg-window: #ffffff;
      --bg-header: linear-gradient(90deg, #4F46E5, #4338CA);
      --bg-messages: #F5F7FA;
      --bg-input: #FBFBFD;
      --text-main: #111827;
      --text-muted: #6B7280;
      --border: #E5E7EB;
      --bubble-bot: #E8EBF1;
      --bubble-user: #4F46E5;
      --bubble-user-text: #ffffff;
      --bubble-bot-text: #111827;
      --shadow: 0 10px 25px rgba(2,6,23,0.08);
    }
    :host(.dark) {
      --bg-window: #1F2937;
      --bg-header: linear-gradient(90deg, #3730A3, #312E81);
      --bg-messages: #111827;
      --bg-input: #1F2937;
      --text-main: #F9FAFB;
      --text-muted: #9CA3AF;
      --border: #374151;
      --bubble-bot: #374151;
      --bubble-user: #4F46E5;
      --bubble-user-text: #ffffff;
      --bubble-bot-text: #F9FAFB;
      --shadow: 0 10px 25px rgba(0,0,0,0.3);
    }
    :host, * { box-sizing: border-box; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
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

    /* bubble button */
    .bubble {
      width: 60px;
      height: 60px;
      background: #4F46E5;
      border-radius: 50%;
      box-shadow: var(--shadow);
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: transform .12s ease;
    }
    .bubble:hover { transform: scale(1.05); background: #4338CA; }

    .chat-window {
      width: 100%;
      height: 520px;
      max-height: 520px;
      background: var(--bg-window);
      border: 1px solid var(--border);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      border-radius: 14px;
      box-shadow: var(--shadow);
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
      padding:12px 14px;
      background: var(--bg-header);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      color: #fff;
      font-weight:600;
    }
    .header .title {
      font-size: 15px;
      font-weight: 600;
      color: white;
    }
    .close-btn, .theme-btn {
      background: transparent; border:none; color: white;
      cursor:pointer; opacity: 0.9; transition: opacity 0.2s;
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; padding: 0; border-radius: 4px;
    }
    .close-btn { font-size: 24px; line-height: 1; }
    .theme-btn svg { display: block; margin-top: 5px; }
    .close-btn:hover, .theme-btn:hover { opacity: 1; background: rgba(255,255,255,0.1); }

    .messages {
      flex: 1;
      padding: 12px;
      display:flex;
      flex-direction: column;
      gap: 10px;
      overflow-y: auto;
      background: var(--bg-messages);
    }

    /* message rows */
    .row { display:flex; gap:10px; align-items:flex-end; }
    .row.bot { justify-content:flex-start; }
    .row.user { justify-content:flex-end; }

    .avatar {
      width:34px; height:34px; border-radius:50%; flex:0 0 34px;
      display:grid; place-items:center; font-weight:700; color:white;
      background: #E5E7EB; user-select:none;
    }
    .avatar.bot { background: var(--bubble-bot); color: var(--bubble-bot-text); border: 1px solid var(--border); }
    .avatar.user { background: var(--bubble-user); color: var(--bubble-user-text); border: 1px solid var(--primary-600); }

    .bubble-content {
      max-width: 78%;
      padding:10px 12px;
      border-radius:12px;
      line-height:1.45;
      white-space:pre-wrap;
      word-break:break-word;
      box-shadow: 0 2px 6px rgba(2,6,23,0.04);
    }
    .bubble-content.bot {
      background: var(--bubble-bot);
      border: 1px solid var(--border);
      color: var(--bubble-bot-text);
      border-top-left-radius:2px;
    }
    .bubble-content.user {
      background: var(--bubble-user);
      color: var(--bubble-user-text);
      border-top-right-radius:2px;
      box-shadow: 0 2px 6px rgba(79,70,229,0.25);
    }

    .meta { font-size:11px; color:var(--muted); margin-top:6px; }

    /* typing indicator */
    .typing {
      display:inline-flex;
      gap:4px;
      align-items:center;
    }
    .dot {
      width:7px; height:7px; background:#9CA3AF; border-radius:50%;
      opacity:0.9; transform:translateY(0);
      animation: typing 1s infinite;
    }
    .dot:nth-child(1){ animation-delay:0s; }
    .dot:nth-child(2){ animation-delay:.12s; }
    .dot:nth-child(3){ animation-delay:.24s; }
    @keyframes typing { 0%{ transform:translateY(0); opacity:.3;} 50%{ transform:translateY(-6px); opacity:1;} 100%{ transform:translateY(0); opacity:.3;} }

    /* input */
    .input-area { display:flex; gap:8px; padding:12px; border-top: 1px solid var(--border);
      background: var(--bg-input); align-items:center; }
    .input-area input {
      flex:1; padding:10px 12px; border-radius:999px; border:1px solid var(--border); outline:none; font-size:14px;
      background: var(--bg-window); color: var(--text-main);
    }
    .input-area input:focus {
      border-color:#4F46E5;
      box-shadow: 0 0 0 2px rgba(79,70,229,0.15);
    }
    .send-btn {
      width:44px; height:44px; border-radius:50%; border:none; cursor:pointer;
      background: #4F46E5; color:white; display:grid; place-items:center;
    }
    .send-btn:disabled { opacity:.3; cursor:not-allowed; transform:none; }

    /* small toast */
    .toast {
      position: absolute; right: 8px; bottom: 8px; background: rgba(0,0,0,0.8); color: #fff; padding:8px 10px; border-radius:8px;
      font-size:12px; box-shadow: 0 6px 18px rgba(0,0,0,.12);
      opacity:0; transform:translateY(8px); transition:opacity .18s, transform .18s;
    }
    .toast.show { opacity:1; transform:translateY(0); }

    /* retry button inside message */
    .message-error { color:#b91c1c; margin-top:8px; display:flex; gap:8px; align-items:center; }
    .btn-retry { background:transparent; border:1px solid #e5e7eb; padding:6px 8px; border-radius:8px; cursor:pointer; font-size:13px; }

    /* responsive small */
    @media (max-width:420px) {
      .wrapper { width: calc(100vw - 28px); right:14px; bottom:14px; }
      .chat-window { max-height: 70vh; }
    }
  `;

  /***** Icons *****/
  const ICONS = {
    chat: `<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
    send: `<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
    close: "&times;",
    moon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>`,
  };

  /***** Widget class *****/
  class CRWidget {
    constructor() {
      this.apiUrl = null;
      this.clientId = null;
      this.botId = null;
      this.sessionId = null;
      this.container = null;
      this.shadow = null;
      this.elements = {};
      this.isOpen = false;
      this.loading = false;
      this.lastPayload = null; // for retry
      this.messagesKey = null;
    }

    init(config = {}) {
      this.apiUrl = config.apiUrl;
      this.clientId = config.clientId || null;
      this.botId = config.botId || null;
      if (!this.apiUrl) {
        console.error("CRWidget: apiUrl required");
        return;
      }

      this.container = document.getElementById("cr-widget");
      if (!this.container) {
        console.error("CRWidget: #cr-widget not found");
        return;
      }

      this.sessionId = this._getOrCreateSession();
      this.messagesKey = `cr_widget_messages_${this.sessionId}`;

      this.shadow = this.container.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.textContent = STYLES;
      this.shadow.appendChild(style);

      this._renderShell();
      this._loadMessagesFromStorage();
      this._attachListeners();

      // Show initial greeting once per session
      if (!localStorage.getItem(`cr_widget_greeted_v2_${this.sessionId}`)) {
        const greeting = "Hello! How can I help you?";
        this._showBotMessage(greeting, { persist: true, animated: true });
        localStorage.setItem(`cr_widget_greeted_v2_${this.sessionId}`, "1");
      }

      // Initialize Theme
      const savedTheme = localStorage.getItem("cr_widget_theme");
      if (savedTheme === "dark") {
        this.toggleTheme(true);
      }
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
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    _renderShell() {
      const wrapper = document.createElement("div");
      wrapper.className = "wrapper";
      wrapper.innerHTML = `
        <div class="chat-window" role="region" aria-label="Chat window" tabindex="0">
          <div class="header">
            <div class="title"><strong>Ask us</strong><span style="font-weight:400; font-size:12px; opacity:.9"> — AI assistant</span></div>
            <div style="display:flex; gap:8px; align-items:center">
              <button class="theme-btn" aria-label="Toggle theme">${ICONS.moon}</button>
              <button class="close-btn" aria-label="Close chat">${ICONS.close}</button>
            </div>
          </div>
          <div class="messages" role="log" aria-live="polite"></div>
          <div class="input-area">
            <input type="text" placeholder="Type a message..." aria-label="Type a message" />
            <button class="send-btn" aria-label="Send message" disabled>${ICONS.send}</button>
          </div>
        </div>
        <div class="bubble" title="Open chat">${ICONS.chat}</div>
        <div class="toast" aria-hidden="true"></div>
      `;
      this.shadow.appendChild(wrapper);

      this.elements = {
        wrapper,
        window: this.shadow.querySelector(".chat-window"),
        bubble: this.shadow.querySelector(".bubble"),
        closeBtn: this.shadow.querySelector(".close-btn"),
        themeBtn: this.shadow.querySelector(".theme-btn"),
        messages: this.shadow.querySelector(".messages"),
        input: this.shadow.querySelector(".input-area input"),
        sendBtn: this.shadow.querySelector(".send-btn"),
        toast: this.shadow.querySelector(".toast"),
      };
    }

    _attachListeners() {
      // toggle
      const toggle = () => {
        this.isOpen = !this.isOpen;
        this.elements.window.classList.toggle("open", this.isOpen);
        if (this.isOpen) setTimeout(() => this.elements.input.focus(), 120);
      };
      this.elements.bubble.addEventListener("click", toggle);
      this.elements.closeBtn.addEventListener("click", toggle);

      // theme toggle
      this.elements.themeBtn.addEventListener("click", () =>
        this.toggleTheme()
      );

      // send
      this.elements.sendBtn.addEventListener("click", () => this._onSend());
      this.elements.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this._onSend();
      });

      // Enable/disable send button based on input
      this.elements.input.addEventListener("input", () => {
        const hasText = this.elements.input.value.trim().length > 0;
        this.elements.sendBtn.disabled = !hasText;
      });

      // scroll behavior: detect manual scroll to avoid auto-scroll when user is reading history
      let userScrolled = false;
      this.elements.messages.addEventListener("scroll", () => {
        const el = this.elements.messages;
        const atBottom = el.scrollTop + el.clientHeight + 60 >= el.scrollHeight;
        userScrolled = !atBottom;
      });

      // keyboard accessibility: Esc closes
      this.shadow.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) toggle();
      });
    }

    /***** message lifecycle *****/
    _onSend() {
      if (this.loading) return;
      const text = this.elements.input.value.trim();
      if (!text) return;
      // show optimistic user message
      this._renderUserRow(text);
      this._scrollToBottom(true); // Force scroll to bottom
      const userMsgId = this._pushMessage({
        role: "user",
        text,
        time: Date.now(),
      });
      this.elements.input.value = "";
      this.elements.input.focus();

      // build payload
      const payload = {
        client_id: this.clientId,
        bot_id: this.botId,
        session_id: this.sessionId,
        user_message: text,
      };
      this.lastPayload = { payload, userMsgId };

      // call API
      this._callApiAndRender(payload);
    }

    async _callApiAndRender(payload) {
      this._showTyping(true);
      this.loading = true;
      this.elements.sendBtn.disabled = true;

      try {
        const res = await fetch(this.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        // accept data.reply or data.messages[0].text
        const botText =
          (data &&
            (data.reply ||
              (Array.isArray(data.messages) &&
                data.messages[0] &&
                data.messages[0].text))) ||
          "Sorry, I didn't get that.";

        // create bot placeholder then progressively reveal
        await this._showBotMessage(botText, { animated: true, persist: true });
      } catch (err) {
        console.error("Widget network error:", err);
        // show error message with Retry button
        this._showBotMessage("Oops — something went wrong. Please retry.", {
          animated: false,
          persist: true,
          error: true,
        });
        this._showToast("Network error. Retry available.");
      } finally {
        // final cleanup (safe to call even if already removed earlier)
        this._showTyping(false);
        this.loading = false;
        this.elements.sendBtn.disabled = false;
      }
    }

    _showTyping(show) {
      // add/remove a typing bubble at end
      if (show) {
        // create typing element only if not already present
        if (!this.shadow.querySelector(".typing-row")) {
          const row = document.createElement("div");
          row.className = "row bot typing-row";
          row.innerHTML = `
            <div class="avatar bot">AI</div>
            <div class="bubble-content bot"><span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span></div>
          `;
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
      // create a message row with an inner span for progressive reveal
      const row = document.createElement("div");
      row.className = "row bot";
      const avatar = `<div class="avatar bot">AI</div>`;
      const content = document.createElement("div");
      content.className = "bubble-content bot";
      content.innerHTML = `<span class="bot-text"></span>`;
      row.innerHTML = avatar;
      row.appendChild(content);

      // if error, append retry UI
      if (opts.error) {
        const errDiv = document.createElement("div");
        errDiv.className = "message-error";
        errDiv.innerHTML = `<span style="color:#b91c1c">Failed to get reply</span> <button class="btn-retry">Retry</button>`;
        row.appendChild(errDiv);
        // attach retry
        errDiv.querySelector(".btn-retry").addEventListener("click", () => {
          if (this.lastPayload && this.lastPayload.payload) {
            this._callApiAndRender(this.lastPayload.payload);
            // remove error row
            row.remove();
          }
        });
      }

      this.elements.messages.appendChild(row);
      this._maybeAutoScroll();

      // progressive typewriter reveal to feel like AI typing
      if (opts.animated) {
        // remove thinking loader immediately once we start the progressive reveal
        // so the dots stop and the real typing bubble appears.
        this._showTyping(false);

        const span = content.querySelector(".bot-text");
        // faster speeds: short ~10ms, long ~8ms
        const speed = text && text.length > 200 ? 8 : 10;
        await this._typeWrite(span, text, speed);
      } else {
        // clear loader as well for non-animated messages
        this._showTyping(false);
        content.querySelector(".bot-text").textContent = text;
      }

      // persist message to storage
      if (opts.persist) {
        this._pushMessage({ role: "bot", text, time: Date.now() });
      }
    }

    _pushMessage(msg) {
      // push to DOM already done; persist into localStorage
      try {
        const raw = localStorage.getItem(this.messagesKey);
        const arr = raw ? JSON.parse(raw) : [];
        arr.push(msg);
        localStorage.setItem(this.messagesKey, JSON.stringify(arr));
        return arr.length - 1;
      } catch (e) {
        console.warn("Could not persist messages", e);
        return null;
      }
    }

    _loadMessagesFromStorage() {
      try {
        const raw = localStorage.getItem(this.messagesKey);
        const arr = raw ? JSON.parse(raw) : [];
        arr.forEach((m) => {
          if (m.role === "user") this._renderUserRow(m.text);
          else this._renderBotRow(m.text);
        });
        // scroll to bottom on load
        setTimeout(() => this._scrollToBottom(true), 40);
      } catch (e) {
        /* ignore */
      }
    }

    _renderUserRow(text) {
      const row = document.createElement("div");
      row.className = "row user";
      row.innerHTML = `
        <div class="bubble-content user">${this._escape(text)}</div>
        <div class="avatar user">You</div>
      `;
      this.elements.messages.appendChild(row);
    }

    _renderBotRow(text) {
      const row = document.createElement("div");
      row.className = "row bot";
      row.innerHTML = `
        <div class="avatar bot">AI</div>
        <div class="bubble-content bot">${this._escape(text)}</div>
      `;
      this.elements.messages.appendChild(row);
    }

    _escape(s) {
      if (!s) return "";
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    _maybeAutoScroll() {
      const el = this.elements.messages;
      // if user has scrolled up intentionally, don't auto scroll
      const atBottom = el.scrollTop + el.clientHeight + 60 >= el.scrollHeight;
      if (atBottom) this._scrollToBottom();
    }

    _scrollToBottom(immediate = false) {
      const el = this.elements.messages;
      if (immediate) {
        el.scrollTop = el.scrollHeight;
      } else {
        // smooth behaviour
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      }
    }

    _showToast(msg, ms = 3000) {
      const t = this.elements.toast;
      t.textContent = msg;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), ms);
    }

    _typeWrite(el, text, speed = 10) {
      // returns a promise that resolves when done
      return new Promise((resolve) => {
        el.textContent = "";
        let i = 0;
        const step = () => {
          if (i <= text.length) {
            el.textContent = text.slice(0, i);
            i++;
            this._maybeAutoScroll();
            setTimeout(step, speed + Math.random() * 6); // small jitter
          } else resolve();
        };
        // small initial delay for realism
        setTimeout(step, 220 + Math.random() * 200);
      });
    }

    toggleTheme(forceDark) {
      const isDark =
        forceDark !== undefined
          ? forceDark
          : !this.shadow.host.classList.contains("dark");
      this.shadow.host.classList.toggle("dark", isDark);
      this.elements.themeBtn.innerHTML = isDark ? ICONS.sun : ICONS.moon;
      localStorage.setItem("cr_widget_theme", isDark ? "dark" : "light");
    }
  }

  window.CRWidget = new CRWidget();
})();
