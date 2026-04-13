#!/usr/bin/env node

/**
 * CLI tool for installing and managing GitHub Copilot prompts
 * @module copilot-prompts-kit/cli
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Print colored message to console
 * @param {string} message - Message to print
 * @param {string} color - Color key from COLORS
 */
function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

/**
 * Print success message
 * @param {string} message - Message to print
 */
function success(message) {
  log(`✅ ${message}`, 'green');
}

/**
 * Print warning message
 * @param {string} message - Message to print
 */
function warn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

/**
 * Print error message
 * @param {string} message - Message to print
 */
function error(message) {
  log(`❌ ${message}`, 'red');
}

/**
 * Print info message
 * @param {string} message - Message to print
 */
function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Get the target directory for Copilot installation
 * @returns {string} Path to .github directory
 */
function getTargetDir() {
  return path.join(process.cwd(), '.github');
}

/**
 * Get the target directory for Claude Code installation
 * @returns {string} Path to .claude directory
 */
function getClaudeTargetDir() {
  return path.join(process.cwd(), '.claude');
}

/**
 * Strip GitHub Copilot frontmatter from a prompt file
 * Removes the ---\nagent: ...\ndescription: ...\n--- block
 * @param {string} content - File content
 * @returns {string} Content without Copilot frontmatter
 */
function stripCopilotFrontmatter(content) {
  return content.replace(/^---\n(?:[\s\S]*?\n)?---\n\n?/, '');
}

/**
 * Adapt path references in prompt content for Claude Code
 * @param {string} content - File content
 * @returns {string} Content with updated paths
 */
function adaptPathsForClaude(content) {
  return content
    .replace(/\.github\/copilot-instructions\.md/g, 'CLAUDE.md')
    .replace(/\.github\/prompts\/_partials\//g, '.claude/commands/_partials/')
    .replace(/\.github\/instructions\//g, '.github/instructions/');
}

/**
 * Copy a directory recursively
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 * @param {Object} options - Copy options
 * @param {boolean} options.force - Overwrite existing files
 * @param {boolean} options.dryRun - Only show what would be copied
 * @returns {string[]} List of copied files
 */
function copyDir(src, dest, options = {}) {
  const { force = false, dryRun = false } = options;
  const copied = [];

  if (!fs.existsSync(src)) {
    return copied;
  }

  if (!dryRun && !fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copied.push(...copyDir(srcPath, destPath, options));
    } else {
      const exists = fs.existsSync(destPath);
      
      if (exists && !force) {
        warn(`Skipping existing file: ${path.relative(process.cwd(), destPath)}`);
        continue;
      }

      if (dryRun) {
        info(`Would copy: ${path.relative(process.cwd(), destPath)}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
        copied.push(destPath);
      }
    }
  }

  return copied;
}

/**
 * Install prompts to target directory
 * @param {Object} options - Install options
 */
function install(options = {}) {
  const { force = false, promptsOnly = false, partialsOnly = false, skillsOnly = false, instructionsOnly = false, dryRun = false } = options;
  
  log('\n📦 Copilot Prompts Kit Installer\n', 'bright');
  
  const targetDir = getTargetDir();
  
  if (dryRun) {
    info('Dry run mode - no files will be copied\n');
  }

  let totalCopied = 0;

  // Determine what to install based on flags
  const hasSpecificFlag = promptsOnly || partialsOnly || skillsOnly || instructionsOnly;
  
  const shouldInstallPrompts = !hasSpecificFlag || promptsOnly || partialsOnly;
  const shouldInstallInstructions = !hasSpecificFlag || instructionsOnly;
  const shouldInstallSkills = !hasSpecificFlag || skillsOnly;

  // Install prompts
  if (shouldInstallPrompts) {
    info('Installing prompts...');
    const promptsSrc = path.join(TEMPLATES_DIR, 'prompts');
    const promptsDest = path.join(targetDir, 'prompts');
    const promptsCopied = copyDir(promptsSrc, promptsDest, { force, dryRun });
    totalCopied += promptsCopied.length;
    
    if (!dryRun && promptsCopied.length > 0) {
      success(`Installed ${promptsCopied.length} prompt files`);
    }
  }

  // Install instructions
  if (shouldInstallInstructions) {
    info('Installing instructions...');
    const instructionsSrc = path.join(TEMPLATES_DIR, 'instructions');
    const instructionsDest = path.join(targetDir, 'instructions');
    const instructionsCopied = copyDir(instructionsSrc, instructionsDest, { force, dryRun });
    totalCopied += instructionsCopied.length;
    
    if (!dryRun && instructionsCopied.length > 0) {
      success(`Installed ${instructionsCopied.length} instruction files`);
    }
  }

  // Install skills
  if (shouldInstallSkills) {
    info('Installing skills...');
    const skillsSrc = path.join(TEMPLATES_DIR, 'skills');
    const skillsDest = path.join(targetDir, 'skills');
    const skillsCopied = copyDir(skillsSrc, skillsDest, { force, dryRun });
    totalCopied += skillsCopied.length;
    
    if (!dryRun && skillsCopied.length > 0) {
      success(`Installed ${skillsCopied.length} skill files`);
    }
  }

  // Create config file if it doesn't exist
  const configPath = path.join(process.cwd(), '.copilot-prompts.json');
  if (!fs.existsSync(configPath) && !dryRun) {
    const defaultConfig = {
      jira: {
        projectKey: 'PROJECT',
        baseUrl: 'https://your-org.atlassian.net'
      },
      git: {
        defaultBranch: 'dev',
        branchPrefix: {
          feature: 'feature/',
          bugfix: 'bugfix/',
          hotfix: 'hotfix/'
        }
      },
      pr: {
        targetBranch: 'dev',
        template: 'default'
      }
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    success('Created .copilot-prompts.json config file');
  }

  // Handle copilot-instructions.md (installed with full install or --instructions-only)
  if (shouldInstallInstructions) {
    const copilotInstructionsPath = path.join(targetDir, 'copilot-instructions.md');
    const templatePath = path.join(TEMPLATES_DIR, 'copilot-instructions.md');
    
    if (fs.existsSync(templatePath)) {
      const templateContent = fs.readFileSync(templatePath, 'utf-8');
      
      if (fs.existsSync(copilotInstructionsPath)) {
        // File exists - append key sections if not already present
        if (!dryRun) {
          const existingContent = fs.readFileSync(copilotInstructionsPath, 'utf-8');
          const marker = '## 🔄 Copilot Agent Workflow';
          
          if (!existingContent.includes(marker)) {
            // Remove the first line (# Copilot Instructions) and the description from template
            const sectionsToAppend = templateContent.split('\n').slice(4).join('\n');
            const newContent = existingContent + '\n\n' + '<!-- Added by copilot-prompts-kit -->\n' + sectionsToAppend;
            fs.writeFileSync(copilotInstructionsPath, newContent);
            success('Appended key sections to existing copilot-instructions.md');
            totalCopied++;
          } else {
            info('copilot-instructions.md already contains key sections');
          }
        } else {
          info('Would append key sections to existing copilot-instructions.md');
        }
      } else {
        // File doesn't exist - create it
        if (!dryRun) {
          fs.writeFileSync(copilotInstructionsPath, templateContent);
          success('Created copilot-instructions.md with key sections');
          totalCopied++;
        } else {
          info('Would create copilot-instructions.md');
        }
      }
    }
  }

  // Handle AGENTS.md (installed with full install or --instructions-only)
  // Note: AGENTS.md goes in project root per Vercel recommendations
  if (shouldInstallInstructions) {
    const agentsPath = path.join(process.cwd(), 'AGENTS.md');
    const agentsTemplatePath = path.join(TEMPLATES_DIR, 'AGENTS.md');
    
    if (fs.existsSync(agentsTemplatePath)) {
      const agentsExists = fs.existsSync(agentsPath);
      
      if (agentsExists && !force) {
        info('AGENTS.md already exists in project root (use --force to overwrite)');
      } else {
        if (!dryRun) {
          fs.copyFileSync(agentsTemplatePath, agentsPath);
          success(agentsExists ? 'Updated AGENTS.md in project root' : 'Created AGENTS.md in project root');
          totalCopied++;
        } else {
          info(agentsExists ? 'Would update AGENTS.md in project root' : 'Would create AGENTS.md in project root');
        }
      }
    }
  }

  // Summary
  console.log('');
  if (dryRun) {
    info(`Dry run complete. ${totalCopied} files would be installed.`);
  } else if (totalCopied > 0) {
    success(`Installation complete! ${totalCopied} files installed.`);
    console.log('');
    info('Next steps:');
    console.log('  1. Update .copilot-prompts.json with your Jira project key');
    console.log('  2. Configure Atlassian MCP in VS Code');
    console.log('  3. Run prompts via Command Palette > "GitHub Copilot: Run Prompt"');
  } else {
    warn('No new files installed. Use --force to overwrite existing files.');
  }
  console.log('');
}

/**
 * Install prompts as Claude Code slash commands
 * Strips Copilot frontmatter and adapts path references
 * @param {string} src - Source directory
 * @param {string} dest - Destination directory
 * @param {Object} options - Copy options
 * @returns {string[]} List of written files
 */
function copyDirForClaude(src, dest, options = {}) {
  const { force = false, dryRun = false } = options;
  const written = [];

  if (!fs.existsSync(src)) {
    return written;
  }

  if (!dryRun && !fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);

    if (entry.isDirectory()) {
      const destSubDir = path.join(dest, entry.name);
      written.push(...copyDirForClaude(srcPath, destSubDir, options));
      continue;
    }

    // Convert .prompt.md → .md for Claude commands
    const destName = entry.name.replace(/\.prompt\.md$/, '.md');
    const destPath = path.join(dest, destName);
    const exists = fs.existsSync(destPath);

    if (exists && !force) {
      warn(`Skipping existing file: ${path.relative(process.cwd(), destPath)}`);
      continue;
    }

    const rawContent = fs.readFileSync(srcPath, 'utf-8');
    const adapted = adaptPathsForClaude(stripCopilotFrontmatter(rawContent));

    if (dryRun) {
      info(`Would copy: ${path.relative(process.cwd(), destPath)}`);
    } else {
      fs.writeFileSync(destPath, adapted);
      written.push(destPath);
    }
  }

  return written;
}

/**
 * Install Claude Code files (CLAUDE.md + .claude/commands/)
 * @param {Object} options - Install options
 */
function installClaude(options = {}) {
  const { force = false, promptsOnly = false, instructionsOnly = false, skillsOnly = false, dryRun = false } = options;

  log('\n🤖 Claude Code Installer\n', 'bright');

  const claudeDir = getClaudeTargetDir();
  const githubDir = getTargetDir();

  if (dryRun) {
    info('Dry run mode - no files will be copied\n');
  }

  let totalWritten = 0;

  const hasSpecificFlag = promptsOnly || instructionsOnly || skillsOnly;
  const shouldInstallPrompts = !hasSpecificFlag || promptsOnly;
  const shouldInstallInstructions = !hasSpecificFlag || instructionsOnly;
  const shouldInstallSkills = !hasSpecificFlag || skillsOnly;

  // Install prompts as slash commands in .claude/commands/
  if (shouldInstallPrompts) {
    info('Installing slash commands...');
    const promptsSrc = path.join(TEMPLATES_DIR, 'prompts');
    const commandsDest = path.join(claudeDir, 'commands');
    const written = copyDirForClaude(promptsSrc, commandsDest, { force, dryRun });
    totalWritten += written.length;

    if (!dryRun && written.length > 0) {
      success(`Installed ${written.length} command files to .claude/commands/`);
    }
  }

  // Install instructions to .github/instructions/ (shared with Copilot)
  if (shouldInstallInstructions) {
    info('Installing instructions...');
    const instructionsSrc = path.join(TEMPLATES_DIR, 'instructions');
    const instructionsDest = path.join(githubDir, 'instructions');
    const instructionsCopied = copyDir(instructionsSrc, instructionsDest, { force, dryRun });
    totalWritten += instructionsCopied.length;

    if (!dryRun && instructionsCopied.length > 0) {
      success(`Installed ${instructionsCopied.length} instruction files`);
    }
  }

  // Install skills to .github/skills/ (shared with Copilot)
  if (shouldInstallSkills) {
    info('Installing skills...');
    const skillsSrc = path.join(TEMPLATES_DIR, 'skills');
    const skillsDest = path.join(githubDir, 'skills');
    const skillsCopied = copyDir(skillsSrc, skillsDest, { force, dryRun });
    totalWritten += skillsCopied.length;

    if (!dryRun && skillsCopied.length > 0) {
      success(`Installed ${skillsCopied.length} skill files`);
    }
  }

  // Install CLAUDE.md at project root
  if (shouldInstallInstructions) {
    const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
    const claudeMdTemplate = path.join(TEMPLATES_DIR, 'claude', 'CLAUDE.md');

    if (fs.existsSync(claudeMdTemplate)) {
      if (fs.existsSync(claudeMdPath) && !force) {
        info('CLAUDE.md already exists (use --force to overwrite)');
      } else {
        if (!dryRun) {
          fs.copyFileSync(claudeMdTemplate, claudeMdPath);
          success(fs.existsSync(claudeMdPath) ? 'Updated CLAUDE.md' : 'Created CLAUDE.md');
          totalWritten++;
        } else {
          info(fs.existsSync(claudeMdPath) ? 'Would update CLAUDE.md' : 'Would create CLAUDE.md');
        }
      }
    }
  }

  // Create config file if it doesn't exist (shared)
  const configPath = path.join(process.cwd(), '.copilot-prompts.json');
  if (!fs.existsSync(configPath) && !dryRun) {
    const defaultConfig = {
      jira: {
        projectKey: 'PROJECT',
        baseUrl: 'https://your-org.atlassian.net'
      },
      git: {
        defaultBranch: 'dev',
        branchPrefix: {
          feature: 'feature/',
          bugfix: 'bugfix/',
          hotfix: 'hotfix/'
        }
      },
      pr: {
        targetBranch: 'dev',
        template: 'default'
      }
    };
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
    success('Created .copilot-prompts.json config file');
  }

  // Summary
  console.log('');
  if (dryRun) {
    info(`Dry run complete. ${totalWritten} files would be installed.`);
  } else if (totalWritten > 0) {
    success(`Installation complete! ${totalWritten} files installed.`);
    console.log('');
    info('Next steps:');
    console.log('  1. Update .copilot-prompts.json with your Jira project key');
    console.log('  2. Configure Atlassian MCP in Claude Code settings');
    console.log('  3. Run slash commands with /analyze-ticket, /work-ticket, etc.');
  } else {
    warn('No new files installed. Use --force to overwrite existing files.');
  }
  console.log('');
}

/**
 * List available prompts
 */
function list() {
  log('\n📋 Available Prompts\n', 'bright');

  const promptsDir = path.join(TEMPLATES_DIR, 'prompts');
  
  if (!fs.existsSync(promptsDir)) {
    error('Templates directory not found');
    return;
  }

  const prompts = fs.readdirSync(promptsDir)
    .filter(f => f.endsWith('.prompt.md'))
    .map(f => f.replace('.prompt.md', ''));

  log('Workflow Prompts:', 'cyan');
  const workflowPrompts = ['analyze-ticket', 'create-plan', 'work-ticket', 'prepare-pr', 'create-pr', 'finalize-pr'];
  workflowPrompts.forEach((p, i) => {
    if (prompts.includes(p)) {
      console.log(`  ${i + 1}. ${p}`);
    }
  });

  console.log('');
  log('Utility Prompts:', 'cyan');
  const utilityPrompts = prompts.filter(p => !workflowPrompts.includes(p));
  utilityPrompts.forEach(p => {
    console.log(`  • ${p}`);
  });

  console.log('');
  log('Partials:', 'cyan');
  const partialsDir = path.join(promptsDir, '_partials');
  if (fs.existsSync(partialsDir)) {
    const partials = fs.readdirSync(partialsDir)
      .filter(f => f.endsWith('.md') && f !== 'README.md');
    partials.forEach(p => {
      console.log(`  • ${p.replace('.md', '')}`);
    });
  }

  console.log('');
  log('Skills:', 'cyan');
  const skillsDir = path.join(TEMPLATES_DIR, 'skills');
  if (fs.existsSync(skillsDir)) {
    const skills = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    skills.forEach(s => {
      console.log(`  • ${s}`);
    });
  }
  console.log('');
}

/**
 * Show help message
 */
function showHelp() {
  log('\n📦 Copilot Prompts Kit\n', 'bright');
  console.log('Usage: copilot-prompts <command> [options]\n');
  
  log('Commands:', 'cyan');
  console.log('  install     Install prompts to .github/prompts/');
  console.log('  list        List available prompts');
  console.log('  update      Update existing prompts (alias for install --force)');
  console.log('  help        Show this help message');
  
  console.log('');
  log('Options:', 'cyan');
  console.log('  --force, -f         Overwrite existing files');
  console.log('  --claude            Install for Claude Code (.claude/commands/ + CLAUDE.md)');
  console.log('  --prompts-only      Only install prompts (no instructions/skills)');
  console.log('  --instructions-only Only install instructions');
  console.log('  --partials-only     Only install partials');
  console.log('  --skills-only       Only install skills');
  console.log('  --dry-run           Show what would be installed');

  console.log('');
  log('Examples:', 'cyan');
  console.log('  npx copilot-prompts install              # GitHub Copilot');
  console.log('  npx copilot-prompts install --claude     # Claude Code');
  console.log('  npx copilot-prompts install --force');
  console.log('  npx copilot-prompts install --claude --force');
  console.log('  npx copilot-prompts install --prompts-only');
  console.log('  npx copilot-prompts list');
  console.log('');
}

/**
 * Parse command line arguments
 * @returns {Object} Parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  const options = {
    force: args.includes('--force') || args.includes('-f'),
    promptsOnly: args.includes('--prompts-only'),
    partialsOnly: args.includes('--partials-only'),
    skillsOnly: args.includes('--skills-only'),
    instructionsOnly: args.includes('--instructions-only'),
    dryRun: args.includes('--dry-run'),
    claude: args.includes('--claude'),
  };
  
  return { command, options };
}

/**
 * Main CLI entry point
 */
function main() {
  const { command, options } = parseArgs();

  switch (command) {
    case 'install':
      if (options.claude) {
        installClaude(options);
      } else {
        install(options);
      }
      break;
    case 'update':
      if (options.claude) {
        installClaude({ ...options, force: true });
      } else {
        install({ ...options, force: true });
      }
      break;
    case 'list':
      list();
      break;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;
    default:
      error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

main();
