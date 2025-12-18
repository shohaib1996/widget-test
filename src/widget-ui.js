/**
 * Widget UI Module
 * Handles all UI rendering and interactions
 */

import { ICONS } from "./widget-icons.js";

export class WidgetUI {
  constructor(shadow, config = {}) {
    this.shadow = shadow;
    this.elements = {};
    this.greetingMessage =
      config.greetingMessage || "Hi there! How can I help today?";
    this.primaryColor = config.primaryColor || "#8A06E6";
    this.position = config.position || "bottom-right";
  }

  /**
   * Render the widget shell
   */
  renderShell() {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

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

  /**
   * Apply customization styles
   */
  applyCustomization(customStyle) {
    if (!this.shadow || !customStyle) return;

    const wrapper = this.shadow.querySelector(".wrapper");
    if (!wrapper) return;

    const darkerColor = this._adjustColorBrightness(this.primaryColor, -10);

    customStyle.textContent = `
      :host {
        --primary: ${this.primaryColor} !important;
        --primary-600: ${darkerColor} !important;
        --bubble-user: ${this.primaryColor} !important;
        --bg-header: linear-gradient(90deg, ${this.primaryColor}, ${darkerColor}) !important;
      }
    `;

    if (this.position === "bottom-left") {
      wrapper.style.right = "auto";
      wrapper.style.left = "20px";
    }
  }

  /**
   * Adjust color brightness
   */
  _adjustColorBrightness(hex, percent) {
    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.max(0, Math.min(255, r + (r * percent) / 100));
    const newG = Math.max(0, Math.min(255, g + (g * percent) / 100));
    const newB = Math.max(0, Math.min(255, b + (b * percent) / 100));

    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  }

  /**
   * Toggle window open/close
   */
  toggleWindow(isOpen) {
    this.elements.window.classList.toggle("open", isOpen);
    this.elements.bubble.innerHTML = isOpen ? ICONS.close : ICONS.chat;
    this.elements.bubble.title = isOpen ? "Close chat" : "Open chat";
  }

  /**
   * Show greeting message
   */
  showGreeting() {
    this._renderBotRow(this.greetingMessage);
  }

  /**
   * Render user message row
   */
  renderUserRow(text) {
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

  /**
   * Render bot message row
   */
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

  /**
   * Show typing indicator
   */
  showTyping(show) {
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

  /**
   * Show bot message with animation
   */
  async showBotMessage(
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
    }

    this.elements.messages.appendChild(row);
    this._maybeAutoScroll();

    if (opts.animated) {
      this.showTyping(false);
      const span = content.querySelector(".bot-text");
      const speed = text && text.length > 200 ? 8 : 10;
      await this._typeWrite(span, text, speed);
    } else {
      this.showTyping(false);
      const span = content.querySelector(".bot-text");
      if (span) span.textContent = text;
    }

    return row;
  }

  /**
   * Typewriter effect
   */
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

  /**
   * Escape HTML
   */
  _escape(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /**
   * Auto scroll if at bottom
   */
  _maybeAutoScroll() {
    const el = this.elements.messages;
    const atBottom = el.scrollTop + el.clientHeight + 60 >= el.scrollHeight;
    if (atBottom) this.scrollToBottom();
  }

  /**
   * Scroll to bottom
   */
  scrollToBottom(immediate = false) {
    const el = this.elements.messages;
    if (immediate) el.scrollTop = el.scrollHeight;
    else el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }

  /**
   * Show toast notification
   */
  showToast(msg, ms = 3000) {
    const t = this.elements.toast;
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), ms);
  }

  /**
   * Get input value
   */
  getInputValue() {
    return this.elements.input.value.trim();
  }

  /**
   * Clear input
   */
  clearInput() {
    this.elements.input.value = "";
  }

  /**
   * Focus input
   */
  focusInput() {
    this.elements.input.focus();
  }

  /**
   * Set send button state
   */
  setSendButtonState(enabled) {
    this.elements.sendBtn.disabled = !enabled;
  }
}
