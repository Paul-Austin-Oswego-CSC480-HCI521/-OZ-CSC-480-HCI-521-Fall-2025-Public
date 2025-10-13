-- Initial database schema for Kudos Card System

-- Create USERS table
CREATE TABLE USERS (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('STUDENT', 'INSTRUCTOR')) NOT NULL
);

-- Create CLASSES table
CREATE TABLE CLASSES (
    class_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_name VARCHAR(100) NOT NULL
);

-- Create USER_CLASSES junction table
CREATE TABLE USER_CLASSES (
    user_id UUID NOT NULL,
    class_id UUID NOT NULL,
    PRIMARY KEY (user_id, class_id),
    CONSTRAINT fk_user_classes_user FOREIGN KEY (user_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_classes_class FOREIGN KEY (class_id) REFERENCES CLASSES(class_id) ON DELETE CASCADE
);

-- Create KUDOS_CARDS main table
CREATE TABLE KUDOS_CARDS (
    card_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    class_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) CHECK (status IN ('PENDING', 'APPROVED', 'DENIED', 'RECEIVED')) DEFAULT 'PENDING',
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    professor_note TEXT,
    CONSTRAINT fk_cards_sender FOREIGN KEY (sender_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_cards_recipient FOREIGN KEY (recipient_id) REFERENCES USERS(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_cards_class FOREIGN KEY (class_id) REFERENCES CLASSES(class_id) ON DELETE CASCADE,
    CONSTRAINT fk_cards_approver FOREIGN KEY (approved_by) REFERENCES USERS(user_id),
    CONSTRAINT ck_cards_different_users CHECK (sender_id != recipient_id),
    CONSTRAINT ck_cards_content_length CHECK (LENGTH(content) <= 1000)
);

-- Performance Indexes

-- User authentication and lookup
CREATE INDEX idx_users_email ON USERS(email);

-- Home page inbox queries (cards received by user)
CREATE INDEX idx_cards_recipient_status ON KUDOS_CARDS(recipient_id, status);

-- Home page outbox queries (cards sent by user)  
CREATE INDEX idx_cards_sender_status ON KUDOS_CARDS(sender_id, status);

-- Instructor approval workflows
CREATE INDEX idx_cards_class_status ON KUDOS_CARDS(class_id, status);