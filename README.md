# Fernando TechAll — MERN Web App

Full-stack web application for **Fernando Group / Fernando TechAll** built with:

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router + Axios + Socket.IO client + Lottie + Framer Motion
- **Backend:** Node.js + Express + MongoDB (Mongoose) + JWT auth + Socket.IO + Nodemailer
- **Roles:** `admin`, `customer_care_manager`, `customer_care_agent`, `it_support_agent`, `user`
- **Features:**
  - Public marketing site: Home, About, Services, Portfolio (My Work), Featured Work, Client Experience, Contact
  - Auto-rotating hexagon theme (dark blue/black → green/black → white/black → purple/black) with manual override
  - Auth: Register / Login (JWT)
  - User Dashboard: IT Services, Our Products, Contact Info, open IT Support tickets, live chat with Customer Care
  - Admin Dashboard: view contact + chat messages, manage services/products, send emails, assign agents to tickets & chats
  - IT Support Dashboard: view assigned/unassigned tickets, self-assign, update status
  - Customer Care Dashboard: live chat queue, manager assigns agents
  - Real-time chat via Socket.IO

## 1. Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

## 2. Setup
```bash
# Backend
cd server
cp .env.example .env   # edit values
npm install
npm run seed           # creates demo admin + agents + sample data
npm run dev            # http://localhost:5000

# Frontend (new terminal)
cd client
npm install
npm run dev            # http://localhost:5173
```

## 3. Demo Logins (after `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Admin | admin@fernandotechall.com | Admin@123 |
| Customer Care Manager | manager@fernandotechall.com | Manager@123 |
| Customer Care Agent | care@fernandotechall.com | Care@123 |
| IT Support Agent | support@fernandotechall.com | Support@123 |
| User | user@example.com | User@123 |

## 4. Project Structure
```
fernando-techall/
├── server/   Node.js + Express + MongoDB + Socket.IO
└── client/   React + Vite + Tailwind
```

## 5. Test Step-by-Step
1. Start MongoDB.
2. `cd server && npm install && npm run seed && npm run dev`
3. `cd client && npm install && npm run dev`
4. Open `http://localhost:5173`. Watch theme auto-rotate.
5. Browse Home → About → Services → Portfolio → Featured → Client Experience → Contact.
6. Submit the contact form (saved to DB; visible in admin).
7. Register a user → login → User Dashboard → open a ticket → start a chat.
8. Login as admin → assign chat to a Customer Care agent and ticket to IT Support agent.
9. Login as that agent → see assigned items → respond/resolve.

## 6. Contact (hard-coded in app)
- WhatsApp / Telegram: +94 76 186 4769
- Address: 537, Thalahena, Negombo, Sri Lanka
- GitHub: https://github.com/fernandotechall
- LinkedIn: https://linkedin.com/company/fernandotechall

> All code is original and license-free for your business use.

---

## 7. v1.1 — Stripe Pricing + Customizable Email Templates

### Stripe Checkout (BYOK)
1. In `server/.env`, set `STRIPE_SECRET_KEY` (test mode key from https://dashboard.stripe.com/test/apikeys).
2. In Stripe Dashboard → **Products**, create 3 recurring prices (Starter $9/mo, Pro $29/mo, Enterprise $99/mo). Copy each price ID into `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_ENTERPRISE`.
3. (Recommended) Set up the webhook locally:
   ```bash
   stripe listen --forward-to http://localhost:5000/api/stripe/webhook
   # copy the whsec_... into STRIPE_WEBHOOK_SECRET
   ```
   Without a webhook the app still works via the `/api/stripe/confirm/:sessionId` fallback called from the success page.
4. Restart the server. Visit `http://localhost:5173/pricing`, choose a plan, complete checkout (use Stripe test card `4242 4242 4242 4242`).
5. The user's `plan` field is updated and surfaced in the User Dashboard with a badge. Plan gates:
   - **Free:** 1 open ticket
   - **Starter:** 5 open tickets
   - **Pro/Enterprise:** unlimited + critical priority
6. "Manage billing" button opens the Stripe Customer Portal.

> **Plans only affect billing/feature gating — roles (admin, agent, etc.) stay independent.**

### Customizable Email Templates (Handlebars + Nodemailer)
All templates live in `server/src/emails/templates/*.hbs`. Edit freely — they hot-reload on server restart. Each file's first `{{!-- subject: ... --}}` line sets the subject (also templated).

| Template | Triggered by |
|---|---|
| `ticket-created.hbs` | User opens an IT support ticket |
| `ticket-assigned.hbs` | Admin or IT agent self-assigns a ticket |
| `ticket-status.hbs` | Status changes (open/in_progress/resolved/closed) |
| `contact-autoreply.hbs` | Anyone submits the contact form |
| `contact-reply.hbs` | Admin clicks **Reply** on a contact message |
| `checkout-success.hbs` | Stripe checkout completes (any plan) |

Brand colors / logo / footer are defined inline at the top of each `.hbs` (purple→blue gradient, dark card). Variables available in every template: `brand`, `year`, plus the per-template props (e.g. `{{user.name}}`, `{{ticket.subject}}`, `{{contact.message}}`, `{{plan.name}}`, `{{appUrl}}`).

### SMTP
Without `SMTP_HOST` set, every email is logged to the server console as `[mail simulated]`. Configure SMTP in `server/.env` to send for real (e.g. Gmail App Password, Mailgun, SendGrid SMTP).

### Test the new flows
1. `cd server && npm install && npm run dev` (re-installs add `stripe`, `handlebars`).
2. Submit the public contact form → check your inbox / server console for the auto-reply.
3. Login as `admin@fernandotechall.com` → Admin Dashboard → Contact Messages → **Reply** → user receives templated reply.
4. Login as `user@example.com` → open a ticket → receive `ticket-created` email.
5. Login as `support@fernandotechall.com` → self-assign that ticket → user receives `ticket-assigned`.
6. Change status to `resolved` → user receives `ticket-status`.
7. Visit `/pricing`, subscribe to **Pro** with test card `4242 4242 4242 4242` → redirected to `/billing/success` → plan badge updates → `checkout-success` email sent.
