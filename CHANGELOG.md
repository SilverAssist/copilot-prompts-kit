# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-02-03

### Changed

- **`server-actions.instructions.md`** - Major security overhaul based on Next.js 15 data security guide
  - Added Data Access Layer (DAL) architecture with `server-only` marker
  - Added 8 critical security rules (authentication, authorization, input validation)
  - Added closures security section
  - Added troubleshooting section for common errors ("Failed to find Server Action")
  - Added security checklist before deployment

- **`react-components.instructions.md`** - Updated export patterns per Next.js recommendations
  - Components now use `export default` for better tree-shaking
  - Added barrel exports for domain organization
  - Added Server vs Client Components examples
  - Added critical Hook Placement rules (hooks before conditionals)

- **`typescript.instructions.md`** - Added export rules section
  - Components: `export default`
  - Everything else: named exports

- **`component-architecture/SKILL.md`** - Enhanced with DDD and barrel exports
  - Added Server Component and Client Component templates
  - Updated export patterns (default for components, named for rest)
  - Added barrel exports for domains with examples
  - Enhanced domain organization structure with `index.ts` files

- **`domain-driven-design/SKILL.md`** - Added export strategy and DAL
  - Added export strategy table by file type
  - Added Data Access Layer (DAL) structure
  - Added barrel export examples for components, libraries, and actions
  - Updated actions domain structure with barrel exports

---

## [1.2.0] - 2026-02-01

### Changed

- **`AGENTS.md`** - Now installs to project root instead of `.github/` per Vercel recommendations
- **`bin/cli.js`** - Updated install path for AGENTS.md to project root

### Added

- **`AGENTS.md`** - New "Pre-commit Quality Gates" section (MANDATORY)
  - Required checks before push/PR: TypeScript, Linting, Unit Tests, Build
  - Quality checklist for protected branches (`dev`, `staging`, `master`, `main`)
  - Links to testing instructions and patterns

- **`AGENTS.md`** - Enhanced Git Conventions
  - Commit format now requires Jira prefix (e.g., `WEB-123: Add feature`)
  - Critical warning to never commit without Jira ticket prefix

---

## [1.1.1] - 2026-01-30

### Changed

- **`AGENTS.md`** - Refactored following Vercel's AGENTS.md best practices
  - Added retrieval-led reasoning instruction
  - Added compressed documentation index pointing to instruction files
  - Reduced file size by 56% (340 → 153 lines) while maintaining all critical rules
  - Added "When to Read" reference table for instruction files

- **`README.md`** - Improved CLI documentation
  - Clarified `install` vs `update` behavior
  - Added command comparison table
  - Added practical examples for each scenario

### Added

- **`release.prompt.md`** - Release preparation prompt for maintainers (internal use)
  - Pre-release checklist with version consistency validation
  - Package validation steps
  - GitHub Release workflow instructions

---

## [1.1.0] - 2026-01-29

### Added

#### Skills System
- **`component-architecture`** skill - React component patterns, folder structure, naming conventions
- **`domain-driven-design`** skill - DDD principles, domain organization, barrel exports
- **`testing-patterns`** skill - Jest + RTL patterns for Next.js 15 and Server Actions
- Skills README with documentation on creating custom skills

#### New Instructions
- **`css-styling.instructions.md`** - Tailwind CSS v4 & shadcn/ui standards
  - Design tokens (semantic colors)
  - `cn()` utility setup and usage
  - Mobile-first responsive design
  - shadcn/ui component patterns

#### Copilot Agent Support
- **`AGENTS.md`** - Mandatory instructions for GitHub Copilot Coding Agent
  - 4-phase workflow (Analysis → Planning → Implementation → Documentation)
  - Code conventions (imports, types, naming, structure)
  - React patterns (hooks, state, Server Actions)
  - Testing requirements with mock setup order
  - Git commit guidelines and branch naming

- **`copilot-instructions.md`** - Project-wide Copilot instructions template
  - Systematic workflow for complex tasks
  - Key technologies reference
  - DDD principles summary
  - Barrel export pattern

#### CLI Improvements
- `--instructions-only` flag - Only install instructions, AGENTS.md, and copilot-instructions.md
- `--skills-only` flag - Only install skills
- Simplified installation logic with clearer flag handling
- Skills listing in `list` command

### Changed

- **README.md** - Simplified installation to single `npx @latest` command
- **README.md** - Added comprehensive documentation for instructions, skills, and AGENTS.md
- **server-actions.instructions.md** - Updated to use domain-organized structure (DDD-consistent)
- **src/index.js** - Added `INSTRUCTIONS` and `SKILLS` exports

### Fixed

- CLI flag logic now uses clear `shouldInstall*` variables instead of complex conditionals
- Component architecture skill now references css-styling instructions for `cn()` utility (generic approach)
- **Prompt files**: Replaced deprecated `mode: agent` with `agent: agent` in frontmatter (VS Code requirement)
- **Prompt files**: Removed invalid code fence markers from 6 prompt files
- **Prompts README**: Updated documentation with correct frontmatter format and options

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
