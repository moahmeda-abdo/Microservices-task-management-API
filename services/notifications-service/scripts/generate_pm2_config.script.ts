import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

/**
 * Reads the .env file and extracts the PORT value
 */
function readPortFromEnv(): string | null {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    return null;
  }
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('PORT=')) {
        const port = trimmedLine.split('=')[1].trim();
        return port || null;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error reading .env file:', error);
    return null;
  }
}

/**
 * Generates a random port number between 3000 and 9999
 */
function generateRandomPort(): string {
  const minPort = 3000;
  const maxPort = 9999;
  const randomPort = Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
  return randomPort.toString();
}

/**
 * Prompts user for port number via CLI
 */
function promptForPort(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question('Enter port number (or press Enter for random): ', (answer) => {
      rl.close();
      const port = answer.trim();
      resolve(port || generateRandomPort());
    });
  });
}

/**
 * Reads package.json to get the application name
 */
function getAppName(): string {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  try {
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.name || 'app';
    }
  } catch (error) {
    console.error('Error reading package.json:', error);
  }
  
  return 'app';
}

/**
 * Generates the PM2 ecosystem config content
 */
function generateEcosystemConfig(appName: string, port: string): string {
  return `module.exports = {
  apps: [
    {
      name: "${appName}:${port}",
      script: "./dist/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      // Logging
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_file: "./logs/pm2-combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
    },
  ],
};
`;
}

/**
 * Writes the ecosystem config to file
 */
function writeEcosystemConfig(content: string): void {
  const configPath = path.join(process.cwd(), 'ecosystem.config.js');
  
  try {
    fs.writeFileSync(configPath, content, 'utf-8');
    console.log('✅ ecosystem.config.js generated successfully!');
    console.log(`📁 Location: ${configPath}`);
  } catch (error) {
    console.error('❌ Error writing ecosystem.config.js:', error);
    process.exit(1);
  }
}

/**
 * Ensures logs directory exists
 */
function ensureLogsDirectory(): void {
  const logsPath = path.join(process.cwd(), 'logs');
  
  if (!fs.existsSync(logsPath)) {
    try {
      fs.mkdirSync(logsPath, { recursive: true });
      console.log('📁 Created logs directory');
    } catch (error) {
      console.error('⚠️  Warning: Could not create logs directory:', error);
    }
  }
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  console.log('🚀 Initializing PM2 ecosystem config...\n');
  
  // Get app name from package.json
  const appName = getAppName();
  
  // Try to read port from .env
  let port = readPortFromEnv();
  
  if (port) {
    console.log(`✅ Found PORT in .env: ${port}`);
  } else {
    console.log('⚠️  No PORT found in .env file');
    port = await promptForPort();
    console.log(`✅ Using port: ${port}`);
  }
  
  // Generate config content
  const configContent = generateEcosystemConfig(appName, port);
  
  // Ensure logs directory exists
  ensureLogsDirectory();
  
  // Write config file
  writeEcosystemConfig(configContent);
  
  console.log(`\n🎉 Done! App name: ${appName}:${port}`);
}

// Execute
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});