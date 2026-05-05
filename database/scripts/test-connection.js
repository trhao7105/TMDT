require("dotenv").config();
const { Client } = require("pg");

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL in .env");
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    const result = await client.query("SELECT version() AS version;");
    console.log("Connected to Neon PostgreSQL successfully.");
    console.log(result.rows[0].version);
  } catch (error) {
    console.error("Failed to connect to database:");
    console.error(error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();