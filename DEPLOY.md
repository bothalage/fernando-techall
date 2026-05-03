# Deploy Fernando TechAll — Free Hosting Guide (PayPal Edition)

## Architecture
| Service | Host | Free Tier |
|---------|------|-----------|
| Frontend (React + Vite) | **Vercel** | Unlimited |
| Backend (Node.js + Express) | **Render** | Free (sleeps after 15 min idle) |
| Database (MongoDB) | **MongoDB Atlas** | 512 MB |
| Payments | **PayPal** | Transaction fees apply |
| Code + CI/CD | **GitHub** | Free |

---

## Step 1 — Push Code to GitHub

1. Create a new repo on [github.com](https://github.com) (e.g. `fernando-techall`).
2. In your project root run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fernando-techall.git
git push -u origin main
```

---

## Step 2 — MongoDB Atlas (Database)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → sign up / log in.
2. Create a **free shared cluster** (M0).
3. Create a database user and allow access from **anywhere** (`0.0.0.0/0`) for development.
4. Click **Connect → Drivers → Node.js** and copy the connection string.
5. Add database name: `mongodb+srv://...mongodb.net/fernandotechall?retryWrites=true&w=majority`

---

## Step 3 — PayPal Account (Payments)

1. Go to [developer.paypal.com](https://developer.paypal.com)
2. Log in with your PayPal account (or create one)
3. Go to **Dashboard → My Apps & Credentials**
4. Under **REST API apps**, click **Create App**
5. Name it `Fernando TechAll`
6. You will get:
   - **Client ID** (starts with `A...`)
   - **Secret** (click "Show" to reveal)
7. Toggle **Sandbox/Live** at the top:
   - Start with **Sandbox** for testing
   - Switch to **Live** when ready for real payments

---

## Step 4 — Deploy Backend to Render

1. Go to [render.com](https://render.com) → sign up with GitHub.
2. Click **New → Blueprint** → connect your GitHub repo.
3. Render will read `render.yaml` and create a Web Service automatically.
4. Or create manually: **New → Web Service** → select repo →
   - **Name**: `fernando-techall-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
5. Add **Environment Variables**:

| Key | Value / Source |
|-----|----------------|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET` | Any long random string |
| `CLIENT_ORIGIN` | Your Vercel frontend URL (set after Step 5, then update) |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `PAYPAL_CLIENT_ID` | From PayPal Developer Dashboard |
| `PAYPAL_CLIENT_SECRET` | From PayPal Developer Dashboard |
| `PAYPAL_SANDBOX` | `true` for testing, `false` for live |
| `SMTP_HOST` | (Optional) Your SMTP server |
| `SMTP_USER` | (Optional) SMTP username |
| `SMTP_PASS` | (Optional) SMTP password |

6. Click **Create Web Service**.

---

## Step 5 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → sign up with GitHub.
2. Click **Add New Project** → import your GitHub repo.
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render backend URL (e.g. `https://fernando-techall-api.onrender.com/api`) |

5. Click **Deploy**.

---

## Step 6 — Final Configuration

`https://fernando-techall-git-main-bothalages-projects.vercel.app`
2. Go back to **Render Dashboard** → your service → **Environment** → edit `CLIENT_ORIGIN` to match your Vercel URL.
3. Redeploy the backend.

---

## Step 7 — Auto-Deployment to Vercel (CI/CD)

Your frontend now auto-deploys to Vercel on every push to `main` when files in `client/` change.

### Required GitHub Secrets

Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | How to Get It |
|--------|---------------|
| `VERCEL_TOKEN` | [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create Token |
| `VERCEL_ORG_ID` | Run `npx vercel@latest teams list` or find in `client/.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Run `cd client && npx vercel@latest link` then check `.vercel/project.json` |
| `VITE_API_URL` | Your Render backend URL (e.g. `https://fernando-techall-api.onrender.com/api`) |

### How It Works

1. Push code to `main` branch
2. GitHub Actions detects changes in `client/` or the workflow file
3. Workflow installs Node.js, runs `npm ci`, builds the app
4. Vercel CLI deploys the production build automatically
5. No manual Vercel dashboard clicks needed

### Manual Deploy (optional)

```bash
npm run deploy:vercel
```

Or trigger from GitHub: **Actions → Deploy Frontend to Vercel → Run workflow**

---

## Testing PayPal Payments

1. Make sure `PAYPAL_SANDBOX=true`
2. Create a **Sandbox buyer account** in PayPal Developer Dashboard → **Accounts**
3. Go to your app → Pricing → click Subscribe
4. Log in with the Sandbox buyer account
5. Complete payment → should redirect to success page
6. Check your dashboard → plan should be activated

### Going Live
1. In Render: Change `PAYPAL_SANDBOX` to `false`
2. In PayPal Developer Dashboard: Switch your app to **Live**
3. Update `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` with Live credentials
4. Redeploy

---

## Local Development

Create a `.env` file in `server/`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
CLIENT_ORIGIN=http://localhost:5173
OPENAI_API_KEY=sk-...
PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-sandbox-secret
PAYPAL_SANDBOX=true
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=/api
```

Run:
```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `CORS error` | Make sure `CLIENT_ORIGIN` on Render exactly matches your Vercel URL. |
| `404 on API calls` | Check `VITE_API_URL` includes `/api` suffix. |
| `PayPal payment fails` | Verify you're using Sandbox credentials and `PAYPAL_SANDBOX=true`. |
| `MongoDB connection error` | Whitelist `0.0.0.0/0` in Atlas Network Access. |
| `Payment captured but plan not updated` | Check Render logs for `/payments/capture` errors. |

