import { spawn } from "child_process";
import * as path from "path";

// Development server configuration - easy to read and modify
const DEV_CONFIG = {
  base: "ts-node-dev",
  registerPaths: "-r tsconfig-paths/register",
  flags: "--respawn --transpile-only --poll",
  watch: "--ignore-watch node_modules --watch src",
  entry: "src/index.ts",
};

// Compose the full command
const command = DEV_CONFIG.base;
const args = [
  DEV_CONFIG.registerPaths,
  ...DEV_CONFIG.flags.split(" "),
  ...DEV_CONFIG.watch.split(" "),
  DEV_CONFIG.entry,
].filter(Boolean); // Remove any empty strings

console.log("🚀 Starting development server...\n");
console.log("📋 Configuration:");
console.log("━".repeat(80));

// Explain base command
console.log(`\n🔧 Base Command:`);
console.log(`   ${command}`);
console.log(`   └─ TypeScript development server with hot reload`);

// Explain path registration
console.log(`\n📁 Path Registration:`);
console.log(`   ${DEV_CONFIG.registerPaths}`);
console.log(`   └─ Enables TypeScript path aliases (@models, @routes, etc.)`);

// Explain flags
console.log(`\n⚙️  Runtime Flags:`);
const flagExplanations: Record<string, string> = {
  "--respawn": "Auto-restart server on crash",
  "--transpile-only": "Skip type checking (faster startup)",
  "--poll": "Use polling for file watching (better compatibility)",
};

DEV_CONFIG.flags.split(" ").forEach((flag) => {
  if (flag) {
    console.log(`   ${flag}`);
    console.log(`   └─ ${flagExplanations[flag] || "Runtime option"}`);
  }
});

// Explain watch configuration
console.log(`\n👀 Watch Configuration:`);
console.log(`   --ignore-watch node_modules`);
console.log(`   └─ Ignore changes in node_modules (performance optimization)`);
console.log(`   --watch src`);
console.log(`   └─ Watch src directory for file changes`);

// Explain entry point
console.log(`\n📝 Entry Point:`);
console.log(`   ${DEV_CONFIG.entry}`);
console.log(`   └─ Main application entry file`);

console.log("\n" + "━".repeat(80));
console.log(`\n▶️  Executing: ${command} ${args.join(" ")}\n`);

// Spawn the process
const devProcess = spawn(command, args, {
  stdio: "inherit",
  shell: true,
  cwd: path.resolve(__dirname, ".."),
});

// Handle process events
devProcess.on("error", (error) => {
  console.error("❌ Failed to start development server:", error);
  process.exit(1);
});

devProcess.on("exit", (code) => {
  if (code !== null && code !== 0) {
    console.error(`❌ Development server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down development server...");
  devProcess.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down development server...");
  devProcess.kill("SIGTERM");
  process.exit(0);
});
