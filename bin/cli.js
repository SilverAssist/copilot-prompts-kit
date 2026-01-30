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
 * Get the target directory for installation
 * @returns {string} Path to .github directory
 */
function getTargetDir() {
  return path.join(process.cwd(), '.github');
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
  const { force = false, promptsOnly = false, partialsOnly = false, dryRun = false } = options;
  
  log('\n📦 Copilot Prompts Kit Installer\n', 'bright');
  
  const targetDir = getTargetDir();
  
  if (dryRun) {
    info('Dry run mode - no files will be copied\n');
  }

  let totalCopied = 0;

  // Install prompts
  if (!partialsOnly) {
    info('Installing prompts...');
    const promptsSrc = path.join(TEMPLATES_DIR, 'prompts');
    const promptsDest = path.join(targetDir, 'prompts');
    const promptsCopied = copyDir(promptsSrc, promptsDest, { force, dryRun });
    totalCopied += promptsCopied.length;
    
    if (!dryRun && promptsCopied.length > 0) {
      success(`Installed ${promptsCopied.length} prompt files`);
    }
  }

  // Install instructions (optional)
  if (!promptsOnly && !partialsOnly) {
    info('Installing instructions...');
    const instructionsSrc = path.join(TEMPLATES_DIR, 'instructions');
    const instructionsDest = path.join(targetDir, 'instructions');
    const instructionsCopied = copyDir(instructionsSrc, instructionsDest, { force, dryRun });
    totalCopied += instructionsCopied.length;
    
    if (!dryRun && instructionsCopied.length > 0) {
      success(`Installed ${instructionsCopied.length} instruction files`);
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
  console.log('  --force, -f       Overwrite existing files');
  console.log('  --prompts-only    Only install prompts (no instructions)');
  console.log('  --partials-only   Only install partials');
  console.log('  --dry-run         Show what would be installed');
  
  console.log('');
  log('Examples:', 'cyan');
  console.log('  npx copilot-prompts install');
  console.log('  npx copilot-prompts install --force');
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
    dryRun: args.includes('--dry-run'),
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
      install(options);
      break;
    case 'update':
      install({ ...options, force: true });
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
