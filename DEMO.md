# Two-minute demo script

**Say first (10 seconds):** "When a developer leaves, their knowledge is scattered across commits, pull requests and notes. HandoverGraph turns that into a handover you can check, not just a summary you have to trust."

1. **Landing page.** Click *Try the sample project*.
2. **Overview.** "It found asha-dev's work: 7 commits, 2 PRs, and the folders they touched. These four cards show how many claims it found, how many gaps, and where the review stands."
3. **Claim ledger tab.** Click *Show evidence* on a decision. "Every claim shows the exact words it came from, highlighted. If those words are not in the source, the claim never appears."
4. **Review.** Approve two claims, mark one *Approve, restricted*, reject one. "Nothing goes out unless a person approves it."
5. **Knowledge gaps tab.** "Here is what the system could not answer: an open PR with no reviewer, a folder only this person touched, a doc that contradicts a PR. Each one is a question for the leaver, and they can answer right here."
6. **Overview again.** Type a reviewer name, click *Approve and publish*. Open the **viewer** link, then the **lead** link. "The viewer never receives the restricted claim, the evidence or the questions. The lead sees everything."
7. **Close.** Show *Download Markdown* and the dark mode toggle. "Reviewer, date and version are on every page."

**If asked:**
- *Is it AI?* "Extraction is rule-based right now, on purpose, so the same input always gives the same result. A model-assisted step could be added later, still checked by the same quote verifier."
- *Is the reviewer verified?* "Not yet. The name is typed in and recorded. Real sign-in is in our Round 3 plan."
- *Does it need a backend?* "The server routes are in the same project and deploy together."
