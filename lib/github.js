const API = 'https://api.github.com';

async function get(path, token) {
  const res = await fetch(API + path, {
    headers: { Accept: 'application/vnd.github+json', ...(token && { Authorization: `Bearer ${token}` }) },
    cache: 'no-store',
  });
  if (res.status === 404) throw new Error('Repository not found. If it is private, add an access token.');
  if (res.status === 403 || res.status === 429) throw new Error('GitHub is limiting requests. Add an access token and try again.');
  if (!res.ok) throw new Error(`GitHub returned an error (${res.status}).`);
  return res.json();
}

// Pulls the recent history we need. Commit details are fetched only for the newest 30
// so we can see which folders were touched without hammering the API.
export async function loadRepo(repo, userToken) {
  const token = userToken || process.env.GITHUB_TOKEN;
  const fetchRepo = (path) => get(`/repos/${repo}${path}`, token);

  const [pulls, issues, comments, commits] = await Promise.all([
    fetchRepo('/pulls?state=all&per_page=100'),
    fetchRepo('/issues?state=all&per_page=100'),
    fetchRepo('/issues/comments?per_page=100&sort=created&direction=desc'),
    fetchRepo('/commits?per_page=100'),
  ]);
  const details = await Promise.all(commits.slice(0, 30).map((c) => fetchRepo(`/commits/${c.sha}`).catch(() => null)));
  return { pulls, issues, comments, commits, details: details.filter(Boolean) };
}
