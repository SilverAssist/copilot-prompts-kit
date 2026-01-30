# @silverassist/copilot-prompts-kit

Reusable GitHub Copilot prompts for development workflows with Jira integration.

[![npm version](https://img.shields.io/npm/v/@silverassist/copilot-prompts-kit.svg)](https://www.npmjs.com/package/@silverassist/copilot-prompts-kit)
[![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue.svg)](https://github.com/SilverAssist/copilot-prompts-kit/blob/main/LICENSE)

## Features

- ✅ **Complete Workflow Prompts**: From ticket analysis to PR merge
- ✅ **Modular Partials**: Reusable prompt fragments
- ✅ **Jira Integration**: Built-in Atlassian MCP support
- ✅ **Customizable**: Easy to extend and modify
- ✅ **CLI Tool**: Quick installation in any project
- ✅ **VS Code Optimized**: Works with GitHub Copilot extension

## Installation

```bash
npx @silverassist/copilot-prompts-kit@latest install
```

That's it! This will download and run the latest version automatically.

## Setup

### 1. Install Prompts

Run the CLI to install prompts into your project:

```bash
npx @silverassist/copilot-prompts-kit@latest install
```

This will create the following structure in your project:

```
.github/
├── AGENTS.md                     # Copilot Coding Agent instructions
├── copilot-instructions.md       # Project-wide Copilot instructions
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
│   ├── css-styling.instructions.md
│   └── ...
└── skills/
    ├── component-architecture/
    ├── domain-driven-design/
    └── testing-patterns/
```

### 2. Configure Jira (Optional)

Create `.copilot-prompts.json` in your project root:

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

## Usage

### Running Prompts in VS Code

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Search for "GitHub Copilot: Run Prompt"
3. Select the desired prompt
4. Fill in variables (e.g., `{ticket-id}`)

### Available Prompts

#### Workflow Prompts

| Prompt | Description | Variables |
|--------|-------------|-----------|
| `analyze-ticket` | Analyze a Jira ticket | `{ticket-id}` |
| `create-plan` | Create implementation plan | `{feature-description}` |
| `work-ticket` | Start working on a ticket | `{ticket-id}` |
| `prepare-pr` | Prepare code for PR | - |
| `create-pr` | Create a pull request | `{ticket-id}` |
| `finalize-pr` | Finalize and merge PR | `{ticket-id}` |

#### Utility Prompts

| Prompt | Description | Variables |
|--------|-------------|-----------|
| `review-code` | Quick code review | - |
| `fix-issues` | Fix lint/type/test errors | - |
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
| `--force`, `-f` | Overwrite existing files |
| `--prompts-only` | Only install prompts (no instructions/skills) |
| `--instructions-only` | Only install instructions |
| `--partials-only` | Only install partials |
| `--skills-only` | Only install skills |
| `--dry-run` | Show what would be installed without making changes |

**Examples:**

```bash
# First installation (creates all files)
npx @silverassist/copilot-prompts-kit@latest install

# Re-run safely (skips existing files)
npx @silverassist/copilot-prompts-kit@latest install

# Force overwrite all files
npx @silverassist/copilot-prompts-kit@latest install --force

# Preview changes without installing
npx @silverassist/copilot-prompts-kit@latest install --dry-run
```

### update

Update all prompts to the latest version. **Overwrites existing files** (equivalent to `install --force`).

```bash
npx @silverassist/copilot-prompts-kit@latest update [options]
```

> ⚠️ **Warning:** This will replace any customizations you've made to the installed files.

**Options:** Same as `install` (e.g., `--prompts-only`, `--instructions-only`)

### list

List available prompts.

```bash
npx @silverassist/copilot-prompts-kit@latest list
```

### Command Comparison

| Scenario | Command |
|----------|---------|
| First time installation | `install` |
| Add only new files (keep customizations) | `install` |
| Get latest version (discard customizations) | `update` |
| Update specific category only | `update --prompts-only` |
| Preview what would change | `install --dry-run` |

## Partials

Reusable prompt fragments that can be referenced in your prompts:

| Partial | Description |
|---------|-------------|
| `validations.md` | Code quality validation steps |
| `git-operations.md` | Git workflow operations |
| `jira-integration.md` | Jira/Atlassian MCP operations |
| `documentation.md` | Documentation standards |
| `pr-template.md` | Pull request templates |

## Instructions

Instructions are automatic guidelines applied to specific file types:

| Instruction | Applies To | Description |
|-------------|------------|-------------|
| `typescript.instructions.md` | `*.ts, *.tsx` | TypeScript best practices |
| `react-components.instructions.md` | `*.tsx` | React component patterns |
| `server-actions.instructions.md` | `**/actions/*.ts` | Next.js Server Actions |
| `tests.instructions.md` | `*.test.ts, *.test.tsx` | Testing patterns |
| `css-styling.instructions.md` | `*.css, *.tsx` | Tailwind CSS & shadcn/ui standards |

### Copilot Instructions File

The installer also creates/updates `.github/copilot-instructions.md` with key sections:

- **🔄 Copilot Agent Workflow** - Systematic approach for complex tasks
- **Key Technologies** - Project tech stack reference
- **DDD Principles** - Domain-driven design guidelines
- **Barrel Export Pattern** - Clean import organization

If the file already exists, sections are appended at the end (if not present).

### AGENTS.md File

The installer creates `.github/AGENTS.md` with mandatory instructions for the GitHub Copilot Coding Agent:

- **Workflow Phases** - Analysis, Planning, Implementation, Documentation
- **Code Conventions** - Style, naming, structure rules
- **React Patterns** - Hooks, state management, Server Actions
- **Testing Requirements** - Coverage, mocking, file organization
- **Git Guidelines** - Commit messages, branch naming

This file is used when Copilot Coding Agent works on issues autonomously.

## Skills

Skills are specialized knowledge guides that Copilot uses for domain-specific patterns:

| Skill | Description |
|-------|-------------|
| `component-architecture` | React component patterns, folder structure, naming conventions |
| `domain-driven-design` | DDD principles, domain organization, barrel exports |
| `testing-patterns` | Jest + RTL patterns for Next.js 15 and Server Actions |

Skills are automatically referenced by Copilot when relevant. You can also explicitly reference them:

```
@workspace Use the component-architecture skill to create a new payment form
```

## Requirements

- VS Code with GitHub Copilot extension
- Atlassian MCP configured (for Jira integration)
- Git installed and configured
- Node.js 18+

## License

[PolyForm Noncommercial License 1.0.0](https://github.com/SilverAssist/copilot-prompts-kit/blob/main/LICENSE)

## Links

- [GitHub Repository](https://github.com/SilverAssist/copilot-prompts-kit)
- [npm Package](https://www.npmjs.com/package/@silverassist/copilot-prompts-kit)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
