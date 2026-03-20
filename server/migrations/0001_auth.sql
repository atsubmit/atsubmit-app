-- =====================================================
-- Form Submission Platform — MVP Database Schema
-- PostgreSQL
-- =====================================================

---

-- EXTENSIONS

---

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,

    deleted_at TIMESTAMP,
    scheduled_purge_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()

);

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_users_deleted
ON users(deleted_at);

-- =====================================================
-- AUTH IDENTITIES (email/password + oauth)
-- =====================================================

CREATE TABLE auth_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255),

    password_hash TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),

    CONSTRAINT unique_provider_identity
    UNIQUE(provider, provider_user_id)

);

CREATE INDEX idx_auth_user
ON auth_identities(user_id);

CREATE INDEX idx_auth_provider
ON auth_identities(provider);


-- =====================================================
-- Password Reset Tokens
-- =====================================================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    token_hash TEXT NOT NULL,

    expires_at TIMESTAMP NOT NULL,

    used_at TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_reset_user
ON password_reset_tokens(user_id);

CREATE INDEX idx_reset_user_created
ON password_reset_tokens(user_id, created_at DESC);

CREATE INDEX idx_reset_token_hash
ON password_reset_tokens(token_hash);

CREATE INDEX idx_reset_expiry
ON password_reset_tokens(expires_at);


-- =====================================================
-- Email Verification Tokens
-- =====================================================
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    token TEXT UNIQUE NOT NULL,

    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT now()
);
