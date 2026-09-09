---
name: stack-context
description: "Detect the exact framework and library versions this project has installed (Next.js, React, TypeScript, Tailwind, shadcn/Radix, and the rest of package.json), flag which ones are behind the npm registry, and — when Next.js or React itself is behind — look up what shipped between the installed and latest version so recommendations use current APIs instead of stale or Pages-Router-era patterns pulled from training data. Use before planning or touching code in any dev workflow: analyzing a ticket, writing a plan, reviewing code, or fixing issues."
model: haiku
argument-hint: --refresh
---

<!--
  Note on the `model: haiku` pin above: this skill's own work — reading package.json,
  running `npm view`, diffing semver, skimming a release-notes page for bullet points — is
  mechanical. It runs at the *start* of nearly every dev-flow prompt (see "When to use"),
  so keeping it cheap matters more than for a once-per-PR pass like `core-review`. Escalate
  to the invoking prompt's own model only for judging *relevance* of a new API to the task
  at hand — that reasoning happens in the caller, not in this skill.
  Same portability caveats as `core-review` apply: Copilot ignores unknown skill
  attributes (cosmetic linter warning only), skills have no independent model on Copilot
  (they inherit the invoking prompt's), and Codex has no per-skill `model:` at all.
-->

# Silver Assist — Stack Context

Reads what is **actually installed** in this project — exact `next`/`react` versions, not
"Next.js" as a generic label — before any suggestion, plan, or fix is proposed. Every site in
this org runs Next.js 15/16 and React 19, but a suggestion drafted from general training data
routinely regresses to older patterns (Pages Router idioms, pre-App-Router data fetching,
`getServerSideProps`) or misses a capability that shipped two minor versions ago because
nothing in the conversation ever looked at `package.json`.

This skill closes both directions of that gap:

1. **Don't suggest what's stale.** Ground every recommendation in the exact versions installed.
2. **Don't miss what's new.** When the installed version of a framework package is behind the
   registry, summarize what changed in between — so a real capability (Next 16.3's prefetch
   improvements, a new React hook, a Tailwind v4 utility) surfaces as a proposed improvement
   instead of staying unknown until someone reads the changelog by hand.

It does **not** run `npm install`, `npm update`, or edit `package.json` — it is a read-only
inventory-and-research pass. Upgrading is a separate, explicit decision the caller proposes and
the user approves.

## When to Use

Run this as the **first step** of any flow that is about to reason about or touch code:
`analyze-ticket`, `analyze-github-issue`, `work-ticket`, `work-github-issue`, `create-plan`,
`review-code`, `fix-issues`, `add-tests`, and `prepare-pr`. It is deliberately *not* wired into
the PR-submission prompts (`create-pr`, `create-github-pr`, `finalize-pr`,
`finalize-github-pr`) — by that point the code is already written; re-running inventory there
would only add latency, not change any decision.

Pass `--refresh` to force a re-check even when the cache (below) is still fresh — useful right
after bumping a dependency by hand.

## Cache

The npm-registry lookups and changelog research are the only non-trivial cost in this skill;
everything else is a local file read. Cache the result at the project root in
`.agents-toolkit-stack-context.json` (add it to `.gitignore` if not already ignored — it is
per-machine, per-moment state, not project config):

```json
{
  "checkedAt": "2026-09-09T14:00:00.000Z",
  "packageHash": "sha1 of package.json + lockfile contents",
  "packages": [
    { "name": "next", "installed": "15.5.2", "latest": "16.3.3", "gap": "major" }
  ],
  "whatsNew": {
    "next": { "from": "15.5.2", "to": "16.3.3", "summary": "..." }
  }
}
```

- Reuse the cache when it is **less than 12 hours old** and `packageHash` still matches the
  current `package.json` + lockfile. Otherwise refresh.
- A hash mismatch means a dependency changed since the last check (someone ran `npm install` or
  bumped a version) — always refresh in that case regardless of age.
- On a cache hit, skip straight to rendering the report from cached data — no registry calls,
  no fetch.

## Steps

### 1. Read the installed versions

- Load `package.json` from the project root. In a monorepo (a `workspaces` field is present),
  also check the workspace package that actually depends on `next`/`react` — the framework
  version usually lives in the app package, not the repo root.
- Record exact installed versions (from the lockfile if present — `package-lock.json` /
  `pnpm-lock.yaml` / `yarn.lock` — so a `^15.0.0` range in `package.json` resolves to the real
  installed `15.5.2`, not the range).

### 2. Build the watch list

Always check, when present:

- `next`, `react`, `react-dom` — the framework itself, the reason this skill exists.
- `typescript`, `tailwindcss` (note v3 vs v4 — see the `tailwind-standards` skill; the two have
  different config shapes, so a version bump here changes how suggestions should read).
- Any `@radix-ui/*` package, and shadcn/ui itself: a `components.json` file at the project root
  means shadcn is in use — read its `style` and `registry` fields, they affect which component
  APIs are current.
- Any `@silverassist/*` package (internal shared packages — `leadcapture-form`, `quirobot`,
  and siblings). These move fast and are not on anyone's training-data radar at all, so a gap
  here is the highest-value one to report.
- Anything else the project's own `CLAUDE.md` / `AGENTS.md` names under a "Key Technologies" (or
  equivalent) section — that list is the project's own signal of what matters.

Skip build/lint tooling (`eslint`, `prettier`, `@types/*`, test runners) unless the task at hand
is specifically about one of them — reporting on those on every single invocation is noise.

### 3. Resolve latest versions

For each watched package, resolve the latest published version:

```bash
npm view <package> version
```

Prefer this per-package lookup over a project-wide `npm outdated` — the latter scans every
dependency (slow, and exits non-zero on findings, which is awkward to script around) when only
a handful of packages are ever relevant here. Batch the calls; they're independent.

If the registry is unreachable (offline, VPN, private-registry auth issue), **degrade
gracefully**: report the installed-versions inventory only, note explicitly that the
outdated-check was skipped and why, and continue — never fail the whole calling flow over a
network hiccup for an advisory check.

### 4. Diff and classify

For each package, classify the gap as `none` / `patch` / `minor` / `major` (semver comparison
of installed vs. latest).

### 5. Research what's new — only for `next` and `react`, only on a real gap

When `next` or `react` has a `minor` or `major` gap, look up what shipped between the installed
and latest version:

- **Next.js**: GitHub releases — `https://github.com/vercel/next.js/releases` (or the
  `/vX.Y.Z` blog post at `https://nextjs.org/blog/next-X-Y` for a named minor). Read every
  release between installed and latest, not just the latest — a skipped minor's features are
  just as new to this codebase.
- **React**: `https://github.com/facebook/react/releases` or `https://react.dev/blog`.

From the release notes, keep only **app-facing** additions (a new API, directive, config flag,
or documented performance behavior a Next.js/React app can actually use) and drop
internal/compiler-plumbing changes that don't change what code you'd write. For each kept item,
do a quick `grep` across the project for whether it is already adopted (e.g. searching for
`cacheComponents`, `"use cache"`, a specific hook name) — only surface it as a suggestion if the
project **isn't** already using it.

Do not do this research for every other watched package (Tailwind, Radix, etc.) — report their
version gap in the table, but leave the "what's new" narrative to `next`/`react`, where the
version-confusion problem this skill exists for actually originates. If the task at hand
happens to touch one of those other packages directly, reading its own changelog belongs to
that task, not to this blanket pass.

### 6. Emit the report

## Output

```text
📦 Stack Context — checked 2026-09-09 14:00 (cached)

| Package  | Installed | Latest  | Gap   |
|----------|-----------|---------|-------|
| next     | 15.5.2    | 16.3.3  | major |
| react    | 19.0.0    | 19.1.1  | patch |
| tailwindcss | 4.0.0  | 4.1.2   | patch |

## New since your version (next 15.5.2 → 16.3.3)

- **Prefetch improvements (16.1+)**: [what changed and why it's relevant] —
  not yet adopted (no matching config found). Doc: nextjs.org/blog/next-16-1
- **[Feature]**: ... — already adopted at `path/to/file`.

## Suggested action

- Consider the Next.js 15 → 16 upgrade before this ticket's changes, or note it as
  follow-up work — not blocking, but the gap is major and the prefetch change is directly
  relevant to what this ticket touches.
```

Keep the report to what's actually actionable for the task at hand — this is context for the
rest of the flow to use, not a standalone audit deliverable. When every package is at `none`/
`patch` gap and there's nothing new to report, say so in one line and move on; don't pad the
report to look thorough.

## Cross-Agent Notes

- **Claude Code** — the shipped `model: haiku` keeps this cheap given how often it runs; it has
  `Bash` for `npm view` and `WebFetch` for release notes natively.
- **GitHub Copilot** — runs inline within the invoking prompt; that prompt's `tools:`
  frontmatter must include terminal access (for `npm view`) and a fetch tool (for release
  notes) or this skill can only do step 1 (installed-versions inventory) and must say so.
- **Codex** — same inline-pass shape as `core-review`; no per-skill model control, so cost
  follows the session-wide `codex --model` setting.
