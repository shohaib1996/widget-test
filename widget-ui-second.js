/**
 * Widget UI Module
 * Handles all UI rendering and DOM manipulation
 */

import { WIDGET_ICONS } from "./widget-icons-second.js";

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
   * Render the main widget shell
   */
  renderShell() {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";

    wrapper.innerHTML = `
      <div class="chat-window" role="region" aria-label="Chat window" tabindex="0">
        <div class="resize-handle" title="Drag to resize"></div>
        <div class="header">
          <div class="header-left">
            <div class="header-icon"><img src="https://cdn.cipherandrow.com/images/Text.png" alt="Icon" style="width:24px; height:24px; object-fit:contain;" /></div>
            <div class="title">Support Assistant</div>
          </div>
          <div style="display:flex; gap:10px; align-items:center;">
            <div class="status-dot" title="Active"></div>
          </div>
        </div>
        <div class="messages" role="log" aria-live="polite"></div>
        <div class="input-area">
          <div class="input-pill">
            <input type="text" placeholder="Type your message..." aria-label="Type your message" />
            <button class="send-btn" aria-label="Send message" disabled>${WIDGET_ICONS.send}</button>
          </div>
        </div>
        <div class="footer">Powered by <a href="https://cipherandrow.com/" target="_blank">Cipher & Row</a></div>
      </div>
      <div class="bubble" title="Open chat">${WIDGET_ICONS.chat}</div>
      <div class="toast" aria-hidden="true"></div>
    `;

    this.shadow.appendChild(wrapper);

    this.elements = {
      wrapper,
      window: this.shadow.querySelector(".chat-window"),
      bubble: this.shadow.querySelector(".bubble"),
      messages: this.shadow.querySelector(".messages"),
      input: this.shadow.querySelector(".input-pill input"),
      sendBtn: this.shadow.querySelector(".input-pill .send-btn"),
      toast: this.shadow.querySelector(".toast"),
      resizeHandle: this.shadow.querySelector(".resize-handle"),
    };

    return this.elements;
  }

  /**
   * Apply customization (colors, position)
   */
  applyCustomization(customStyle) {
    if (!this.shadow || !customStyle) return;

    const wrapper = this.shadow.querySelector(".wrapper");
    if (!wrapper) return;

    const darkerColor = this.adjustColorBrightness(this.primaryColor, -10);

    customStyle.textContent = `
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
  }

  /**
   * Adjust color brightness
   */
  adjustColorBrightness(hex, percent) {
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
   * Toggle chat window open/close
   */
  toggleWindow(isOpen) {
    this.elements.window.classList.toggle("open", isOpen);
    this.elements.bubble.innerHTML = isOpen
      ? WIDGET_ICONS.close
      : WIDGET_ICONS.chat;
    this.elements.bubble.title = isOpen ? "Close chat" : "Open chat";
  }

  /**
   * Show greeting message
   */
  showGreeting() {
    this.renderBotRow(this.greetingMessage);
  }

  /**
   * Render user message row
   */
  renderUserRow(text) {
    const row = document.createElement("div");
    row.className = "row user";
    row.innerHTML = `
      <div class="bubble-content user">${this.escapeHtml(text)}</div>
      <div class="avatar user">You</div>
    `;
    this.elements.messages.appendChild(row);
    this.maybeAutoScroll();
  }

  /**
   * Render bot message row
   */
  renderBotRow(text) {
    const row = document.createElement("div");
    row.className = "row bot";
    row.innerHTML = `
      <div class="avatar bot">AI</div>
      <div class="bubble-content bot">${this.escapeHtml(text)}</div>
    `;
    this.elements.messages.appendChild(row);
    this.maybeAutoScroll();
  }

  /**
   * Show typing indicator
   */
  showTyping(show) {
    if (show) {
      if (!this.shadow.querySelector(".typing-row")) {
        const row = document.createElement("div");
        row.className = "row bot typing-row";
        row.innerHTML = `
          <div class="avatar bot">AI</div>
          <div class="bubble-content bot">
            <span class="typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </span>
          </div>
        `;
        this.elements.messages.appendChild(row);
        this.maybeAutoScroll();
      }
    } else {
      const typingRow = this.shadow.querySelector(".typing-row");
      if (typingRow) typingRow.remove();
    }
  }

  /**
   * Show bot message with optional animation
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
      errDiv.innerHTML = `
        <span style="color:#b91c1c">Failed to get reply</span>
        <button class="btn-retry">Retry</button>
      `;
      row.appendChild(errDiv);
    }

    this.elements.messages.appendChild(row);
    this.maybeAutoScroll();

    if (opts.animated) {
      this.showTyping(false);
      const span = content.querySelector(".bot-text");
      const speed = text && text.length > 200 ? 8 : 10;
      await this.typeWrite(span, text, speed);
    } else {
      this.showTyping(false);
      const span = content.querySelector(".bot-text");
      if (span) span.textContent = text;
    }

    return row;
  }

  /**
   * Typewriter animation effect
   */
  async typeWrite(element, text, speed = 10) {
    if (!element || !text) return;

    element.textContent = "";
    const chars = text.split("");

    for (let i = 0; i < chars.length; i++) {
      element.textContent += chars[i];
      this.maybeAutoScroll();
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  }

  /**
   * Show toast notification
   */
  showToast(msg, ms = 3000) {
    const toast = this.elements.toast;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), ms);
  }

  /**
   * Auto-scroll to bottom if near bottom
   */
  maybeAutoScroll() {
    const el = this.elements.messages;
    const atBottom = el.scrollTop + el.clientHeight + 60 >= el.scrollHeight;
    if (atBottom) this.scrollToBottom();
  }

  /**
   * Scroll to bottom
   */
  scrollToBottom(immediate = false) {
    const el = this.elements.messages;
    if (immediate) {
      el.scrollTop = el.scrollHeight;
    } else {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /**
   * Clear input field
   */
  clearInput() {
    this.elements.input.value = "";
  }

  /**
   * Focus input field
   */
  focusInput() {
    this.elements.input.focus();
  }

  /**
   * Get input value
   */
  getInputValue() {
    return this.elements.input.value.trim();
  }

  /**
   * Enable/disable send button
   */
  setSendButtonState(enabled) {
    this.elements.sendBtn.disabled = !enabled;
  }

  /**
   * Setup resize functionality (supports both mouse and touch)
   */
  setupResize() {
    if (!this.elements.resizeHandle || !this.elements.window) return;

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    // Get coordinates from mouse or touch event
    const getCoordinates = (e) => {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: e.clientX, y: e.clientY };
    };

    const startResize = (e) => {
      e.preventDefault();
      e.stopPropagation();

      isResizing = true;
      const coords = getCoordinates(e);
      startX = coords.x;
      startY = coords.y;

      const rect = this.elements.window.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;

      this.elements.window.classList.add("resizing");
      this.elements.resizeHandle.classList.add("active");

      // Add both mouse and touch listeners
      document.addEventListener("mousemove", performResize);
      document.addEventListener("mouseup", stopResize);
      document.addEventListener("touchmove", performResize, { passive: false });
      document.addEventListener("touchend", stopResize);
    };

    const performResize = (e) => {
      if (!isResizing) return;

      e.preventDefault(); // Prevent scrolling on mobile

      const coords = getCoordinates(e);

      // Calculate the delta (how much the pointer moved)
      const deltaX = startX - coords.x; // Inverted because we're dragging top-left
      const deltaY = startY - coords.y; // Inverted because we're dragging top-left

      // Calculate new dimensions
      let newWidth = startWidth + deltaX;
      let newHeight = startHeight + deltaY;

      // Apply constraints
      const minWidth = 300;
      const minHeight = 400;
      const maxWidth = Math.min(600, window.innerWidth - 40); // Account for screen width
      const maxHeight = Math.min(800, window.innerHeight - 40); // Account for screen height

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      // Apply new dimensions
      this.elements.window.style.width = `${newWidth}px`;
      this.elements.window.style.height = `${newHeight}px`;
    };

    const stopResize = () => {
      if (!isResizing) return;

      isResizing = false;
      this.elements.window.classList.remove("resizing");
      this.elements.resizeHandle.classList.remove("active");

      // Remove all listeners
      document.removeEventListener("mousemove", performResize);
      document.removeEventListener("mouseup", stopResize);
      document.removeEventListener("touchmove", performResize);
      document.removeEventListener("touchend", stopResize);
    };

    // Attach both mouse and touch start events
    this.elements.resizeHandle.addEventListener("mousedown", startResize);
    this.elements.resizeHandle.addEventListener("touchstart", startResize, {
      passive: false,
    });
  }
}
