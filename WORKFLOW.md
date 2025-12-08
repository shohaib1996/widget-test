# 🚀 Cipher & Row Widget - Complete User Workflow

## Overview

This document explains the complete user journey from signup to widget installation on their website.

---

## 📋 Step-by-Step User Workflow

### **Step 1: User Signs Up**

**Location:** `/signup`

1. User visits your website
2. Clicks "Sign Up"
3. Fills out registration form
4. Creates account

**What Happens:**

- User account created in database
- User receives unique `clientId` (e.g., `YOUR_CLIENT_ID`)
- User data saved to `localStorage` under key `"user"`

---

### **Step 2: User Completes Payment**

**Location:** `/dashboard/settings` (Billing section)

1. User logs into dashboard
2. Navigates to Settings → Billing & Plan
3. Clicks "Upgrade" button
4. Completes payment via Stripe

**What Happens:**

- User subscription activated
- User tier updated (Free Trial → Pro/Professional)
- Access to widget features enabled

---

### **Step 3: User Generates API Key**

**Location:** `/dashboard/settings` (API Key Management)

1. User scrolls to "API Key Management" section
2. Clicks "Generate API Key" button
3. API key is generated and displayed
4. **API key automatically saved to `localStorage`** with key: `"generated_api_key"`

**Example:**

```javascript
localStorage.setItem("generated_api_key", "sk_live_YOUR_API_KEY_HERE");
```

**Security Note:**

- ⚠️ API key is visible in page source when embedded in installation code
- This is acceptable for widget use (client-side only)
- Not for server-side operations

---

### **Step 4: User Customizes Widget**

**Location:** `/dashboard/installation`

1. User navigates to Installation page
2. Customizes widget settings:
   - **Primary Color**: Choose brand color (e.g., `#2db62b`)
   - **Greeting Message**: Custom welcome message
   - **Widget Position**: Bottom-right or bottom-left
3. Clicks **"Save Changes"**

**What Happens:**

- Settings saved to `localStorage`:
  - `widget_primary_color`
  - `widget_greeting`
  - `widget_position`
- Installation code **automatically regenerates**

---

### **Step 5: Installation Code Generated**

**Location:** `/dashboard/installation` (Installation Code section)

The dashboard automatically generates installation code with:

- User's `clientId` (from user data)
- User's `apiKey` (from localStorage)
- User's `botId` (default: "2001")
- Custom `primaryColor`
- Custom `greeting`
- Custom `position`

**Generated Code Example:**

```html
<!-- Cipher & Row Widget Configuration -->
<script>
  window.CipherRowConfig = {
    clientId: "YOUR_CLIENT_ID",
    botId: "2001",
    apiKey: "YOUR_API_KEY_HERE",
    primaryColor: "#2db62b",
    greeting: "Hi! How can we help you today?",
    position: "bottom-right",
  };
</script>

<!-- Widget Container -->
<div id="cr-widget"></div>

<!-- Widget Script -->
<script src="https://cdn.cipherandrow.com/widget.js"></script>
```

**Code Updates Automatically When:**

- User changes color
- User changes greeting
- User changes position
- User generates new API key

---

### **Step 6: User Copies Installation Code**

**Location:** `/dashboard/installation`

1. User clicks **"Copy Code"** button
2. Code copied to clipboard
3. Success message shown

---

### **Step 7: User Installs Widget on Their Website**

**User's Website** (e.g., `customer-website.com`)

1. User opens their website's HTML file
2. Pastes code **before closing `</body>` tag**
3. Saves and publishes website

**Where to Paste:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Website</title>
  </head>
  <body>
    <h1>Welcome to my website</h1>

    <!-- Other content -->

    <!-- PASTE CIPHER & ROW WIDGET CODE HERE -->
    <script>
      window.CipherRowConfig = {
        clientId: "YOUR_CLIENT_ID",
        botId: "2001",
        apiKey: "YOUR_API_KEY_HERE",
        primaryColor: "#2db62b",
        greeting: "Hi! How can we help you?",
        position: "bottom-right",
      };
    </script>
    <div id="cr-widget"></div>
    <script src="https://cdn.cipherandrow.com/widget.js"></script>
    <!-- END WIDGET CODE -->
  </body>
</html>
```

---

### **Step 8: Widget Appears on User's Website**

**What Happens:**

1. `widget.js` loads
2. Widget reads `window.CipherRowConfig`
3. Widget initializes with:
   - User's custom color
   - User's custom greeting
   - User's chosen position
   - Connected to user's account via `clientId`
   - Authenticated via `apiKey`
4. Chat bubble appears on website
5. Visitors can start chatting!

**Widget Features:**
✅ Custom brand color
✅ Custom greeting message
✅ Positioned where user wants
✅ Connected to user's dashboard
✅ All chat data tracked under user's account
✅ Uses user's API key for authentication

---

## 🔄 Updating Widget Settings

**When User Changes Settings:**

1. User goes back to `/dashboard/installation`
2. Changes color/greeting/position
3. Clicks "Save Changes"
4. **New installation code generated automatically**
5. User clicks "Copy Code"
6. User replaces old code on their website with new code
7. Widget reflects new settings immediately

**No Need to:**

- Re-generate API key
- Delete old widget
- Contact support

---

## 🎯 Data Flow Diagram

```
User Signup
    ↓
Payment Completed
    ↓
Generate API Key → Saved to localStorage("generated_api_key")
    ↓
Customize Widget → Saved to localStorage("widget_primary_color", etc.)
    ↓
Installation Code Generated (reads from localStorage)
    ↓
User Copies Code
    ↓
User Pastes on Website
    ↓
Widget Initializes (reads window.CipherRowConfig)
    ↓
Widget Makes API Calls (using apiKey from config)
    ↓
Ceron Engine Validates API Key
    ↓
Chat Messages Delivered ✅
```

---

## 🔐 Security Considerations

### **API Key Visibility**

- ✅ Safe for client-side widget use
- ✅ Rate-limited per API key
- ✅ Can be rotated by user anytime
- ⚠️ Visible in page source (expected for this use case)

### **Best Practices**

1. User should regenerate API key if compromised
2. Dashboard should allow API key rotation
3. Backend should rate-limit per API key
4. Backend should validate clientId matches API key

---

## 📊 localStorage Keys Used

| Key                    | Value                        | Where Set         | Purpose               |
| ---------------------- | ---------------------------- | ----------------- | --------------------- |
| `user`                 | User object                  | Signup/Login      | Store user data       |
| `generated_api_key`    | API key string               | Settings page     | Widget authentication |
| `widget_primary_color` | Hex color                    | Installation page | Widget customization  |
| `widget_greeting`      | String                       | Installation page | Widget customization  |
| `widget_position`      | "bottom-right"/"bottom-left" | Installation page | Widget customization  |

---

## 🎨 Complete Example

**User Journey:**

1. John signs up → Gets clientId: `YOUR_CLIENT_ID`
2. John pays for Pro plan → Subscription active
3. John generates API key → `sk_live_xxxxxxxxxxxxxxxxxxxxx`
4. John customizes:
   - Color: `#FF5733`
   - Greeting: "Welcome to Acme Corp! How can we assist you?"
   - Position: bottom-right
5. John copies installation code
6. John pastes on `acmecorp.com`
7. Widget appears on Acme Corp's website with orange color
8. Visitors chat → All data appears in John's dashboard

**Result:** ✅ Fully functional, branded widget in under 5 minutes!

---

## 🚨 Troubleshooting

### Widget Not Appearing?

- Check if script tag is before `</body>`
- Check browser console for errors
- Verify `clientId` and `apiKey` are correct

### API Key Error?

- Generate new API key in Settings
- Copy new installation code
- Replace old code on website

### Wrong Color/Greeting?

- Update settings in Installation page
- Copy new code
- Replace on website

---

## 📞 Support

For issues or questions:

- Dashboard: Settings → Support
- Email: support@cipherandrow.com
- Docs: https://docs.cipherandrow.com
