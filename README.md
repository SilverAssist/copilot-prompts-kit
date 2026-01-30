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
npm install -D @silverassist/copilot-prompts-kit
# or
yarn add -D @silverassist/copilot-prompts-kit
# or
pnpm add -D @silverassist/copilot-prompts-kit
```

Then run the install command:

```bash
npx copilot-prompts install
```

### Via npx (no install)

```bash
npx @silverassist/copilot-prompts-kit install
```

## Setup

### 1. Install Prompts

Run the CLI to install prompts into your project:

```bash
npx copilot-prompts install
```

This will create the following structure in your project:

```
.github/
├── prompts/
│   ├── _partials/
│   ├── analyze-ticket.prompt.md
│   ├── create-plan.prompt.md
│   ├── work-ticket.prompt.md
│   └── ...
└── instructions/
    ├── typescript.instructions.md
    └── ...
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

Install prompts into your project.

```bash
npx copilot-prompts install [options]

Options:
  --force, -f     Overwrite existing files
  --prompts-only  Only install prompts (no instructions)
  --partials-only Only install partials
  --dry-run       Show what would be installed
```

### list

List available prompts.

```bash
npx copilot-prompts list
```

### update

Update prompts to the latest version.

```bash
npx copilot-prompts update
```

## Partials

Reusable prompt fragments that can be referenced in your prompts:

| Partial | Description |
|---------|-------------|
| `validations.md` | Code quality validation steps |
| `git-operations.md` | Git workflow operations |
| `jira-integration.md` | Jira/Atlassian MCP operations |
| `documentation.md` | Documentation standards |
| `pr-template.md` | Pull request templates |

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
