-- V6: Add enrollment approval workflow support
-- This migration adds PENDING/APPROVED/DENIED status to student enrollments
-- and join code functionality for classes

-- Add enrollment status tracking to USER_CLASSES
ALTER TABLE USER_CLASSES ADD COLUMN enrollment_status VARCHAR(20)
    CHECK (enrollment_status IN ('PENDING', 'APPROVED', 'DENIED'))
    DEFAULT 'PENDING' NOT NULL;

-- Update existing enrollments to APPROVED status (they were direct adds by instructors)
UPDATE USER_CLASSES SET enrollment_status = 'APPROVED';

-- Add join code support to CLASSES table
ALTER TABLE CLASSES ADD COLUMN join_code VARCHAR(50) UNIQUE;

-- Add end date for class archiving
ALTER TABLE CLASSES ADD COLUMN end_date TIMESTAMP;

-- Add reference to instructor who created the class
ALTER TABLE CLASSES ADD COLUMN created_by UUID
    REFERENCES USERS(user_id) ON DELETE SET NULL;
