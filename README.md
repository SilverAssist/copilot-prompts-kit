# @silverassist/copilot-prompts-kit

Reusable AI agent prompts for development workflows with Jira integration — supports **GitHub Copilot** and **Claude Code**.

[![npm version](https://img.shields.io/npm/v/@silverassist/copilot-prompts-kit.svg)](https://www.npmjs.com/package/@silverassist/copilot-prompts-kit)
[![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue.svg)](https://github.com/SilverAssist/copilot-prompts-kit/blob/main/LICENSE)

## Features

- ✅ **Complete Workflow Prompts**: From ticket analysis to PR merge
- ✅ **Multi-Agent Support**: Works with GitHub Copilot and Claude Code
- ✅ **Modular Partials**: Reusable prompt fragments
- ✅ **Jira Integration**: Built-in Atlassian MCP support
- ✅ **Customizable**: Easy to extend and modify
- ✅ **CLI Tool**: Quick installation in any project

## Installation

**For GitHub Copilot:**

```bash
npx @silverassist/copilot-prompts-kit@latest install
```

**For Claude Code:**

```bash
npx @silverassist/copilot-prompts-kit@latest install --claude
```

## Setup

### GitHub Copilot

Run the CLI to install prompts into your project:

```bash
npx @silverassist/copilot-prompts-kit@latest install
```

This creates the following structure:

```
AGENTS.md                             # Copilot Coding Agent instructions (project root)
.github/
├── copilot-instructions.md           # Project-wide Copilot instructions
├── prompts/
│   ├── _partials/
│   ├── analyze-ticket.prompt.md
│   ├── create-plan.prompt.md
│   ├── work-ticket.prompt.md
│   └── ...
├── instructions/
│   ├── typescript.instructions.md
│   ├── react-components.instructions.md
│   ├── server-actions.instructions.md
│   ├── tests.instructions.md
│   └── css-styling.instructions.md
└── skills/
    ├── component-architecture/
    ├── domain-driven-design/
    └── testing-patterns/
```

**Running prompts in VS Code:**

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Search for "GitHub Copilot: Run Prompt"
3. Select the desired prompt
4. Fill in variables (e.g., `{ticket-id}`)

### Claude Code

Run the CLI with the `--claude` flag:

```bash
npx @silverassist/copilot-prompts-kit@latest install --claude
```

This creates the following structure:

```
CLAUDE.md                             # Project instructions for Claude Code (project root)
.claude/
└── commands/
    ├── _partials/
    ├── analyze-ticket.md
    ├── create-plan.md
    ├── work-ticket.md
    └── ...
.github/
├── instructions/                     # Shared with Copilot
└── skills/                           # Shared with Copilot
```

**Running commands in Claude Code:**

Type `/` in the chat to see all available slash commands:

```
/analyze-ticket
/work-ticket
/create-pr
```

### Configure Jira (Optional)

Update `.copilot-prompts.json` in your project root (created automatically):

```json
{
  "jira": {
    "projectKey": "WEB",
    "baseUrl": "https://your-org.atlassian.net"
  },
  "git": {
    "defaultBranch": "dev"
  }
}
```

## Available Prompts / Commands

The same set of prompts is available for both tools.

### Workflow

| Prompt / Command | Description | Variables |
|------------------|-------------|-----------|
| `analyze-ticket` | Analyze a Jira ticket | `{ticket-id}` |
| `create-plan` | Create implementation plan | `{feature-description}` |
| `work-ticket` | Start working on a ticket | `{ticket-id}` |
| `prepare-pr` | Prepare code for PR | — |
| `create-pr` | Create a pull request | `{ticket-id}` |
| `finalize-pr` | Finalize and merge PR | `{ticket-id}` |

### Utility

| Prompt / Command | Description | Variables |
|------------------|-------------|-----------|
| `review-code` | Quick code review | — |
| `fix-issues` | Fix lint/type/test errors | — |
| `add-tests` | Add tests for components | `{target-file}` |

### Workflow Stages

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. Analyze     │────▶│  2. Plan        │────▶│  3. Work        │
│  analyze-ticket │     │  create-plan    │     │  work-ticket    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  6. Finalize    │◀────│  5. Create PR   │◀────│  4. Prepare     │
│  finalize-pr    │     │  create-pr      │     │  prepare-pr     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## CLI Reference

### install

Install prompts into your project. **Does not overwrite existing files by default** — safe to run multiple times.

```bash
npx @silverassist/copilot-prompts-kit@latest install [options]
```

| Option | Description |
|--------|-------------|
| `--claude` | Install for Claude Code (`.claude/commands/` + `CLAUDE.md`) |
| `--force`, `-f` | Overwrite existing files |
| `--prompts-only` | Only install prompts / commands |
| `--instructions-only` | Only install instructions and instructions file |
| `--partials-only` | Only install partials |
| `--skills-only` | Only install skills |
| `--dry-run` | Show what would be installed without making changes |

**Examples:**

```bash
# GitHub Copilot — first install
npx @silverassist/copilot-prompts-kit@latest install

# Claude Code — first install
npx @silverassist/copilot-prompts-kit@latest install --claude

# Force overwrite all files
npx @silverassist/copilot-prompts-kit@latest install --force
npx @silverassist/copilot-prompts-kit@latest install --claude --force

# Preview without installing
npx @silverassist/copilot-prompts-kit@latest install --dry-run
npx @silverassist/copilot-prompts-kit@latest install --claude --dry-run
```

### update

Update all prompts to the latest version. **Overwrites existing files** (equivalent to `install --force`).

```bash
npx @silverassist/copilot-prompts-kit@latest update [options]
npx @silverassist/copilot-prompts-kit@latest update --claude
```

> ⚠️ **Warning:** This will replace any customizations you've made to the installed files.

### list

List all available prompts and skills.

```bash
npx @silverassist/copilot-prompts-kit@latest list
```

### Command Comparison

| Scenario | Command |
|----------|---------|
| First time installation (Copilot) | `install` |
| First time installation (Claude) | `install --claude` |
| Add only new files (keep customizations) | `install` |
| Get latest version (discard customizations) | `update` |
| Update specific category only | `update --prompts-only` |
| Preview what would change | `install --dry-run` |

## Partials

Reusable prompt fragments shared between tools:

| Partial | Description |
|---------|-------------|
| `validations.md` | Code quality validation steps |
| `git-operations.md` | Git workflow operations |
| `jira-integration.md` | Jira/Atlassian MCP operations |
| `documentation.md` | Documentation standards |
| `pr-template.md` | Pull request templates |

## Instructions

File-type specific guidelines applied automatically by Copilot (and referenceable in Claude):

| Instruction | Applies To | Description |
|-------------|------------|-------------|
| `typescript.instructions.md` | `*.ts, *.tsx` | TypeScript best practices |
| `react-components.instructions.md` | `*.tsx` | React component patterns |
| `server-actions.instructions.md` | `**/actions/*.ts` | Next.js Server Actions |
| `tests.instructions.md` | `*.test.ts, *.test.tsx` | Testing patterns |
| `css-styling.instructions.md` | `*.css, *.tsx` | Tailwind CSS & shadcn/ui standards |

## Skills

Specialized knowledge guides for domain-specific patterns:

| Skill | Description |
|-------|-------------|
| `component-architecture` | React component patterns, folder structure, naming conventions |
| `domain-driven-design` | DDD principles, domain organization, barrel exports |
| `testing-patterns` | Jest + RTL patterns for Next.js 15 and Server Actions |

**GitHub Copilot** — reference a skill explicitly:

```
@workspace Use the component-architecture skill to create a new payment form
```

**Claude Code** — skills are stored in `.github/skills/` and can be referenced in any prompt or command.

## Agent Instructions Files

### AGENTS.md (Copilot Coding Agent)

Installed at the project root. Contains mandatory instructions for the GitHub Copilot Coding Agent when working on issues autonomously:

- 4-phase workflow: Analysis → Planning → Implementation → Documentation
- Code conventions, React patterns, testing requirements, git guidelines

### CLAUDE.md (Claude Code)

Installed at the project root with `--claude`. Contains project-wide instructions for Claude Code:

- Same 4-phase workflow adapted for Claude Code conventions
- Slash commands reference table
- Code conventions, React patterns, git guidelines

## Requirements

- Node.js 18+
- Git installed and configured
- Atlassian MCP configured (for Jira integration)
- **For GitHub Copilot:** VS Code with GitHub Copilot extension
- **For Claude Code:** Claude Code CLI or VS Code extension

## License

[PolyForm Noncommercial License 1.0.0](https://github.com/SilverAssist/copilot-prompts-kit/blob/main/LICENSE)

## Links

- [GitHub Repository](https://github.com/SilverAssist/copilot-prompts-kit)
- [npm Package](https://www.npmjs.com/package/@silverassist/copilot-prompts-kit)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
