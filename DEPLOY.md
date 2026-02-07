# Deploy on Vercel

## Step 1: Push to GitHub

1. Create a **new repository** at https://github.com/new (e.g. name: `sql-practice-platform`).
2. In terminal, from the project folder:

```bash
cd /Users/abhivicks/sql/sql-practice-platform
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/sql-practice-platform.git
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub username (and the repo name if you used a different one).

---

## Step 2: Deploy on Vercel

1. Go to **https://vercel.com** and sign in (use **Continue with GitHub**).
2. Click **Add New…** → **Project**.
3. **Import** your `sql-practice-platform` repository (or the repo you created).
4. Leave settings as-is:
   - **Framework Preset:** Next.js
   - **Root Directory:** (leave default)
   - **Build Command:** `pnpm build` or `next build` (auto)
   - **Output Directory:** (auto)
5. Click **Deploy**.

---

## Step 3: Use your live app

When the deploy finishes, Vercel shows a URL like:

**https://sql-practice-platform-xxxx.vercel.app**

Open that link in any browser to use your SQL practice platform. You can share it or use it from your phone.

---

---

## Optional: Gemini “brain” layer (Business + Edge Cases)

The app can generate **Business Impact** and **Edge Cases** with Gemini. The API key is used **only on the server** (never sent to the browser).

1. Get an API key: https://aistudio.google.com/apikey
2. **Locally:** Create `.env.local` in the project root and add:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```
3. **On Vercel:** Project → Settings → Environment Variables → add `GEMINI_API_KEY` with your key.

If `GEMINI_API_KEY` is not set, the “Generate with Gemini” button will show an error; the rest of the app works without it.

---

**Updates:** Push to `main` on GitHub and Vercel will automatically redeploy.
