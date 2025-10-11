-- Migration: Add notifications table
-- Description: Create notifications table for user notifications

-- Create notification type enum
CREATE TYPE notification_type AS ENUM (
  'offer_received',
  'offer_accepted',
  'offer_rejected',
  'offer_countered',
  'message_received',
  'book_sold'
);

-- Create related type enum
CREATE TYPE notification_related_type AS ENUM (
  'offer',
  'transaction',
  'message',
  'book'
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  related_type notification_related_type,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_is_read_idx ON notifications(is_read);
CREATE INDEX notifications_created_at_idx ON notifications(created_at DESC);
CREATE INDEX notifications_user_read_idx ON notifications(user_id, is_read);
CREATE INDEX notifications_user_created_idx ON notifications(user_id, created_at DESC);

-- Add comment to table
COMMENT ON TABLE notifications IS 'User notifications for offers, messages, and transactions';
COMMENT ON COLUMN notifications.related_id IS 'ID of the related entity (offer, transaction, message, book)';
COMMENT ON COLUMN notifications.related_type IS 'Type of the related entity';

