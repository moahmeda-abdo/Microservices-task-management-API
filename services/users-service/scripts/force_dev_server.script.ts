#!/usr/bin/env node

/**
 * 🔥 Force Development Server
 * Kills any existing server on the port and starts fresh
 * Enhanced with detailed diagnostics and health checks
 */

import { spawn, exec, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// ============================================
// 🎨 Types & Constants
// ============================================

type LogType = 'title' | 'success' | 'error' | 'warning' | 'info' | 'step' | 'debug';

interface ExecResult {
  error: Error;
  stderr: string;
}

interface Colors {
  reset: string;
  bright: string;
  dim: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  gray: string;
}

interface Icons {
  start: string;
  stop: string;
  check: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  rocket: string;
  fire: string;
  search: string;
  kill: string;
  server: string;
  time: string;
  port: string;
  config: string;
}

interface ProcessInfo {
  pid: string;
  name: string;
  command: string;
  startTime: string;
}

interface SystemInfo {
  nodeVersion: string;
  platform: string;
  arch: string;
  memory: string;
  uptime: string;
}

const colors: Colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

const icons: Icons = {
  start: '🚀',
  stop: '🛑',
  check: '🔍',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
  rocket: '⚡',
  fire: '🔥',
  search: '🔎',
  kill: '💀',
  server: '🖥️',
  time: '⏱️',
  port: '🔌',
  config: '⚙️',
};

const STARTUP_DELAY_MS = 1500;
const KILL_GRACE_PERIOD_MS = 500;
const DEFAULT_PORT = 4000;

// ============================================
// 🎨 Logging Functions
// ============================================

/**
 * Logs a formatted message with timestamp and icon
 */
function log(message: string, type: LogType = 'info'): void {
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const typeStyles: Record<LogType, string> = {
    title: `${colors.bright}${colors.cyan}`,
    success: `${colors.green}`,
    error: `${colors.red}`,
    warning: `${colors.yellow}`,
    info: `${colors.blue}`,
    step: `${colors.magenta}`,
    debug: `${colors.gray}`,
  };

  const iconMap: Record<LogType, string> = {
    title: icons.rocket,
    success: icons.success,
    error: icons.error,
    warning: icons.warning,
    info: icons.info,
    step: icons.check,
    debug: icons.search,
  };

  const icon = iconMap[type] || icons.info;
  const color = typeStyles[type] || colors.white;

  console.log(`${colors.dim}[${timestamp}]${colors.reset} ${color}${icon} ${message}${colors.reset}`);
}

/**
 * Displays the startup banner with system info
 */
function logBanner(): void {
  console.log('');
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  ${icons.fire} FORCE DEVELOPMENT SERVER${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  ${icons.rocket} Smart Port Management & Health Checks${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
  console.log('');
}

/**
 * Logs a section divider
 */
function logDivider(char: string = '─', length: number = 70): void {
  console.log(`${colors.dim}${char.repeat(length)}${colors.reset}`);
}

/**
 * Logs detailed process information in a formatted table
 */
function logProcessInfo(processInfo: ProcessInfo): void {
  console.log(`${colors.dim}  ┌─ Process Details ${'-'.repeat(48)}${colors.reset}`);
  console.log(`${colors.dim}  │ ${colors.reset}PID:     ${colors.yellow}${processInfo.pid}${colors.reset}`);
  console.log(`${colors.dim}  │ ${colors.reset}Name:    ${colors.cyan}${processInfo.name}${colors.reset}`);
  console.log(`${colors.dim}  │ ${colors.reset}Command: ${colors.white}${processInfo.command}${colors.reset}`);
  console.log(`${colors.dim}  │ ${colors.reset}Started: ${colors.green}${processInfo.startTime}${colors.reset}`);
  console.log(`${colors.dim}  └${'─'.repeat(68)}${colors.reset}`);
}

/**
 * Logs system information
 */
function logSystemInfo(sysInfo: SystemInfo): void {
  console.log(`${colors.dim}  System Info:${colors.reset}`);
  console.log(`${colors.dim}  • ${colors.reset}Node: ${colors.green}${sysInfo.nodeVersion}${colors.reset}`);
  console.log(`${colors.dim}  • ${colors.reset}Platform: ${colors.cyan}${sysInfo.platform} (${sysInfo.arch})${colors.reset}`);
  console.log(`${colors.dim}  • ${colors.reset}Memory: ${colors.yellow}${sysInfo.memory}${colors.reset}`);
  console.log(`${colors.dim}  • ${colors.reset}Uptime: ${colors.magenta}${sysInfo.uptime}${colors.reset}`);
}

// ============================================
// 🔧 Utility Functions
// ============================================

/**
 * Gets the port number from environment or defaults to 4000
 */
function getPort(): number {
  const port = process.env.PORT || String(DEFAULT_PORT);
  const parsedPort = parseInt(port, 10);
  
  if (isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    log(`Invalid port "${port}", using default ${DEFAULT_PORT}`, 'warning');
    return DEFAULT_PORT;
  }
  
  return parsedPort;
}

/**
 * Executes a shell command asynchronously
 */
function execAsync(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr } as ExecResult);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

/**
 * Gets detailed information about a process
 */
async function getProcessInfo(pid: string): Promise<ProcessInfo> {
  try {
    const name = await execAsync(`ps -p ${pid} -o comm=`).catch(() => 'Unknown');
    const command = await execAsync(`ps -p ${pid} -o args=`).catch(() => 'Unknown');
    const startTime = await execAsync(`ps -p ${pid} -o lstart=`).catch(() => 'Unknown');
    
    return {
      pid,
      name: name.trim(),
      command: command.trim().substring(0, 50) + (command.length > 50 ? '...' : ''),
      startTime: startTime.trim(),
    };
  } catch {
    return {
      pid,
      name: 'Unknown',
      command: 'Unknown',
      startTime: 'Unknown',
    };
  }
}

/**
 * Gets system information
 */
function getSystemInfo(): SystemInfo {
  const memUsage = process.memoryUsage();
  const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const memTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  
  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: `${memUsedMB}MB / ${memTotalMB}MB`,
    uptime: `${hours}h ${minutes}m ${seconds}s`,
  };
}

/**
 * Finds all process IDs running on the specified port
 */
function findProcessOnPort(port: number): Promise<string[]> {
  return new Promise((resolve) => {
    // Try lsof first (most reliable on macOS/Linux)
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (!error && stdout) {
        const pids = stdout.trim().split('\n').filter(Boolean);
        return resolve(pids);
      }

      // Fallback to ss (Linux)
      exec(`ss -lptn 'sport = :${port}' | grep LISTEN | awk '{print $6}' | grep -oP 'pid=\\K[0-9]+'`, (error, stdout) => {
        if (!error && stdout) {
          const pids = stdout.trim().split('\n').filter(Boolean);
          return resolve(pids);
        }
        
        // Last resort: fuser (Linux)
        exec(`fuser ${port}/tcp 2>/dev/null`, (error, stdout) => {
          if (!error && stdout) {
            const pid = stdout.trim().match(/\d+/)?.[0];
            return resolve(pid ? [pid] : []);
          }
          resolve([]);
        });
      });
    });
  });
}

/**
 * Checks if a port is actually free
 */
async function verifyPortIsFree(port: number): Promise<boolean> {
  try {
    const pids = await findProcessOnPort(port);
    return pids.length === 0;
  } catch {
    return true; // Assume free if check fails
  }
}

/**
 * Validates that required scripts exist in package.json
 */
function validatePackageScripts(): boolean {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    log('package.json not found in current directory!', 'error');
    return false;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    if (!packageJson.scripts?.dev) {
      log('No "dev" script found in package.json!', 'error');
      log('Please add: "dev": "your-dev-command"', 'warning');
      return false;
    }
    
    log(`Found dev script: ${colors.dim}${packageJson.scripts.dev}${colors.reset}`, 'debug');
    return true;
  } catch (error) {
    log('Failed to parse package.json', 'error');
    return false;
  }
}

// ============================================
// 🎯 Main Functions
// ============================================

/**
 * Kills all processes running on the specified port
 */
async function killProcessOnPort(port: number): Promise<boolean> {
  log(`${icons.search} Scanning port ${port} for active processes...`, 'step');

  try {
    const pids = await findProcessOnPort(port);

    if (pids.length === 0) {
      log('Port is clear - no processes found!', 'success');
      return true;
    }

    log(`Found ${pids.length} process${pids.length > 1 ? 'es' : ''} on port ${port}`, 'warning');
    console.log('');

    for (let i = 0; i < pids.length; i++) {
      const pid = pids[i];
      
      try {
        // Get detailed process info
        const processInfo = await getProcessInfo(pid);
        
        log(`${icons.kill} Terminating process ${i + 1}/${pids.length}...`, 'warning');
        logProcessInfo(processInfo);

        // Graceful kill first (SIGTERM)
        await execAsync(`kill ${pid}`);
        log('Sent SIGTERM (graceful shutdown)', 'debug');

        // Wait for graceful shutdown
        await new Promise(resolve => setTimeout(resolve, KILL_GRACE_PERIOD_MS));

        // Check if still running
        try {
          await execAsync(`ps -p ${pid}`);
          log(`Process ${pid} didn't respond to SIGTERM, sending SIGKILL...`, 'warning');
          await execAsync(`kill -9 ${pid}`);
          log('Sent SIGKILL (force kill)', 'debug');
        } catch {
          log(`Process ${pid} terminated gracefully`, 'debug');
        }

        log(`${icons.success} Successfully terminated process ${pid}`, 'success');
        console.log('');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log(`Failed to kill process ${pid}: ${errorMessage}`, 'error');
      }
    }

    // Verify port is actually free
    const isFree = await verifyPortIsFree(port);
    if (isFree) {
      log(`${icons.success} Port ${port} successfully freed!`, 'success');
      return true;
    } else {
      log(`${icons.warning} Port ${port} may still be in use`, 'warning');
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Error during port cleanup: ${errorMessage}`, 'error');
    return false;
  }
}

/**
 * Starts the development server
 */
function startDevServer(port: number): ChildProcess {
  log(`${icons.server} Starting development server on port ${port}...`, 'step');
  console.log('');
  logDivider('═');
  console.log('');

  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const devProcess = spawn(npmCmd, ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: String(port) },
  });

  let startTime = Date.now();

  devProcess.on('spawn', () => {
    const elapsed = Date.now() - startTime;
    log(`${icons.rocket} Server spawned in ${elapsed}ms`, 'debug');
  });

  devProcess.on('error', (error: Error) => {
    log(`${icons.error} Failed to start dev server: ${error.message}`, 'error');
    log('Possible issues:', 'warning');
    log('  • Missing dependencies (try: npm install)', 'warning');
    log('  • Invalid dev script in package.json', 'warning');
    log('  • Port permission denied', 'warning');
    process.exit(1);
  });

  devProcess.on('exit', (code: number | null, signal: string | null) => {
    if (code !== null && code !== 0) {
      log(`${icons.error} Dev server exited with code ${code}`, 'error');
      if (signal) {
        log(`Signal: ${signal}`, 'debug');
      }
      process.exit(code);
    } else if (signal) {
      log(`${icons.info} Dev server stopped by signal: ${signal}`, 'info');
    }
  });

  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log('');
    log('Received SIGINT (Ctrl+C), shutting down gracefully...', 'warning');
    devProcess.kill('SIGINT');
    setTimeout(() => {
      log('Shutdown complete', 'info');
      process.exit(0);
    }, 1000);
  });

  // Handle SIGTERM
  process.on('SIGTERM', () => {
    log('Received SIGTERM, shutting down...', 'warning');
    devProcess.kill('SIGTERM');
    setTimeout(() => process.exit(0), 1000);
  });

  return devProcess;
}

/**
 * Checks and logs environment configuration
 */
function checkEnvironment(): void {
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    log(`${icons.config} Environment file: ${envPath}`, 'info');
    
    // Check for common required variables
    const requiredVars = ['PORT', 'NODE_ENV'];
    const missingVars = requiredVars.filter(v => !process.env[v]);
    
    if (missingVars.length > 0) {
      log(`Missing environment variables: ${missingVars.join(', ')}`, 'warning');
    }
  } else {
    log(`${icons.warning} No .env file found - using system environment`, 'warning');
  }
  
  log(`NODE_ENV: ${process.env.NODE_ENV || 'not set (defaulting to development)'}`, 'debug');
}

// ============================================
// 🚀 Main Execution
// ============================================

/**
 * Main function that orchestrates the server restart
 */
async function main(): Promise<void> {
  const startTime = Date.now();
  
  logBanner();

  // System info
  const sysInfo = getSystemInfo();
  logSystemInfo(sysInfo);
  console.log('');
  
  logDivider();
  console.log('');

  // Validate environment
  const port = getPort();
  log(`${icons.port} Target port: ${colors.bright}${port}${colors.reset}`, 'info');

  checkEnvironment();
  
  console.log('');
  logDivider();
  console.log('');

  // Validate package.json
  if (!validatePackageScripts()) {
    process.exit(1);
  }

  console.log('');

  // Kill existing process
  const killed = await killProcessOnPort(port);

  if (!killed) {
    log('Failed to free port completely - attempting to start anyway...', 'warning');
  }

  console.log('');
  logDivider();
  console.log('');

  // Delay for port cleanup
  log(`${icons.time} Waiting ${STARTUP_DELAY_MS}ms for port to stabilize...`, 'step');
  await new Promise(resolve => setTimeout(resolve, STARTUP_DELAY_MS));

  // Final port check
  const portIsFree = await verifyPortIsFree(port);
  if (!portIsFree) {
    log(`${icons.error} Port ${port} is still occupied!`, 'error');
    log('You may need to manually kill the process or choose a different port', 'warning');
    process.exit(1);
  }

  // Start dev server
  const elapsed = Date.now() - startTime;
  log(`${icons.success} All clear! Starting fresh development server... (${elapsed}ms)`, 'title');
  console.log('');

  startDevServer(port);
}

// Run it!
main()
  .catch((error: Error) => {
    console.log('');
    log(`${icons.error} Fatal error: ${error.message}`, 'error');
    if (error.stack) {
      console.log(`${colors.dim}${error.stack}${colors.reset}`);
    }
    process.exit(1);
  });