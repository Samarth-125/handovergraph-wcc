// Made-up project used by the "Try the sample" button. It has a few deliberate gaps
// so the review screen has something to show. Nothing here is real activity.
const u = (login) => ({ login });
const url = (path) => `https://github.com/demo/shopfront/${path}`;
const commit = (sha, login, message, files, date) => ({
  sha, html_url: url(`commit/${sha}`), author: u(login),
  commit: { message, author: { date } },
  files: files.map((filename) => ({ filename })),
});

const commits = [
  commit('a1b2c3d4e5', 'asha-dev', 'Add webhook retry queue for payments', ['src/payments/queue.js'], '2026-10-20T10:00:00Z'),
  commit('b2c3d4e5f6', 'asha-dev', 'Cache product listing in Redis', ['src/cache/products.js'], '2026-10-18T10:00:00Z'),
  commit('c3d4e5f6a7', 'ravi-k', 'Validate checkout form', ['src/checkout/form.js'], '2026-10-17T10:00:00Z'),
  commit('d4e5f6a7b8', 'asha-dev', 'Move auth to JWT', ['src/auth/token.js'], '2026-10-10T10:00:00Z'),
  commit('e5f6a7b8c9', 'asha-dev', 'Log payment provider errors', ['src/payments/log.js'], '2026-10-08T10:00:00Z'),
  commit('f6a7b8c9d0', 'asha-dev', 'Fix refund rounding', ['src/payments/refund.js'], '2026-10-02T10:00:00Z'),
  commit('a7b8c9d0e1', 'asha-dev', 'Add refresh token endpoint', ['src/auth/refresh.js'], '2026-09-28T10:00:00Z'),
  commit('b8c9d0e1f2', 'asha-dev', 'Add auth middleware', ['src/auth/middleware.js'], '2026-09-20T10:00:00Z'),
];

export const sample = {
  repo: 'demo/shopfront (sample)',
  person: 'asha-dev',
  docs: [{
    name: 'architecture-notes.md',
    text: [
      'We decided to keep server sessions for authentication.',
      'The nightly sync job is tracked in #21 and is still in progress.',
      'Search runs on the hosted index (#10), still in progress.',
      'We chose REST instead of GraphQL for the public API.',
    ].join('\n'),
  }],
  data: {
    commits,
    details: commits,
    pulls: [
      { number: 12, state: 'open', draft: true, user: u('asha-dev'), requested_reviewers: [], html_url: url('pull/12'), head: {},
        title: 'Add Redis cache for product listing',
        body: 'We decided to use Redis instead of in-memory caching because the pods restart often. Still need to add cache invalidation on price updates. Depends on the infra team enabling the Redis instance.' },
      { number: 9, state: 'closed', merged_at: '2026-10-10T12:00:00Z', user: u('asha-dev'), requested_reviewers: [], html_url: url('pull/9'), head: {},
        title: 'Move auth to JWT',
        body: 'Switched to JWT rather than server sessions so the mobile app can reuse tokens. Refresh token rotation is not implemented yet.' },
      { number: 7, state: 'closed', merged_at: '2026-10-17T12:00:00Z', user: u('ravi-k'), requested_reviewers: [], html_url: url('pull/7'), head: {},
        title: 'Validate checkout form', body: 'Adds client side validation.' },
    ],
    issues: [
      { number: 12, state: 'open', comments: 2, user: u('asha-dev'), pull_request: {}, title: 'Add Redis cache for product listing' },
      { number: 9, state: 'closed', comments: 6, user: u('asha-dev'), pull_request: {}, title: 'Move auth to JWT' },
      { number: 7, state: 'closed', comments: 1, user: u('ravi-k'), pull_request: {}, title: 'Validate checkout form' },
      { number: 14, state: 'open', comments: 1, user: u('asha-dev'), assignees: [u('asha-dev')], html_url: url('issues/14'),
        title: 'Payment webhook retries fail silently',
        body: 'Blocked on the payment provider sandbox keys. We should retry with backoff, TODO add alerting.' },
      { number: 10, state: 'closed', comments: 0, user: u('asha-dev'), html_url: url('issues/10'),
        title: 'Move search to a hosted index', body: 'Search is slow on large catalogs.' },
    ],
    comments: [
      { id: 501, issue_url: 'x/issues/9', html_url: url('pull/9#c501'), user: u('asha-dev'), body: 'Going with JWT over sessions for now, we can revisit when the web client gets single sign-on.' },
      { id: 502, issue_url: 'x/issues/9', html_url: url('pull/9#c502'), user: u('ravi-k'), body: 'Fine by me, just keep the token lifetime short.' },
    ],
  },
};
