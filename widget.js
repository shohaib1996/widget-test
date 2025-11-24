(function () {
  const STYLES = `
    :host {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      --primary-color: #4F46E5;
      --primary-hover: #4338CA;
      --bg-color: #ffffff;
      --text-color: #1F2937;
      --gray-100: #F3F4F6;
      --gray-200: #E5E7EB;
      --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      z-index: 9999;
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 16px;
    }

    /* Chat Bubble */
    .bubble {
      width: 60px;
      height: 60px;
      background-color: var(--primary-color);
      border-radius: 50%;
      box-shadow: var(--shadow);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, background-color 0.2s;
    }

    .bubble:hover {
      transform: scale(1.05);
      background-color: var(--primary-hover);
    }

    .bubble svg {
      width: 30px;
      height: 30px;
      fill: white;
    }

    /* Chat Window */
    .chat-window {
      width: 350px;
      height: 500px;
      background-color: var(--bg-color);
      border-radius: 16px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s ease;
      transform-origin: bottom right;
      position: absolute;
      bottom: 80px;
      right: 0;
    }

    .chat-window.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* Header */
    .header {
      background-color: var(--primary-color);
      color: white;
      padding: 16px;
      font-weight: 600;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 20px;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    
    .close-btn:hover {
      opacity: 1;
    }

    /* Messages Area */
    .messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background-color: var(--gray-100);
    }

    .message {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }

    .message.user {
      align-self: flex-end;
      background-color: var(--primary-color);
      color: white;
      border-bottom-right-radius: 2px;
    }

    .message.bot {
      align-self: flex-start;
      background-color: white;
      color: var(--text-color);
      border: 1px solid var(--gray-200);
      border-bottom-left-radius: 2px;
    }

    /* Input Area */
    .input-area {
      padding: 16px;
      border-top: 1px solid var(--gray-200);
      display: flex;
      gap: 10px;
      background-color: white;
    }

    input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid var(--gray-200);
      border-radius: 24px;
      outline: none;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    input:focus {
      border-color: var(--primary-color);
    }

    button.send-btn {
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    button.send-btn:hover {
      background-color: var(--primary-hover);
    }
    
    button.send-btn:disabled {
      background-color: var(--gray-200);
      cursor: not-allowed;
    }

    button.send-btn svg {
      width: 18px;
      height: 18px;
      fill: white;
      margin-left: 2px; /* Visual correction */
    }
  `;

  const ICONS = {
    chat: `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>`,
    close: `&times;`,
    send: `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`,
  };

  class CRWidget {
    constructor() {
      this.isOpen = false;
      this.apiUrl = null;
      this.container = null;
      this.shadow = null;
      this.elements = {};
    }

    init(config = {}) {
      this.apiUrl = config.apiUrl;
      if (!this.apiUrl) {
        console.error("CRWidget: apiUrl is required");
        return;
      }

      this.container = document.getElementById("cr-widget");
      if (!this.container) {
        console.error("CRWidget: Container #cr-widget not found");
        return;
      }

      // Create Shadow DOM
      this.shadow = this.container.attachShadow({ mode: "open" });

      // Inject Styles
      const styleTag = document.createElement("style");
      styleTag.textContent = STYLES;
      this.shadow.appendChild(styleTag);

      // Create UI
      this.createUI();
      this.attachListeners();
    }

    createUI() {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <div class="chat-window">
          <div class="header">
            <span>Chat Support</span>
            <button class="close-btn">${ICONS.close}</button>
          </div>
          <div class="messages">
            <div class="message bot">Hello! How can I help you today?</div>
          </div>
          <div class="input-area">
            <input type="text" placeholder="Type a message..." />
            <button class="send-btn">${ICONS.send}</button>
          </div>
        </div>
        <div class="bubble">
          ${ICONS.chat}
        </div>
      `;

      this.shadow.appendChild(wrapper);

      // Cache elements
      this.elements = {
        window: this.shadow.querySelector(".chat-window"),
        bubble: this.shadow.querySelector(".bubble"),
        closeBtn: this.shadow.querySelector(".close-btn"),
        input: this.shadow.querySelector("input"),
        sendBtn: this.shadow.querySelector(".send-btn"),
        messages: this.shadow.querySelector(".messages"),
      };
    }

    attachListeners() {
      // Toggle Chat
      const toggle = () => {
        this.isOpen = !this.isOpen;
        this.elements.window.classList.toggle("open", this.isOpen);
        if (this.isOpen) {
          setTimeout(() => this.elements.input.focus(), 100); // Focus input when opened
        }
      };

      this.elements.bubble.addEventListener("click", toggle);
      this.elements.closeBtn.addEventListener("click", toggle);

      // Send Message
      const sendMessage = async () => {
        const text = this.elements.input.value.trim();
        if (!text) return;

        // Add User Message
        this.addMessage(text, "user");
        this.elements.input.value = "";
        this.elements.sendBtn.disabled = true;

        try {
          const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
          });

          if (!response.ok) throw new Error("Network response was not ok");

          const data = await response.json();
          this.addMessage(data.reply, "bot");
        } catch (error) {
          console.error("Error sending message:", error);
          this.addMessage(
            "Sorry, something went wrong. Please try again.",
            "bot"
          );
        } finally {
          this.elements.sendBtn.disabled = false;
          this.elements.input.focus();
        }
      };

      this.elements.sendBtn.addEventListener("click", sendMessage);
      this.elements.input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
      });
    }

    addMessage(text, type) {
      const msgDiv = document.createElement("div");
      msgDiv.className = `message ${type}`;
      msgDiv.textContent = text;
      this.elements.messages.appendChild(msgDiv);
      this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }
  }
  window.CRWidget = new CRWidget();
})();
