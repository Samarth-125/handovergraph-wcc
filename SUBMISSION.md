# Round 2 submission: HandoverGraph

Working project link: Not deployed yet — add the live URL before submitting.
Source code: https://github.com/Samarth-125/handovergraph-wcc

## One-line description

When a developer leaves, HandoverGraph turns their scattered GitHub activity and notes into a handover where every claim points to its exact source, gaps are listed as questions, and nothing is shared until a named reviewer approves it.

## Completed features

1. Read-only GitHub ingestion of pull requests, issues, comments and commits for any public repo (private repos with a token), filtered to the chosen person.
2. Upload of .md and .txt notes or documents, read alongside the repo.
3. Contribution summary for the person: commits, PRs opened and merged, issues, comments, main areas and active dates.
4. Claim extraction: decisions, dependencies, blockers, unfinished work and ownership, each with an exact quote from its source.
5. Verifier: a claim whose quote is not found in its stored source is dropped, and approved claims are re-checked on the server when published.
6. Knowledge Gap Detector with eight checks: orphaned work, sole-owner areas, undocumented decisions, dangling references, stale references, possible contradictions, missing documentation, low coverage.
7. Evidence panel: the quote highlighted inside its source, with a link back to GitHub.
8. Human review: approve, approve as restricted, or reject each claim. A reviewer name is required to publish and is recorded on the handover. It is typed in, not a verified sign-in.
9. Closeout answers: each gap is a question the leaver can answer, saved with the handover.
10. Role-based share links for lead, successor and viewer. The viewer's page is built without restricted claims, evidence text or open questions.
11. Approval record on every shared page: reviewer name, date and version (publishing again makes version 2).
12. Markdown download and print or save-as-PDF from the shared page.
13. Light and dark themes with a toggle, remembered between visits.
14. Built-in sample project so the whole flow works even if GitHub is unavailable.
15. Automated tests (8) covering the verifier, the claim types and all eight gap checks.
16. Workspace interface: sidebar, overview, claim ledger with search, knowledge gaps, sources, and a flow tracker.

## Technology and implementation

- Plain JavaScript, React and Next.js (App Router), styled with Tailwind CSS. The server routes are part of the same project and can be deployed together on Vercel.
- GitHub REST API for data. Upstash Redis (through Vercel) keeps analysis snapshots and published handovers for seven days; in memory when run locally.
- Extraction and gap detection are deterministic rules over the fetched data, so the same input always gives the same output. No data is sent to any third-party language-model service.
- Permissions are enforced on the server: the share page only receives the fields its role may see.
- The GitHub token a user types is used for that request only and is never stored.

## Changes from the Round 1 plan

- Round 1 proposed a Postgres graph and an LLM extraction step. This build uses a key-value store and rule-based extraction, so it works without an API key and produces repeatable results.
- The graph is held implicitly (claims, sources and gaps reference each other) and has no graph view yet.
- Share access uses secret role links instead of sign-in.
- Added in this round beyond the plan: a sample project, reviewer name and versioning, theme toggle, and Markdown and print export.

## Three major improvements for Round 3

1. **Real access control.** Sign in with GitHub, roles tied to people rather than secret links, links that expire and can be revoked, and an audit log of who viewed or changed what.
2. **Editable claims with version history.** Reviewers can rewrite a claim and the quote is re-checked on every change; compare version 1 and version 2 of a handover side by side.
3. **Developer Knowledge Graph view and richer sources.** Add PR review threads and changed files, plus Slack and Jira exports, and show people, areas, PRs and decisions as a navigable graph that also feeds new gap checks.
