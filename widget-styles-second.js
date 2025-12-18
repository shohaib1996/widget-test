/**
 * Widget Styles Module
 * Contains all CSS styling for the chat widget
 */

export const WIDGET_STYLES = `
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
    width: 360px;
    height: 520px;
    min-width: 300px;
    min-height: 400px;
    max-width: 600px;
    max-height: 800px;
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
    position: relative;
  }
  .chat-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
  .chat-window.resizing { transition: none; }

  .resize-handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    cursor: nwse-resize;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
    touch-action: none; /* Prevent default touch behaviors */
  }
  .chat-window:hover .resize-handle,
  .resize-handle.active {
    opacity: 1;
  }
  /* Always show resize handle on mobile/touch devices */
  @media (hover: none) and (pointer: coarse) {
    .resize-handle {
      opacity: 0.7;
      width: 36px;  /* Larger touch target */
      height: 36px;
    }
    .resize-handle.active {
      opacity: 1;
    }
  }
  .resize-handle::before {
    content: '';
    width: 12px;
    height: 12px;
    border-left: 2px solid rgba(138, 6, 230, 0.6);
    border-top: 2px solid rgba(138, 6, 230, 0.6);
    border-top-left-radius: 4px;
  }
  .resize-handle:hover::before,
  .resize-handle.active::before {
    border-color: var(--primary);
  }

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
  .input-pill input {
    border:0;
    outline:none;
    background: transparent;
    flex:1;
    font-size:16px;
    color: #374151;
    padding:0;
    min-height:20px;
  }
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
