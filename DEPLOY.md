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

**Updates:** Push to `main` on GitHub and Vercel will automatically redeploy.
