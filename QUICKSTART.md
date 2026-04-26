# 🚀 Quick Start Guide - New Features

## 1️⃣ AI Chat Assistant
**What:** AI-powered responses to customer questions
**Setup:** Add `OPENAI_API_KEY` to server/.env
**Where:** Live chat widget & customer support chats
**Access:** All users via chat interface

## 2️⃣ Analytics Dashboard
**What:** Real-time metrics and team performance
**Setup:** No additional setup needed
**Where:** Admin Dashboard → Analytics tab
**Access:** Admin users only
**Shows:**
- Ticket metrics (open, resolved, resolution rate)
- Chat metrics (active, avg messages)
- Team performance (agent stats)
- Recent activity

## 3️⃣ Subscription Management
**What:** Company-level billing & plan upgrades
**Setup:** Add Stripe credentials to server/.env
**Where:** Admin Dashboard → Subscription tab
**Access:** Admin users only
**Features:**
- View current plan
- Upgrade/downgrade plans
- Manage billing portal
- Feature comparison

## 4️⃣ Team Invitations
**What:** Invite team members with specific roles
**Setup:** Configure SMTP for email (optional - will simulate)
**Where:** Admin Dashboard → Team tab
**Access:** Admin users only
**Steps:**
1. Enter email & select role
2. Email sent with 7-day link
3. Recipient completes signup
4. Auto-joined with that role

---

## 📝 Example Workflows

### Invite a Customer Care Agent
1. Go to Admin Dashboard → Team
2. Click "Invite Member"
3. Enter: `agent@company.com`
4. Select role: `Customer Care Agent`
5. Click "Send Invite"
6. They receive email with link to `/accept-invite?token=xxx`
7. Complete signup and they're added to your company

### Check Analytics
1. Go to Admin Dashboard → Analytics
2. View key metrics (tickets, chats, team)
3. See recent activity streams
4. Check team member performance

### Upgrade Subscription
1. Go to Admin Dashboard → Subscription
2. See current plan
3. Click "Upgrade" on desired plan
4. Complete Stripe checkout
5. Plan immediately upgrades

### Use AI Chat
1. Customer starts chat
2. Agent or system forwards to AI
3. AI responses powered by OpenAI
4. Conversation history maintained

---

## ⚙️ Configuration

### Required for Full Features
```bash
# OpenAI (for AI chat)
OPENAI_API_KEY=sk_test_...

# Stripe (for subscriptions)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...

# Email (for team invites - optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Optional
```bash
# Client-side Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

---

## 🔐 Roles & Permissions

| Feature | Admin | HR Manager | IT Agent | Care Manager | Care Agent | User |
|---------|-------|-----------|----------|--------------|-----------|------|
| Analytics | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Team Mgmt | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Billing | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| AI Chat | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create Tickets | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Chats | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |

---

## 📲 API Endpoints Summary

### Analytics
- `GET /api/analytics/overview` → Key metrics
- `GET /api/analytics/tickets` → Ticket breakdown
- `GET /api/analytics/chats` → Chat metrics
- `GET /api/analytics/team` → Team performance

### AI Chat
- `GET /api/ai/chat/:chatId` → Get history
- `POST /api/ai/chat/:chatId/message` → Send & get response
- `GET /api/ai/suggestions` → Get suggestions

### Team/Invites
- `POST /api/auth/invite` → Send invitation
- `POST /api/auth/accept-invite` → Accept & signup

### Billing
- `POST /api/stripe/company/checkout` → Start upgrade
- `GET /api/stripe/company/portal` → Manage billing
- `GET /api/stripe/company/status` → Check subscription

---

## 🆘 Common Issues & Fixes

**"AI responses not working"**
→ Check `OPENAI_API_KEY` is set and has credits

**"Emails not sending"**
→ SMTP optional; emails will simulate if not configured

**"Can't see analytics"**
→ Make sure you're logged in as Admin
→ Check tickets/chats exist in your company

**"Stripe checkout fails"**
→ Verify `STRIPE_SECRET_KEY` and price IDs are set
→ Check company is properly created

---

## 🎯 What's Next?

1. **Configure .env files** with your API keys
2. **Test AI Chat** by sending a message in any chat
3. **Invite team members** from the Team tab
4. **View Analytics** to see your metrics
5. **Set up billing** to enable plan upgrades

---

**Last Updated:** April 24, 2026
**Status:** All features implemented ✅
