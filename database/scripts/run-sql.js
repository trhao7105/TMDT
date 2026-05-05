require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function main() {
  const sqlFile = process.argv[2];

  if (!sqlFile) {
    console.error("Usage: node scripts/run-sql.js <path-to-sql-file>");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL in .env");
    process.exit(1);
  }

  const fullPath = path.resolve(sqlFile);

  if (!fs.existsSync(fullPath)) {
    console.error(`SQL file not found: ${fullPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(fullPath, "utf8");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log(`Running SQL file: ${sqlFile}`);

    await client.query(sql);

    console.log("SQL executed successfully.");
  } catch (error) {
    console.error("SQL execution failed:");
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();