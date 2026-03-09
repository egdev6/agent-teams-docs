/**
 * update-contributors.mjs
 *
 * Fetches direct collaborators from the main `agent-teams` repository using the
 * GitHub REST API and updates the <!-- CONTRIBUTORS:START/END --> markers in
 * README.md and README.es.md.
 *
 * Required environment variables:
 *   CONTRIBUTORS_TOKEN  — PAT with `repo` scope on egdev6/agent-teams (needed to
 *                         read the collaborators endpoint of the source repo).
 *                         Falls back to commit contributors if the token is absent
 *                         or lacks the necessary permissions.
 *   GITHUB_TOKEN        — Automatically provided by GitHub Actions; used as a
 *                         secondary fallback for public API calls.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE_OWNER = 'egdev6';
const SOURCE_REPO = 'agent-teams';
const TOKEN = process.env.CONTRIBUTORS_TOKEN || process.env.GITHUB_TOKEN || '';
const README_FILES = ['README.md', 'README.es.md'];
const START_MARKER = '<!-- CONTRIBUTORS:START -->';
const END_MARKER = '<!-- CONTRIBUTORS:END -->';

// ---------------------------------------------------------------------------
// GitHub API helpers
// ---------------------------------------------------------------------------

async function ghFetch(path) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status} ${res.statusText} — ${path}`);
  }
  return res.json();
}

async function getContributors() {
  // Primary: direct collaborators (invited users with write/admin access).
  // Requires a PAT with `repo` scope on the source repository.
  try {
    const data = await ghFetch(
      `/repos/${SOURCE_OWNER}/${SOURCE_REPO}/collaborators?affiliation=direct&per_page=100`,
    );
    const users = data.filter((c) => c.type === 'User');
    console.log(`✓ Fetched ${users.length} direct collaborator(s) from ${SOURCE_OWNER}/${SOURCE_REPO}`);
    return users;
  } catch (err) {
    console.warn(`⚠ Collaborators endpoint unavailable: ${err.message}`);
    console.warn('  → Falling back to commit contributors (public endpoint)');
  }

  // Fallback: commit contributors (public endpoint, no token required).
  const data = await ghFetch(
    `/repos/${SOURCE_OWNER}/${SOURCE_REPO}/contributors?anon=false&per_page=100`,
  );
  const users = data.filter((c) => c.type === 'User');
  console.log(`✓ Fetched ${users.length} commit contributor(s) (fallback)`);
  return users;
}

// ---------------------------------------------------------------------------
// HTML section builder
// ---------------------------------------------------------------------------

const PER_ROW = 7;

function buildCell(user) {
  const { login } = user;
  const avatar = `https://avatars.githubusercontent.com/${login}?s=80&v=4`;
  return (
    `      <td align="center" valign="top" width="120">\n` +
    `        <a href="https://github.com/${login}">\n` +
    `          <img src="${avatar}" width="60" height="60" alt="${login}">\n` +
    `          <br>\n` +
    `          <sub><b>@${login}</b></sub>\n` +
    `        </a>\n` +
    `      </td>`
  );
}

function buildSection(users) {
  const cells = users.map(buildCell);
  const rows = [];

  for (let i = 0; i < cells.length; i += PER_ROW) {
    rows.push(`    <tr>\n${cells.slice(i, i + PER_ROW).join('\n')}\n    </tr>`);
  }

  return `${START_MARKER}\n<table>\n${rows.join('\n')}\n</table>\n${END_MARKER}`;
}

// ---------------------------------------------------------------------------
// README update
// ---------------------------------------------------------------------------

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const markerRegex = new RegExp(
  `${escapeRegex(START_MARKER)}[\\s\\S]*?${escapeRegex(END_MARKER)}`,
);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const users = await getContributors();

if (users.length === 0) {
  console.log('No contributors found — nothing to update.');
  process.exit(0);
}

const newSection = buildSection(users);
let anyUpdated = false;

for (const file of README_FILES) {
  const original = readFileSync(file, 'utf8');
  const updated = original.replace(markerRegex, newSection);

  if (updated !== original) {
    writeFileSync(file, updated, 'utf8');
    console.log(`✓ Updated: ${file}`);
    anyUpdated = true;
  } else {
    console.log(`– Unchanged: ${file}`);
  }
}

console.log(anyUpdated ? '\nDone.' : '\nAlready up to date.');
