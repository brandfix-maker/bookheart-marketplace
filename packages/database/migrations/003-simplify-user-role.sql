-- Simplify user roles enum from buyer/seller/both/admin to user/admin
-- All users can buy and sell. Seller features activate when they list their first book.

-- 1) Create the new enum type
DO $$ BEGIN
  CREATE TYPE user_role_new AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) Alter column to use new enum via casting
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
ALTER TABLE users ALTER COLUMN role TYPE user_role_new USING (
  CASE role
    WHEN 'admin' THEN 'admin'::user_role_new
    ELSE 'user'::user_role_new
  END
);

-- 3) Set new default
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';

-- 4) Drop old enum and rename new to original name for consistency
DO $$ BEGIN
  -- Rename old type out of the way if exists
  PERFORM 1 FROM pg_type WHERE typname = 'user_role';
  IF FOUND THEN
    -- old type name in use by column no longer, safe to drop
    DROP TYPE user_role;
  END IF;
END $$;

ALTER TYPE user_role_new RENAME TO user_role;


