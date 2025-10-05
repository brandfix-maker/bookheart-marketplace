// Executes a SQL file against the database using @neondatabase/serverless
// Usage: node packages/database/scripts/apply-sql.js <path-to-sql>

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function main() {
  const sqlFileArg = process.argv[2];
  if (!sqlFileArg) {
    console.error('Usage: node packages/database/scripts/apply-sql.js <path-to-sql>');
    process.exit(1);
  }

  const sqlFilePath = path.resolve(process.cwd(), sqlFileArg);
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`SQL file not found: ${sqlFilePath}`);
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set in the environment');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const contents = fs.readFileSync(sqlFilePath, 'utf8');

  try {
    console.log(`Applying SQL from: ${sqlFilePath}`);
    await sql(contents);
    console.log('SQL applied successfully');
  } catch (err) {
    console.error('Failed to apply SQL:', err);
    process.exit(1);
  }
}

main();


