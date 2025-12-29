/**
 * Widget Styles Module
 * Contains all CSS styling for the chat widget
 */

export const STYLES = `
  .messages::-webkit-scrollbar { width: 6px; }
  .messages::-webkit-scrollbar-track { background: transparent; }
  .messages::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 20px;
  }
  .messages::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.18); }

  :host { all: initial; }
  :host, * { box-sizing: border-box; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; }
  :host {
    /* ===== GLASS UI TOKEN SYSTEM ===== */

    /* Primary Color System (converted to RGB for alpha support) */
    --primary: var(--widget-primary, #8A06E6);
    --primary-600: var(--widget-primary-600, #7505C7);
    --primary-rgb: 138, 6, 230; /* RGB values from #8A06E6 */

    /* Glass Surface Backgrounds - Fully Transparent with blur only */
    --glass-bg-primary: rgba(255, 255, 255, 0.05);
    --glass-bg-secondary: rgba(255, 255, 255, 0.08);
    --glass-bg-tertiary: rgba(255, 255, 255, 0.03);
    --glass-bg-input: rgba(255, 255, 255, 0.06);

    /* Glass Blur Effects - Stronger for clarity */
    --glass-blur-light: blur(20px);
    --glass-blur-medium: blur(24px);
    --glass-blur-heavy: blur(28px);
    --glass-blur-subtle: blur(16px);

    /* Glass Borders - More subtle */
    --glass-border-subtle: rgba(255, 255, 255, 0.18);
    --glass-border-prominent: rgba(255, 255, 255, 0.3);
    --glass-border-dark: rgba(0, 0, 0, 0.05);

    /* Glass Shadows (multi-layer depth system) */
    --glass-shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.05);
    --glass-shadow-md: 0 8px 32px rgba(0, 0, 0, 0.08);
    --glass-shadow-lg: 0 12px 48px rgba(0, 0, 0, 0.12);
    --glass-shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.15);

    /* Glass Inner Highlights (for depth) */
    --glass-highlight: rgba(255, 255, 255, 0.15);
    --glass-highlight-strong: rgba(255, 255, 255, 0.3);

    /* Primary Color Glass Variants */
    --primary-glass: rgba(var(--primary-rgb), 0.12);
    --primary-glass-border: rgba(var(--primary-rgb), 0.25);
    --primary-glass-hover: rgba(var(--primary-rgb), 0.18);
    --primary-glass-light: rgba(var(--primary-rgb), 0.08);

    /* Border Radius System */
    --glass-radius-sm: 10px;
    --glass-radius-md: 14px;
    --glass-radius-lg: 16px;
    --glass-radius-xl: 18px;
    --glass-radius-full: 999px;

    /* Text Colors (high contrast for glass readability) */
    --text-primary: rgba(0, 0, 0, 0.87);
    --text-secondary: rgba(0, 0, 0, 0.65);
    --text-tertiary: rgba(0, 0, 0, 0.45);
    --text-muted: rgba(0, 0, 0, 0.38);

    /* Legacy token compatibility (mapped to new glass tokens) */
    --bg-window: var(--glass-bg-primary);
    --bg-header: linear-gradient(135deg, var(--primary-glass), var(--primary-glass-light));
    --bg-messages: linear-gradient(to bottom, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.02));
    --bg-input: var(--glass-bg-input);
    --text-main: var(--text-primary);
    --border: var(--glass-border-dark);
    --bubble-bot: var(--glass-bg-secondary);
    --bubble-user: var(--primary-glass);
    --bubble-user-text: rgba(var(--primary-rgb), 0.95);
    --shadow: var(--glass-shadow-md);
  }

  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(1px)) {
    :host {
      --glass-bg-primary: rgba(255, 255, 255, 0.85);
      --glass-bg-secondary: rgba(255, 255, 255, 0.92);
      --glass-bg-tertiary: rgba(255, 255, 255, 0.80);
      --glass-bg-input: rgba(255, 255, 255, 0.88);
      --glass-blur-light: none;
      --glass-blur-medium: none;
      --glass-blur-heavy: none;
      --glass-blur-subtle: none;
    }
  }

  .wrapper {
    z-index: 2147483647; /* Maximum safe z-index value - ensures widget is always on top */
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
    pointer-events: none; /* Make wrapper transparent to clicks */

    /* Safe area support for iOS notches and Android navigation */
    bottom: max(20px, env(safe-area-inset-bottom));
    right: max(20px, env(safe-area-inset-right));
    left: auto;
  }

  .wrapper > * {
    pointer-events: auto; /* Re-enable clicks on children (bubble and chat window) */
  }

  .bubble {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.1) inset,
      0 8px 32px rgba(0, 0, 0, 0.08),
      0 2px 8px rgba(0, 0, 0, 0.05);
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 1;
  }
  .bubble:hover {
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    transform: translateY(-2px) scale(1.03);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
      0 12px 48px rgba(0, 0, 0, 0.10),
      0 4px 12px rgba(0, 0, 0, 0.08);
  }
  .bubble svg {
    pointer-events: none;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  }

  .chat-window {
    width: 100%;
    height: 520px;
    max-height: min(520px, calc(100vh - 100px));
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: none;
    box-shadow: none;
    border-radius: 0;
    overflow: visible;
    display: flex;
    flex-direction: column;
    transform-origin: bottom right;
    opacity: 0;
    transform: translateY(10px) scale(.98);
    pointer-events: none;
    transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1),
                transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
    will-change: opacity, transform;
    transform: translateZ(0);
    position: relative;
    z-index: 2;
  }
  .chat-window.open {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: all;
    z-index: 3;
  }

  .header {
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:12px;
    padding:16px 18px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 16px;
    margin-bottom: 16px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.08) inset,
      0 8px 32px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.1);
    opacity: 0;
    pointer-events: auto;
    transition: opacity 300ms ease-in-out;
  }

  .header.visible {
    opacity: 1;
  }

  .header:hover {
    opacity: 1;
  }
  .header-left { display:flex; align-items:center; gap:12px; }
  .title {
    font-size: 15px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    display:flex;
    align-items:center;
    gap:8px;
    letter-spacing: -0.01em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .header-icon {
    width:32px;
    height:32px;
    border-radius: 32px;
    background: var(--primary-glass-light);
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
    width:8px;
    height:8px;
    border-radius:999px;
    background:#10B981;
    box-shadow: 0 0 0 4px rgba(16,185,129,0.08);
    animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
      box-shadow: 0 0 0 6px rgba(16,185,129,0.12);
    }
  }

  .messages {
    flex: 1;
    padding: 0;
    display:flex;
    flex-direction: column;
    gap: 14px;
    overflow-y: auto;
    background: transparent;
    overflow-x: hidden;
  }

  .row { display:flex; gap:10px; align-items:flex-end; }
  .row.bot { justify-content:flex-start; }
  .row.user { justify-content:flex-end; }

  .avatar {
    width:38px; height:38px; border-radius:50%; flex:0 0 38px;
    display:grid; place-items:center; font-weight:700; color:white;
    user-select:none; font-size:12px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
      0 6px 24px rgba(0, 0, 0, 0.15),
      0 3px 8px rgba(0, 0, 0, 0.1);
  }
  .avatar.bot { background: var(--primary); color: white; }
  .avatar.user { background: var(--primary); color: white; }

  .bubble-content {
    max-width: 92%;
    padding:13px 16px;
    border-radius:12px;
    line-height:1.5;
    white-space:pre-wrap;
    word-break:break-word;
    font-size: 14px;
  }

  .bubble-content.bot {
    background: rgba(255, 255, 255, 0.22);
    backdrop-filter: blur(80px) saturate(200%);
    -webkit-backdrop-filter: blur(80px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: 18px;
    color: rgba(255, 255, 255, 0.98);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
      0 2px 8px rgba(0, 0, 0, 0.06),
      0 1px 2px rgba(0, 0, 0, 0.04);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }

  .bubble-content.user {
    background: var(--primary);
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-top-right-radius: 6px;
    color: rgba(255, 255, 255, 0.98);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.15) inset,
      0 2px 8px rgba(0, 0, 0, 0.05),
      0 1px 2px rgba(0, 0, 0, 0.03);
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .bubble-content.bot a {
    color: rgba(255, 255, 255, 0.95);
    text-decoration: none;
    font-weight: 600;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    transition: border-color 150ms ease;
  }

  .bubble-content.bot a:hover {
    border-bottom-color: rgba(255, 255, 255, 1);
  }

  .bubble-content.user a {
    color: rgba(255, 255, 255, 0.95);
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4);
    transition: border-color 150ms ease;
  }

  .bubble-content.user a:hover {
    border-bottom-color: rgba(255, 255, 255, 1);
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
  .dot { width:6px; height:6px; background:rgba(var(--primary-rgb), 0.5); border-radius:50%; opacity:0.9; animation: typing 1s infinite; }
  .dot:nth-child(1){ animation-delay:0s; } .dot:nth-child(2){ animation-delay:.15s; } .dot:nth-child(3){ animation-delay:.30s; }
  @keyframes typing { 0%{ transform:translateY(0); opacity:.4;} 50%{ transform:translateY(-5px); opacity:1;} 100%{ transform:translateY(0); opacity:.4;} }

  .input-area {
    display:flex;
    gap:8px;
    padding:0;
    margin-top: 16px;
    background: transparent;
    align-items:center;
    position:relative;
  }

  .input-pill {
    width:100%;
    background: transparent;
    backdrop-filter: blur(40px);
    -webkit-backdrop-filter: blur(40px);
    border-radius: var(--glass-radius-full);
    padding: 6px 12px;
    display:flex;
    align-items:center;
    gap:8px;
    border: 1px solid transparent;
    box-shadow: none;
    transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .input-pill:focus-within {
    background: transparent;
    border: 1px solid rgba(var(--primary-rgb), 0.6);
    box-shadow: none;
  }

  .input-pill input {
    border:0;
    outline:none;
    background: transparent;
    flex:1;
    font-size:16px;
    color: rgba(255, 255, 255, 0.95);
    padding:0;
    min-height:18px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .input-pill input::placeholder {
    color: rgba(255, 255, 255, 0.5);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  .send-btn {
    width:32px;
    height:32px;
    border-radius:8px;
    border:none;
    cursor:pointer;
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.9), rgba(var(--primary-rgb), 1));
    color:white;
    display:grid;
    place-items:center;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
      0 4px 12px rgba(var(--primary-rgb), 0.25);
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink:0;
  }

  .send-btn svg {
    width: 18px;
    height: 18px;
  }

  .send-btn:hover:not([disabled]) {
    transform: translateY(-1px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.3) inset,
      0 6px 16px rgba(var(--primary-rgb), 0.3);
  }

  .send-btn:active:not([disabled]) {
    transform: translateY(0);
  }

  .send-btn[disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .footer {
    text-align: center;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    padding: 16px 0 0 0;
    background: transparent;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  .footer a {
    color: rgba(255, 255, 255, 0.85);
    text-decoration:none;
    font-weight:500;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }
  .footer a:hover {
    color: rgba(255, 255, 255, 1);
    text-decoration:underline;
  }

  .toast { position: absolute; right: 8px; bottom: 8px; background: rgba(0,0,0,0.8); color: #fff; padding:8px 10px; border-radius:8px; font-size:12px; box-shadow: 0 6px 18px rgba(0,0,0,.12); opacity:0; transform:translateY(8px); transition:opacity .18s, transform .18s; }
  .toast.show { opacity:1; transform:translateY(0); }

  .message-error {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    font-size: 13px;
    color: #b91c1c;
  }

  .btn-retry {
    background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.9), rgba(var(--primary-rgb), 1));
    color: white;
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.2) inset,
      0 2px 6px rgba(var(--primary-rgb), 0.2);
    transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .btn-retry:hover {
    transform: translateY(-1px);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.3) inset,
      0 4px 8px rgba(var(--primary-rgb), 0.3);
  }

  .btn-retry:active {
    transform: translateY(0);
  }

  /* Mobile styles with safe area support */
  @media (max-width:420px) {
    .wrapper {
      width: calc(100vw - 28px);
      right: max(14px, env(safe-area-inset-right));
      bottom: max(14px, env(safe-area-inset-bottom));
      max-width: calc(100vw - max(28px, env(safe-area-inset-left) + env(safe-area-inset-right)));
    }

    .chat-window {
      max-height: 70vh;
      max-height: calc(70dvh - env(safe-area-inset-bottom));
      height: auto;
      background: transparent;
      border: none;
      border-radius: 0;
    }

    .input-area {
      padding-bottom: max(12px, env(safe-area-inset-bottom));
    }

    .bubble {
      width: 56px;
      height: 56px;
    }

    .messages {
      padding-bottom: max(12px, calc(env(safe-area-inset-bottom) / 2));
    }

    .header {
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }

    .bubble-content.bot,
    .bubble-content.user {
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
    }

    .input-pill {
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }
  }

  /* Landscape mode on mobile */
  @media (max-width: 844px) and (max-height: 420px) and (orientation: landscape) {
    .chat-window {
      max-height: calc(85dvh - env(safe-area-inset-bottom));
      max-height: calc(85vh - env(safe-area-inset-bottom));
    }

    .wrapper {
      bottom: max(10px, env(safe-area-inset-bottom));
      right: max(10px, env(safe-area-inset-right));
    }
  }

  /* Support for viewport resize when keyboard appears */
  @supports (height: 100dvh) {
    .chat-window {
      max-height: min(520px, calc(100dvh - 100px));
    }
  }

  /* Reduced motion accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Fallback for browsers without backdrop-filter support */
  @supports not (backdrop-filter: blur(1px)) {
    .bubble {
      background: rgba(255, 255, 255, 0.85);
    }
    .bubble:hover {
      background: rgba(255, 255, 255, 0.92);
    }
    .chat-window {
      background: transparent;
    }
    .header {
      background: rgba(20, 20, 20, 0.85);
    }
    .bubble-content.bot {
      background: rgba(255, 255, 255, 0.15);
    }
    .bubble-content.user {
      background: var(--primary);
    }
    .input-pill {
      background: rgba(20, 20, 20, 0.85);
    }
  }
`;
