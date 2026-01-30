# @oasis/copilot-prompts-kit

Reusable GitHub Copilot prompts for development workflows with Jira integration.

## Features

- 🚀 **Complete Workflow Prompts**: From ticket analysis to PR merge
- 🔧 **Modular Partials**: Reusable prompt fragments
- 📋 **Jira Integration**: Built-in Atlassian MCP support
- 🎯 **Customizable**: Easy to extend and modify
- ⚡ **CLI Tool**: Quick installation in any project

## Installation

### Via npm (recommended)

```bash
npm install -D @oasis/copilot-prompts-kit
npx copilot-prompts install
```

### Via npx (no install)

```bash
npx @oasis/copilot-prompts-kit install
```

### Manual Installation

Copy the contents of `templates/` to your project's `.github/` directory.

## Usage

After installation, you'll have prompts available in `.github/prompts/`.

### In VS Code

1. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. Search for "GitHub Copilot: Run Prompt"
3. Select the desired prompt
4. Fill in variables (e.g., `{ticket-id}`)

### Available Prompts

#### Workflow Prompts (Main Flow)

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

## CLI Commands

### Install prompts

```bash
npx copilot-prompts install [options]

Options:
  --force, -f     Overwrite existing files
  --prompts-only  Only install prompts (no instructions)
  --partials-only Only install partials
  --dry-run       Show what would be installed
```

### List available prompts

```bash
npx copilot-prompts list
```

### Update prompts

```bash
npx copilot-prompts update
```

## Customization

### Adding Custom Prompts

Create new `.prompt.md` files in `.github/prompts/`:

```markdown
\`\`\`prompt
---
mode: agent
description: Your prompt description
---

Your prompt content here...
\`\`\`
```

### Using Partials

Reference shared fragments in your prompts:

```markdown
## Prerequisites
- Reference: `.github/prompts/_partials/validations.md`
```

### Available Partials

| Partial | Description |
|---------|-------------|
| `validations.md` | Code quality validation steps |
| `git-operations.md` | Git workflow operations |
| `jira-integration.md` | Jira/Atlassian MCP operations |
| `documentation.md` | Documentation standards |
| `pr-template.md` | Pull request templates |

## Configuration

Create `.copilot-prompts.json` in your project root for customization:

```json
{
  "jira": {
    "projectKey": "WEB",
    "baseUrl": "https://your-org.atlassian.net"
  },
  "git": {
    "defaultBranch": "dev",
    "branchPrefix": {
      "feature": "feature/",
      "bugfix": "bugfix/",
      "hotfix": "hotfix/"
    }
  },
  "pr": {
    "targetBranch": "dev",
    "template": "default"
  }
}
```

## Requirements

- VS Code with GitHub Copilot extension
- Atlassian MCP configured (for Jira integration)
- Git installed and configured
- Node.js 18+

## Project Structure

```
.github/
├── prompts/
│   ├── _partials/           # Shared fragments
│   │   ├── validations.md
│   │   ├── git-operations.md
│   │   ├── jira-integration.md
│   │   ├── documentation.md
│   │   └── pr-template.md
│   │
│   ├── analyze-ticket.prompt.md
│   ├── create-plan.prompt.md
│   ├── work-ticket.prompt.md
│   ├── prepare-pr.prompt.md
│   ├── create-pr.prompt.md
│   ├── finalize-pr.prompt.md
│   ├── review-code.prompt.md
│   ├── fix-issues.prompt.md
│   └── add-tests.prompt.md
│
└── instructions/            # Optional coding instructions
    ├── typescript.instructions.md
    ├── react-components.instructions.md
    └── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT © Oasis Senior Advisors
