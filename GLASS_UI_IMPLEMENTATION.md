# Glass UI Implementation Plan
**Cipher & Row Chat Widget - Glass MVP**

---

## 📋 Project Overview

**Objective:** Transform the current chat widget into a premium "Glass UI" design that feels like native, paid-grade software.

**Timeline:** 20 hours
**Constraint:** Visual-only changes - NO logic, behavior, or backend modifications
**Success Criteria:** User thinks "This feels like paid software" NOT "This is a chatbot"

---

## 🎯 Implementation Phases (10 Phases)

---

### **PHASE 1: Setup & Token Architecture (2 hours)**

**Goal:** Create the foundation CSS variable system for Glass UI

**Files to Modify:**
- `src/widget-styles.js` (lines 15-31)

**Tasks:**
1. ✅ Create backup of existing files (COMPLETED)
2. Create CSS custom properties for Glass system:
   ```css
   :host {
     /* Glass Surface System */
     --glass-bg-primary: rgba(255, 255, 255, 0.72);
     --glass-bg-secondary: rgba(255, 255, 255, 0.85);
     --glass-bg-input: rgba(255, 255, 255, 0.65);

     /* Glass Effects */
     --glass-blur-light: blur(12px);
     --glass-blur-medium: blur(16px);
     --glass-blur-heavy: blur(20px);

     /* Glass Borders */
     --glass-border-subtle: rgba(255, 255, 255, 0.25);
     --glass-border-prominent: rgba(255, 255, 255, 0.4);

     /* Glass Shadows */
     --glass-shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.05);
     --glass-shadow-md: 0 8px 32px rgba(0, 0, 0, 0.08);
     --glass-shadow-lg: 0 12px 48px rgba(0, 0, 0, 0.12);

     /* Glass Inner Highlights */
     --glass-highlight: rgba(255, 255, 255, 0.15);

     /* Border Radius */
     --glass-radius-sm: 10px;
     --glass-radius-md: 14px;
     --glass-radius-lg: 16px;
     --glass-radius-full: 999px;

     /* Convert existing primary color to RGBA */
     --primary-rgb: 138, 6, 230; /* From #8A06E6 */
     --primary-glass: rgba(var(--primary-rgb), 0.12);
     --primary-glass-border: rgba(var(--primary-rgb), 0.25);

     /* Text Colors (ensure readability on glass) */
     --text-primary: rgba(0, 0, 0, 0.87);
     --text-secondary: rgba(0, 0, 0, 0.65);
     --text-tertiary: rgba(0, 0, 0, 0.45);
   }
   ```

3. Add browser fallback detection:
   ```css
   /* Fallback for browsers without backdrop-filter support */
   @supports not (backdrop-filter: blur(1px)) {
     :host {
       --glass-bg-primary: rgba(255, 255, 255, 0.96);
       --glass-bg-secondary: rgba(255, 255, 255, 0.98);
     }
   }
   ```

**Deliverable:** CSS token system established
**Time:** 2 hours

---

### **PHASE 2: Launcher Bubble Glass Transformation (2 hours)**

**Goal:** Transform the floating chat bubble to Glass UI aesthetic

**Files to Modify:**
- `src/widget-styles.js` (lines 57-71: `.bubble` styles)

**Current State:**
```css
.bubble {
  background: var(--primary);
  box-shadow: var(--shadow);
}
```

**Transform To:**
```css
.bubble {
  /* Glass background instead of solid color */
  background: var(--glass-bg-primary);
  backdrop-filter: var(--glass-blur-medium);
  -webkit-backdrop-filter: var(--glass-blur-medium);

  /* Subtle border for definition */
  border: 1px solid var(--glass-border-subtle);

  /* Multi-layer shadow for depth */
  box-shadow:
    0 0 0 1px var(--glass-highlight) inset,  /* Inner rim light */
    var(--glass-shadow-md),                    /* Main depth shadow */
    0 2px 4px rgba(0, 0, 0, 0.05);            /* Contact shadow */

  /* Keep existing properties */
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

/* Enhanced hover state */
.bubble:hover {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: var(--glass-blur-heavy);
  -webkit-backdrop-filter: var(--glass-blur-heavy);
  transform: translateY(-2px) scale(1.03);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.3) inset,
    var(--glass-shadow-lg),
    0 4px 8px rgba(0, 0, 0, 0.08);
}

/* Ensure SVG icon is visible on glass */
.bubble svg {
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(1px)) {
  .bubble {
    background: rgba(255, 255, 255, 0.96);
  }
  .bubble:hover {
    background: rgba(255, 255, 255, 1);
  }
}
```

**Tasks:**
1. Apply glass background with blur
2. Add multi-layer shadows
3. Refine hover state with increased blur
4. Test icon visibility on glass background
5. Add fallback for older browsers

**Deliverable:** Glass-styled launcher bubble
**Time:** 2 hours

---

### **PHASE 3: Chat Window Shell Glass Styling (2.5 hours)**

**Goal:** Apply premium glass panel aesthetic to main chat window

**Files to Modify:**
- `src/widget-styles.js` (lines 73-97: `.chat-window` styles)

**Current State:**
```css
.chat-window {
  background: var(--bg-window);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}
```

**Transform To:**
```css
.chat-window {
  /* Glass panel background */
  background: var(--glass-bg-primary);
  backdrop-filter: var(--glass-blur-light);
  -webkit-backdrop-filter: var(--glass-blur-light);

  /* Refined border */
  border: 1px solid var(--glass-border-prominent);

  /* Premium shadow system */
  box-shadow:
    0 0 0 1px var(--glass-highlight) inset,  /* Inner highlight */
    var(--glass-shadow-md),                   /* Main shadow */
    0 2px 8px rgba(0, 0, 0, 0.06);           /* Soft contact shadow */

  border-radius: var(--glass-radius-md);

  /* Keep existing layout properties */
  width: 100%;
  height: 520px;
  max-height: min(520px, calc(100vh - 100px));
  overflow: hidden;
  display: flex;
  flex-direction: column;

  /* Animation properties */
  transform-origin: bottom right;
  opacity: 0;
  transform: translateY(10px) scale(.98);
  pointer-events: none;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 200ms cubic-bezier(0.4, 0, 0.2, 1);

  /* GPU acceleration */
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

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .chat-window {
    background: rgba(255, 255, 255, 0.97);
  }
}
```

**Tasks:**
1. Apply glass background with subtle blur
2. Implement multi-layer shadow system
3. Refine border to work with glass
4. Optimize animation timing (150-250ms range)
5. Add GPU acceleration hints
6. Test open/close animation smoothness
7. Ensure no jitter or layout shift

**Deliverable:** Premium glass chat window
**Time:** 2.5 hours

---

### **PHASE 4: Header Minimalist Redesign (1.5 hours)**

**Goal:** Create clean, minimal header that feels embedded, not floating

**Files to Modify:**
- `src/widget-styles.js` (lines 99-146: header styles)

**Current State:**
```css
.header {
  background: var(--bg-header); /* Gradient */
  padding: 12px 14px;
}
```

**Transform To:**
```css
.header {
  /* Subtle glass tint instead of gradient */
  background: linear-gradient(
    135deg,
    rgba(var(--primary-rgb), 0.08),
    rgba(var(--primary-rgb), 0.04)
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  /* Minimal border */
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  /* Reduced padding for minimal weight */
  padding: 10px 14px;

  /* Keep layout */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  /* Subtle shadow */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.header-icon {
  width: 32px;
  height: 32px;
  border-radius: 32px;
  background: rgba(var(--primary-rgb), 0.08);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

/* More subtle status dot */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #10B981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.08);
  animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% {
    opacity: 0.6;
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.12);
  }
}
```

**Tasks:**
1. Replace gradient with subtle glass tint
2. Reduce header padding (minimal visual weight)
3. Update text color for glass background
4. Make status dot more subtle
5. Test header legibility on various backgrounds

**Deliverable:** Clean, minimal glass header
**Time:** 1.5 hours

---

### **PHASE 5: Message Bubbles Glass Styling (3 hours)**

**Goal:** Create distinct, readable glass message containers

**Files to Modify:**
- `src/widget-styles.js` (lines 158-192: message bubble styles)

**Current State:**
```css
.bubble-content.bot {
  background: var(--bubble-bot);
  border: 1px solid var(--border);
}

.bubble-content.user {
  background: var(--bubble-user);
  color: var(--bubble-user-text);
}
```

**Transform To:**
```css
/* Bot Messages - High contrast glass */
.bubble-content.bot {
  background: var(--glass-bg-secondary);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  border: 1px solid var(--glass-border-subtle);
  border-top-left-radius: 6px;
  border-radius: 12px;

  padding: 13px 16px; /* Increased from 12px 14px */

  color: var(--text-primary);
  line-height: 1.5;

  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 2px 8px rgba(0, 0, 0, 0.04);

  max-width: 92%;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
}

/* User Messages - Tinted glass */
.bubble-content.user {
  background: var(--primary-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  border: 1px solid var(--primary-glass-border);
  border-top-right-radius: 6px;
  border-radius: 12px;

  padding: 13px 16px;

  /* Dark text on light tinted glass instead of white */
  color: rgba(var(--primary-rgb), 0.95);
  line-height: 1.5;

  box-shadow:
    0 0 0 1px rgba(var(--primary-rgb), 0.08) inset,
    0 2px 8px rgba(var(--primary-rgb), 0.08);

  max-width: 92%;
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
}

/* Link styling inside messages */
.bubble-content a {
  color: rgb(var(--primary-rgb));
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid rgba(var(--primary-rgb), 0.3);
  transition: border-color 150ms ease;
}

.bubble-content a:hover {
  border-bottom-color: rgb(var(--primary-rgb));
}

/* Fallback */
@supports not (backdrop-filter: blur(1px)) {
  .bubble-content.bot {
    background: rgba(255, 255, 255, 0.98);
  }
  .bubble-content.user {
    background: rgba(var(--primary-rgb), 0.15);
  }
}
```

**Tasks:**
1. Apply glass backgrounds to both bot and user messages
2. Increase padding for premium feel
3. Update user message color (dark on tinted glass, not white)
4. Style links to use brand accent
5. Test text readability on glass backgrounds
6. Ensure proper contrast ratios (WCAG AA)

**Deliverable:** Premium glass message bubbles
**Time:** 3 hours

---

### **PHASE 6: Input Bar Glass Styling (2 hours)**

**Goal:** Create sophisticated glass input area that doesn't look like a messenger app

**Files to Modify:**
- `src/widget-styles.js` (lines 208-232: input area styles)

**Current State:**
```css
.input-pill {
  background: #f3f4f6;
  border: 2px solid transparent;
}
```

**Transform To:**
```css
.input-area {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: transparent;
  align-items: center;
  position: relative;
}

.input-pill {
  width: 100%;

  /* Glass input surface */
  background: var(--glass-bg-input);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  border-radius: var(--glass-radius-full);
  padding: 8px 16px;

  display: flex;
  align-items: center;
  gap: 12px;

  /* Subtle border */
  border: 1.5px solid rgba(0, 0, 0, 0.08);

  /* Soft shadow */
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 2px 8px rgba(0, 0, 0, 0.04);

  transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Premium focus state */
.input-pill:focus-within {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(var(--primary-rgb), 0.25);
  box-shadow:
    0 0 0 3px rgba(var(--primary-rgb), 0.08),
    0 4px 16px rgba(0, 0, 0, 0.08);
}

.input-pill input {
  border: 0;
  outline: none;
  background: transparent;
  flex: 1;
  font-size: 14px;
  color: var(--text-primary);
  padding: 0;
  min-height: 22px;
}

.input-pill input::placeholder {
  color: var(--text-tertiary);
}

/* Send button - glass treatment but still prominent */
.send-btn {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: none;
  cursor: pointer;

  background: linear-gradient(
    135deg,
    rgba(var(--primary-rgb), 0.9),
    rgba(var(--primary-rgb), 1)
  );

  color: white;
  display: grid;
  place-items: center;

  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.2) inset,
    0 4px 12px rgba(var(--primary-rgb), 0.25);

  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
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

/* Fallback */
@supports not (backdrop-filter: blur(1px)) {
  .input-pill {
    background: rgba(255, 255, 255, 0.96);
  }
}
```

**Tasks:**
1. Apply glass background to input pill
2. Create refined focus state
3. Update placeholder color for glass
4. Style send button with glass-compatible gradient
5. Test on mobile (ensure keyboard doesn't break glass)

**Deliverable:** Premium glass input area
**Time:** 2 hours

---

### **PHASE 7: States & Indicators Glass Styling (1.5 hours)**

**Goal:** Style loading, error, and retry states to match Glass aesthetic

**Files to Modify:**
- `src/widget-styles.js` (lines 203-206: typing indicator, lines 241-268: error/retry)

**Transform To:**
```css
/* Typing Indicator */
.typing {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  background: rgba(var(--primary-rgb), 0.5);
  border-radius: 50%;
  opacity: 0.9;
  animation: typing 1s infinite;
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.15s; }
.dot:nth-child(3) { animation-delay: 0.30s; }

@keyframes typing {
  0% { transform: translateY(0); opacity: 0.4; }
  50% { transform: translateY(-5px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.4; }
}

/* Error State */
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

/* Retry Button */
.btn-retry {
  background: linear-gradient(
    135deg,
    rgba(var(--primary-rgb), 0.9),
    rgba(var(--primary-rgb), 1)
  );
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
```

**Tasks:**
1. Update typing indicator dots to match glass palette
2. Style error state with subtle glass background
3. Refine retry button to match send button style
4. Test all states for visibility on glass

**Deliverable:** Glass-styled states and indicators
**Time:** 1.5 hours

---

### **PHASE 8: Messages Area & Scrollbar Refinement (1 hour)**

**Goal:** Style the messages container and scrollbar to match Glass UI

**Files to Modify:**
- `src/widget-styles.js` (lines 7-13: scrollbar, lines 148-156: messages area)

**Transform To:**
```css
/* Premium scrollbar */
.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 20px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.18);
}

/* Messages area */
.messages {
  flex: 1;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;

  /* Subtle glass tint */
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.01),
    rgba(0, 0, 0, 0.02)
  );
}
```

**Tasks:**
1. Refine scrollbar to be more subtle
2. Update messages background to subtle gradient
3. Adjust gap between messages

**Deliverable:** Refined messages area
**Time:** 1 hour

---

### **PHASE 9: Footer & Mobile Optimization (1.5 hours)**

**Goal:** Style footer and ensure mobile responsiveness

**Files to Modify:**
- `src/widget-styles.js` (lines 234-236: footer, lines 270-323: mobile styles)

**Transform To:**
```css
/* Footer */
.footer {
  text-align: center;
  font-size: 11px;
  color: var(--text-tertiary);
  padding: 10px 0 12px 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.02),
    transparent
  );
}

.footer a {
  color: rgba(var(--primary-rgb), 0.8);
  text-decoration: none;
  font-weight: 500;
}

.footer a:hover {
  color: rgb(var(--primary-rgb));
  text-decoration: underline;
}

/* Mobile optimizations */
@media (max-width: 420px) {
  .wrapper {
    width: calc(100vw - 28px);
    right: max(14px, env(safe-area-inset-right));
    bottom: max(14px, env(safe-area-inset-bottom));
  }

  .chat-window {
    max-height: 70vh;
    max-height: calc(70dvh - env(safe-area-inset-bottom));

    /* Reduce blur on mobile for performance */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .bubble {
    width: 56px;
    height: 56px;
  }

  /* Lighter blur on mobile messages */
  .bubble-content.bot,
  .bubble-content.user {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Tasks:**
1. Style footer with subtle gradient
2. Reduce blur intensity on mobile for performance
3. Test on actual mobile devices
4. Add reduced-motion support

**Deliverable:** Mobile-optimized glass UI
**Time:** 1.5 hours

---

### **PHASE 10: Testing, QA & Final Polish (2.5 hours)**

**Goal:** Comprehensive testing and final refinements

**Test Checklist:**

**Functional Testing:**
- [ ] Widget opens smoothly (no jitter)
- [ ] Widget closes smoothly
- [ ] Click/tap works on all interactive elements
- [ ] Input focus works correctly
- [ ] Send button enables/disables properly
- [ ] Escape key closes widget
- [ ] Typing indicator appears/disappears
- [ ] Error state displays correctly
- [ ] Retry button works

**Visual Testing:**
- [ ] Test on white background
- [ ] Test on black background
- [ ] Test on image background
- [ ] Test on video background (current demo)
- [ ] Test on gradient background
- [ ] Test with different primary colors

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Firefox (latest)

**Mobile Testing:**
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test keyboard appearance
- [ ] Test safe area insets

**Accessibility Testing:**
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Focus indicators visible
- [ ] Reduced motion works

**Performance Testing:**
- [ ] No lag during animations
- [ ] Blur doesn't cause jank
- [ ] Smooth scrolling in messages
- [ ] Quick load time

**Final Polish:**
- [ ] Adjust any colors for better contrast
- [ ] Fine-tune blur intensity
- [ ] Perfect shadow depths
- [ ] Ensure all transitions are 150-250ms
- [ ] Review all spacing/padding

**Deliverable:** Production-ready Glass UI widget
**Time:** 2.5 hours

---

## 📊 Time Breakdown Summary

| Phase | Task | Hours |
|-------|------|-------|
| Phase 1 | Token Architecture | 2.0h |
| Phase 2 | Launcher Bubble | 2.0h |
| Phase 3 | Chat Window Shell | 2.5h |
| Phase 4 | Header Redesign | 1.5h |
| Phase 5 | Message Bubbles | 3.0h |
| Phase 6 | Input Bar | 2.0h |
| Phase 7 | States & Indicators | 1.5h |
| Phase 8 | Messages Area | 1.0h |
| Phase 9 | Footer & Mobile | 1.5h |
| Phase 10 | Testing & QA | 2.5h |
| **TOTAL** | | **19.5h** |

**Buffer:** 0.5 hours for unexpected issues
**Final Total:** 20 hours

---

## 🎯 Success Metrics

**Visual Quality:**
- Looks like native OS software panel
- Doesn't look like a chat app
- Feels premium and paid-grade

**Performance:**
- Animations at 60fps
- No layout jitter
- Fast load time (<100ms impact)

**Compatibility:**
- Works on all target browsers
- Graceful fallback on older browsers
- Mobile-optimized

**Code Quality:**
- Only CSS changes
- No behavioral modifications
- Clean, maintainable tokens

---

## 📝 Notes

**Files Modified:**
- `src/widget-styles.js` (PRIMARY - all visual changes)
- No JavaScript logic files modified
- No HTML structure changes

**Backup Location:**
- `widget-backup.js`
- `src-backup/`

**Browser Fallback Strategy:**
- Modern browsers: Full glass with blur
- Older browsers: Semi-opaque surfaces without blur
- All functionality preserved

---

## 🚀 Getting Started

1. Review this plan
2. Get client approval
3. Start with Phase 1 (tokens)
4. Progress sequentially through phases
5. Test after each phase
6. Complete Phase 10 QA before delivery

**Good luck! 🎨**
