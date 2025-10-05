const { neon } = require('@neondatabase/serverless');

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }
  const sql = neon(process.env.DATABASE_URL);

  const statements = [
    "DO $$ BEGIN CREATE TYPE user_role_new AS ENUM ('user', 'admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;",
    "ALTER TABLE users ALTER COLUMN role DROP DEFAULT;",
    "ALTER TABLE users ALTER COLUMN role TYPE user_role_new USING (CASE role WHEN 'admin' THEN 'admin'::user_role_new ELSE 'user'::user_role_new END);",
    "ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';",
    "DO $$ BEGIN PERFORM 1 FROM pg_type WHERE typname = 'user_role'; IF FOUND THEN DROP TYPE user_role; END IF; END $$;",
    "ALTER TYPE user_role_new RENAME TO user_role;",
  ];

  for (const stmt of statements) {
    console.log('Executing:', stmt);
    await sql(stmt);
  }

  console.log('Role simplification migration applied successfully.');
}

run().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});


