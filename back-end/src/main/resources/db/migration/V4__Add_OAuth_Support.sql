-- V4: Add Google OAuth support, remove password authentication

ALTER TABLE USERS ADD COLUMN google_id VARCHAR(255);
ALTER TABLE USERS DROP COLUMN password_hash;
ALTER TABLE USERS ALTER COLUMN google_id SET NOT NULL;
ALTER TABLE USERS ADD CONSTRAINT unique_google_id UNIQUE (google_id);

CREATE INDEX idx_users_google_id ON USERS(google_id);
