# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-29

### Added

#### Workflow Prompts
- `analyze-ticket.prompt.md` - Analyze Jira tickets without making changes
- `create-plan.prompt.md` - Create detailed implementation plans
- `work-ticket.prompt.md` - Start working on tickets with full setup
- `prepare-pr.prompt.md` - Prepare code for pull request
- `create-pr.prompt.md` - Create and link pull requests
- `finalize-pr.prompt.md` - Finalize PRs after approval

#### Utility Prompts
- `review-code.prompt.md` - Quick code review of changes
- `fix-issues.prompt.md` - Fix lint, type, and test errors
- `add-tests.prompt.md` - Add tests for components

#### Partials (Reusable Fragments)
- `validations.md` - Code quality validation steps
- `git-operations.md` - Git workflow operations
- `jira-integration.md` - Jira/Atlassian MCP operations
- `documentation.md` - Documentation standards
- `pr-template.md` - Pull request templates

#### Instructions
- `typescript.instructions.md` - TypeScript coding standards
- `react-components.instructions.md` - React component patterns
- `server-actions.instructions.md` - Next.js server actions
- `tests.instructions.md` - Testing standards

#### CLI
- `install` command - Install prompts to target project
- `list` command - List available prompts
- `update` command - Update existing prompts
- `--force` flag - Overwrite existing files
- `--prompts-only` flag - Only install prompts
- `--dry-run` flag - Preview installation

#### Configuration
- `.copilot-prompts.json` - Customizable configuration file
