-- Migration: Universal Account System
-- Description: Add activity tracking fields and deprecate role-based system
-- Date: 2024-01-14

-- Add new activity tracking columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS has_made_purchase BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_listed_item BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_buyer_activity TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_seller_activity TIMESTAMP,
ADD COLUMN IF NOT EXISTS seller_onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS registration_survey JSONB;

-- Update existing users based on their current role
UPDATE users 
SET 
  has_made_purchase = CASE 
    WHEN role = 'buyer' OR role = 'both' THEN TRUE 
    ELSE FALSE 
  END,
  has_listed_item = CASE 
    WHEN role = 'seller' OR role = 'both' THEN TRUE 
    ELSE FALSE 
  END,
  seller_onboarding_completed = CASE 
    WHEN role = 'seller' OR role = 'both' THEN TRUE 
    ELSE FALSE 
  END
WHERE role IS NOT NULL;

-- Set activity timestamps for existing users
UPDATE users 
SET 
  last_buyer_activity = CASE 
    WHEN role = 'buyer' OR role = 'both' THEN created_at 
    ELSE NULL 
  END,
  last_seller_activity = CASE 
    WHEN role = 'seller' OR role = 'both' THEN created_at 
    ELSE NULL 
  END
WHERE role IS NOT NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_activity_tracking ON users(has_made_purchase, has_listed_item);
CREATE INDEX IF NOT EXISTS idx_users_seller_status ON users(seller_onboarding_completed, seller_verified);

-- Add comments for documentation
COMMENT ON COLUMN users.has_made_purchase IS 'Tracks if user has made any purchases for progressive disclosure';
COMMENT ON COLUMN users.has_listed_item IS 'Tracks if user has listed any items for progressive disclosure';
COMMENT ON COLUMN users.last_buyer_activity IS 'Last time user engaged in buyer activities';
COMMENT ON COLUMN users.last_seller_activity IS 'Last time user engaged in seller activities';
COMMENT ON COLUMN users.seller_onboarding_completed IS 'Whether user has completed seller onboarding process';
COMMENT ON COLUMN users.registration_survey IS 'Optional survey data collected during registration for analytics';
COMMENT ON COLUMN users.role IS 'DEPRECATED: Kept for backward compatibility. Use activity tracking fields instead.';
