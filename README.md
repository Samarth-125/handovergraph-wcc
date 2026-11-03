# HandoverGraph

When a developer leaves, this reads their GitHub activity plus any notes you upload, drafts a handover where every claim links to an exact quote, lists what it could not work out, and only publishes what a reviewer approves.

## Run it

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000
npm test                     # analysis tests
```

Click **Try the sample project** to see the whole flow without GitHub.

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com choose **Add New > Project** and import the repo. No build settings needed.
3. In the project, open **Storage > Marketplace** and add **Upstash Redis**. It fills in `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you. This is what keeps published handovers alive between requests.
4. Optional: add `GITHUB_TOKEN` (read-only, public repo access is enough) under **Settings > Environment Variables** so judges never hit GitHub's anonymous rate limit.
5. Redeploy.

## How it works

| File | Job |
| --- | --- |
| `lib/github.js` | Reads pulls, issues, comments and commits (read-only). |
| `lib/analyze.js` | Builds claims with exact quotes, verifies them, finds gaps. |
| `lib/store.js` | Saves the analysis and the published handover. |
| `app/api/analyze` | Runs the analysis and keeps a server-side snapshot. |
| `app/api/handover` | Publishes approved claims, re-verified against that snapshot. |
| `app/s/[id]` | Role-based share page (lead, successor, viewer). |

Rules we keep: nothing is published without approval, a claim whose quote is not in its source is dropped, and the viewer role never receives restricted claims or evidence.
