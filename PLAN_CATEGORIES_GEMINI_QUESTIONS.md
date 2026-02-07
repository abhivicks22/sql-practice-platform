# Plan: Categories, Gemini, and Adding Questions Over Time

## Your goals

1. **Upload / organize questions by category** – so each question lives under a clear pattern (Window Functions, Recursive CTEs, etc.).
2. **Use Gemini for Business and Edge Cases** – AI-generated Business Impact and Edge Cases (and optionally Optimization Tips) so content stays rich without manual writing.
3. **Add questions over time** – you’ll keep adding new questions; the system should make that easy.

---

## 1. Questions by category

**Current state:** Questions are in `lib/sql-data.ts` with a `category` field; the header already filters by category.

**Approach:**

- **Single source of truth:** Keep one place that defines all questions (e.g. a JSON file or the existing TS file). Each question has a `category` that must match one of the pattern names (Window Functions, Recursive CTEs, Self Joins, etc.).
- **Categories list:** We can either:
  - **A)** Keep a fixed `categories` list in code (so the header tabs don’t change unless you deploy), or  
  - **B)** Derive categories from the questions (so when you add a new category name in the data, it appears in the UI after you add at least one question).
- **“Upload”:** Can mean:
  - **Now:** You add or edit questions in the JSON/TS file and redeploy (or push to GitHub so Vercel redeploys).
  - **Later:** A simple admin page where you paste JSON or fill a form (title, problem, schema, category, difficulty, etc.) and we append to the list (e.g. save to JSON or a database).

**Recommendation:** Use one **JSON file** (e.g. `data/questions.json`) where each question has `category`. That file is easy to edit, merge, or “upload” (e.g. replace the file or add new entries). Categories can stay as a fixed list for now so the header is stable; when you add a question you pick one of those categories.

---

## 2. Gemini for Business and Edge Cases

**Idea:** Use **Google Gemini** to generate (or enhance) the **Business Impact** and **Edge Cases** (and optionally **Optimization Tips**) for a question.

**Ways to use it:**

- **On demand:** In the app, when viewing a question, the “Intelligence” and “Edge Cases” tabs get a **“Generate with Gemini”** button. Clicking it sends the question (title, problem, schema) to a backend API that calls Gemini and returns:
  - `businessImpact` (paragraph)
  - `optimizationTips` (short list)
  - `edgeCases` (list of short strings)
  The UI shows this and optionally lets the user copy or “apply” it for the session (we don’t have to persist it to the JSON yet).
- **When adding questions:** When you add a new question (form or JSON), an optional “Generate with Gemini” step could pre-fill Business Impact and Edge Cases before you save.

**Tech:**

- **Backend:** A Next.js API route (e.g. `POST /api/gemini`) that:
  - Accepts: `{ title, problem, schema }` (and maybe `category`).
  - Calls Google Gemini API (e.g. `@google/generative-ai`) with a prompt like: “Given this SQL practice question, provide: 1) Business impact (1 short paragraph), 2) Optimization tips (3–5 bullets), 3) Edge cases (4–6 short items).”
  - Returns JSON: `{ businessImpact, optimizationTips, edgeCases }`.
- **API key:** Stored in `GEMINI_API_KEY` (env var). Get a key from [Google AI Studio](https://aistudio.google.com/apikey). On Vercel, set the env var in Project → Settings → Environment Variables.
- **UI:** Buttons in the Intelligence tab and Edge Cases tab that call this API and display (and optionally merge) the result.

**Recommendation:** Implement the API route and the “Generate with Gemini” button in the Intelligence and Edge Cases sections first. No persistence needed initially; you can later add “Save to question” if you store questions in a DB or editable JSON via an admin flow.

---

## 3. Adding questions over time

**Ways to add questions:**

- **Option A – Edit JSON and deploy:** You add new objects to `data/questions.json` (with `category`, `difficulty`, `problem`, `schema`, `solutions`, `starterCode`, etc.), commit, and push. Vercel redeploys and the new questions appear. Categories stay in a fixed list unless we switch to “derive from data.”
- **Option B – Admin UI (later):** A simple “Add question” form (or “Import JSON”) that appends to the list. That would require either writing to a JSON file (tricky on serverless) or using a database (e.g. Vercel Postgres, Supabase). We can add this in a second phase.
- **Option C – Bulk upload:** A page where you upload a CSV or JSON file and we replace or merge into the question set. Same persistence story as Option B.

**Recommendation for now:** Use **Option A**: a single JSON file with a clear `Question` shape. Document the shape (and a minimal example) in the repo so you can copy-paste and add questions quickly. When you’re ready, we can add an admin or upload flow that writes to a database.

---

## Summary

| Goal | Approach |
|------|----------|
| **Questions by category** | One JSON (or TS) source; each question has `category`; filter in UI already works. |
| **Gemini for Business + Edge Cases** | API route that calls Gemini; “Generate with Gemini” in Intelligence and Edge Cases tabs. |
| **Add questions over time** | Add/edit entries in the JSON file and redeploy; later optional admin/upload. |

If you want, next step is implementing: (1) questions loaded from JSON by category, (2) Gemini API route, (3) “Generate with Gemini” in the left panel for Business and Edge Cases.
