/**
 * Widget UI Module
 * Handles all UI rendering and interactions
 */

import { ICONS } from "./widget-icons.js";

/**
 * Helper function to render message text with clickable links
 * Handles both HTML <a> tags and plain URLs
 */
function renderMessageText(text, primaryColor) {
  // First, extract links from HTML <a> tags
  const htmlLinkPattern = /<a\s+[^>]*href=["']?([^"'\s>]+)["']?[^>]*>([^<]*)<\/a>/gi;

  // Store extracted links and replace with placeholder tokens
  const links = [];
  let processedText = text.replace(htmlLinkPattern, (_, href, linkText) => {
    // Clean the href - remove trailing quotes or other junk
    const cleanHref = href.replace(/["']+$/, '');
    links.push({ href: cleanHref, text: linkText || cleanHref });
    return `\u0000HTMLLINK${links.length - 1}\u0000`;
  });

  // Remove any remaining HTML tags (cleanup)
  processedText = processedText.replace(/<[^>]+>/g, '');

  // Now handle plain URLs (http, https, www, and domain.com/path patterns) that aren't inside placeholders
  const urlPattern = /(https?:\/\/[^\s<\u0000"']+|www\.[^\s<\u0000"']+|[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:[-a-zA-Z0-9._~:/?#\[\]@!$&'()*+,;=%]*[a-zA-Z0-9/])?)/gi;
  processedText = processedText.replace(urlPattern, (match) => {
    // Clean up any trailing punctuation
    const cleaned = match.replace(/[.,;:!?)]+$/, '');
    const trailing = match.slice(cleaned.length);
    links.push({ href: cleaned, text: cleaned });
    return `\u0000HTMLLINK${links.length - 1}\u0000${trailing}`;
  });

  // Split by placeholder pattern and build HTML
  const parts = processedText.split(/\u0000/);
  let html = '';

  for (const part of parts) {
    const linkMatch = part.match(/^HTMLLINK(\d+)$/);
    if (linkMatch) {
      const linkData = links[parseInt(linkMatch[1])];
      if (linkData) {
        const href = linkData.href.startsWith("http") ? linkData.href : `https://${linkData.href}`;
        // Escape the link text but keep the href as is
        const escapedText = escapeHtml(linkData.text);
        html += `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: ${primaryColor}; text-decoration: underline;">${escapedText}</a>`;
      }
    } else if (part) {
      html += escapeHtml(part);
    }
  }

  return html;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Check if text contains HTML tags
 */
function containsHtml(text) {
  return /<[a-z][\s\S]*>/i.test(text);
}

export class WidgetUI {
  constructor(shadow, config = {}) {
    this.shadow = shadow;
    this.elements = {};
    this.botName = config.botName || "Support Assistant";
    this.greetingMessage =
      config.greetingMessage || "Hi there! How can I help today?";
    this.primaryColor = config.primaryColor || "#8A06E6";
    this.position = config.position || "bottom-right";
    this.offsetX = config.offsetX !== undefined ? config.offsetX : 20;
    this.offsetY = config.offsetY !== undefined ? config.offsetY : 20;
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
    inner += `      <div class="title">${this._escape(this.botName)}</div>`;
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

    // Apply position and offset
    if (this.position === "bottom-left") {
      wrapper.style.right = "auto";
      wrapper.style.left = `${this.offsetX}px`;
      wrapper.style.bottom = `${this.offsetY}px`;
    } else {
      // bottom-right (default)
      wrapper.style.right = `${this.offsetX}px`;
      wrapper.style.bottom = `${this.offsetY}px`;
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

    // Check if text contains HTML (like <a> tags) - skip typing animation
    const hasHtml = containsHtml(text);

    if (hasHtml) {
      // Skip typing animation for HTML content, render with links
      this.showTyping(false);
      const span = content.querySelector(".bot-text");
      if (span) {
        span.innerHTML = renderMessageText(text, this.primaryColor);
      }
    } else if (opts.animated) {
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
