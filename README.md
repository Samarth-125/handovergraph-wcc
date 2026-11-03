# HandoverGraph

When a developer leaves, this reads their GitHub activity plus any notes you upload, drafts a handover where every claim links to an exact quote, lists what it could not work out, and only publishes what a reviewer approves.

## Run it

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev                  # http://localhost:3000
npm test                     # analysis tests
```

Click **Try the sample project** to see the whole flow without GitHub. Works offline.

## Do I need a separate backend?

No. The server code lives inside this project (`app/api/`), and Vercel runs it for you. One repository, one deploy, one link.

## Deploy on Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com choose **Add New > Project** and import the repo. No build settings needed.
3. In the project open **Storage > Marketplace** and add **Upstash Redis**. It fills in `KV_REST_API_URL` and `KV_REST_API_TOKEN`. This keeps published handovers alive between requests.
4. Optional: add `GITHUB_TOKEN` (read-only, public access is enough) under **Settings > Environment Variables** so visitors never hit GitHub's anonymous rate limit.
5. Redeploy, then open the link and click through the sample once before you submit it.

## What is in it

| File | Job |
| --- | --- |
| `lib/github.js` | Reads pulls, issues, comments and commits (read-only). |
| `lib/analyze.js` | Builds claims with exact quotes, verifies them, finds gaps. |
| `lib/store.js` | Saves the analysis and the published handover. |
| `app/api/analyze` | Runs the analysis and keeps a server-side snapshot. |
| `app/api/handover` | Publishes approved claims, re-verified against that snapshot, with reviewer and version. |
| `app/s/[id]` | Role-based share page (lead, successor, viewer). |
| `components/` | Small pieces: claim card, evidence, gap list, stepper, theme toggle, export buttons. |

## Rules the code keeps

- Nothing is published until a reviewer approves it and enters their name.
- A claim whose quote cannot be found in its source is dropped, and approved claims are re-checked on the server when you publish.
- The viewer role never receives restricted claims, evidence text, or the open questions. They are removed on the server before the page is built.
- A token typed into the form is used for that one request and never stored.

## Known limits

- The reviewer name is typed in, so approval is recorded but not tied to a verified account. Real sign-in is planned.
- Share links are secret links, not logins. Anyone holding a link has that role. Real sign-in is planned.
- Extraction uses fixed rules (keywords and GitHub's own state), so it can miss decisions phrased in unusual ways. Every claim is shown as Inferred or Confirmed for that reason.
- It reads recent history only (the latest 100 items of each kind, and file details for the latest 30 commits).
- The quote check proves the words exist in the source. It does not prove they are true, which is why a person approves.

## Project links

- Source code: https://github.com/Samarth-125/handovergraph-wcc
- Working demo: Not deployed yet.
