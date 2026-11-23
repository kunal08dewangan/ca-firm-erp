const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const target = process.argv[2] || "postgresql"; // postgresql or sqlite
const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");

if (!fs.existsSync(schemaPath)) {
  console.error("schema.prisma not found at:", schemaPath);
  process.exit(1);
}

let content = fs.readFileSync(schemaPath, "utf-8");

if (target === "postgresql") {
  content = content.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, content, "utf-8");
  console.log("✓ Updated prisma/schema.prisma datasource to: provider = 'postgresql'");
  console.log("✓ Ready for Vercel + Neon/Supabase/PostgreSQL deployment.");
} else if (target === "sqlite") {
  content = content.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, content, "utf-8");
  console.log("✓ Updated prisma/schema.prisma datasource to: provider = 'sqlite'");
  console.log("✓ Ready for local development with dev.db.");
} else {
  console.error("Unknown target provider. Use 'postgresql' or 'sqlite'.");
  process.exit(1);
}

try {
  console.log("Generating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("✓ Prisma client regenerated successfully.");
} catch (e) {
  console.error("Failed to generate Prisma client:", e.message);
}
