# Matchmaking

Rank early-stage founders against a **written fund thesis**. The score is not a black-box “fit %”: it is four equal metrics — vision, goals, future-proof, and portfolio — each 0–100, then averaged.

This is a local demo (Vite + React). The founder list is **seed data**. It does not pull live LinkedIn or Attio.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

**Rank all** scores everyone immediately using the formula below. No API key is required for that.

Optional: paste a [Gemini API key](https://aistudio.google.com/app/apikey) when you want the model to write the memo summary and outreach line. The **total score is still computed in code** from the four metrics.

Thesis, scores, Slack webhook, and Gemini key are stored in `localStorage` in this browser only.

## What you do in the UI

1. **Thesis** — edit fund vision, goals, future-proof statement, and portfolio (`Name — sector`, one per line), plus industries and regions.
2. **Rank all** (or **Score** on a card) — compute the match.
3. Click a founder — memo on the right shows the four metric rows, what holds, what to check, outreach.
4. **Slack** — optional webhook to post a deal card.

Filters (region, industry, stage, pedigree, search) only cut the seed list; they do not change the formula.

## Match score

```
match = 0.25×vision + 0.25×goals + 0.25×future-proof + 0.25×portfolio
```

| Metric | What it asks | Main inputs |
|---|---|---|
| **Vision** | Does this company belong in the fund’s stated vision? | Founder industry/bio vs thesis vision + target industries |
| **Goals** | Can we do this deal now? | Stage vs mandate, geography, months since they left their last job |
| **Future-proof** | Does the problem get more important over 5–10 years? | Industry/bio vs the future-proof statement (AI, climate, infra, regulation) |
| **Portfolio** | Adjacent to the book, not a clone? | Same sector as a portco = high; name overlap in the bio = ecosystem; no overlap = low |

Green in the memo is a high dimension (≥80). Faint rows are below 55.

Logic lives in `src/services/founderScorer.js` (`MATCH_METRICS`, `computeMatchScore`). Default fund copy (Nordic Alpha Ventures, sample portcos) is `DEFAULT_INVESTOR_PROFILE` in the same file.

## What this is not

- Not live founder discovery (LinkedIn connect was removed).
- Not CRM / Attio sync.
- Not a six-month “we passed, has the reason died?” watcher (that’s a different product idea).
- Not production: do not commit API keys. `.env.local` is gitignored.

## Layout

```
src/
  App.jsx                          # shell + Matchmaking wordmark
  components/brand.jsx             # Encore-style mark
  components/TalentRadar/
    TalentRadar.jsx                # list, filters, rank
    FounderCard.jsx
    FounderDetailPanel.jsx         # memo + metric rows
    InvestorOnboardingModal.jsx    # thesis editor
    SlackModal.jsx
  services/
    founderFetcher.js              # seed founders + filters
    founderScorer.js               # match formula (+ optional Gemini)
    slackService.js
```

## Env (optional)

Copy `.env.example` to `.env.local` if you wire Unipile later. Ranking does not depend on it.

```
VITE_UNIPILE_BASE_URL=https://api38.unipile.com:16809
VITE_UNIPILE_API_KEY=
```

Vite proxies `/unipile` to that host in `vite.config.js` for local CORS.
