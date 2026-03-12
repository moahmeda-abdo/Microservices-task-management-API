import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

/**
 * Generates a random JWT key (64 character hex string)
 */
function generateJWTKey(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generates a random port number between 3000 and 9999
 */
function generateRandomPort(): number {
  const minPort = 3000;
  const maxPort = 9999;
  return Math.floor(Math.random() * (maxPort - minPort + 1)) + minPort;
}

/**
 * Generates the .env file content
 */
function generateEnvContent(): string {
  const port = generateRandomPort();
  const jwtKey = generateJWTKey();

  return `PORT=${port}

MONGODB_URI=replace_this_value

MONGODB_URI=replace_this_value

NODE_ENV=dev

JWT_KEY=${jwtKey}

HOST_DEV=http://localhost:${port}

 
`;
}

/**
 * Main function to initialize .env file
 */
function main(): void {
  const envPath = path.join(process.cwd(), ".env");

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log("⚠️  .env file already exists!");
    console.log(`📁 Location: ${envPath}`);
    console.log("\n❓ Do you want to overwrite it? (y/N)");

    // For non-interactive mode, we'll just warn and exit
    // In interactive mode, you could use readline here
    console.log("💡 To overwrite, delete the existing .env file first or use --force flag");
    process.exit(1);
  }

  try {
    // Generate .env content
    const envContent = generateEnvContent();

    // Write to file
    fs.writeFileSync(envPath, envContent, "utf-8");

    console.log("✅ .env file created successfully!");
    console.log(`📁 Location: ${envPath}\n`);
    console.log("📋 Generated values:");
    console.log("━".repeat(60));

    // Parse and display generated values
    const lines = envContent.split("\n");
    const generatedValues: Array<{ key: string; value: string }> = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, value] = trimmed.split("=");
        if (value && value !== "replace_this_value") {
          generatedValues.push({ key: key.trim(), value: value.trim() });
        }
      }
    });

    generatedValues.forEach(({ key, value }) => {
      console.log(`   ${key}: ${value}`);
    });

    console.log("━".repeat(60));
    console.log("\n⚠️  Remember to replace 'replace_this_value' placeholders with actual values!");
    console.log("📝 Edit the .env file to configure your application.\n");

  } catch (error) {
    console.error("❌ Failed to create .env file:", error);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes("--force") || args.includes("-f")) {
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    try {
      fs.unlinkSync(envPath);
      console.log("🗑️  Removed existing .env file");
    } catch (error) {
      console.error("❌ Failed to remove existing .env file:", error);
      process.exit(1);
    }
  }
}

// Run the script
main();

