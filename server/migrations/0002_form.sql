-- =====================================================
-- FORMS
-- =====================================================

CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,

    endpoint_slug VARCHAR(100) UNIQUE NOT NULL,

    notification_email VARCHAR(255),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()

);

CREATE INDEX idx_forms_user
ON forms(user_id);

CREATE UNIQUE INDEX idx_forms_slug
ON forms(endpoint_slug);

-- =====================================================
-- SUBMISSIONS
-- =====================================================

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT now(),

    ip_address INET,
    user_agent TEXT,

    payload JSONB NOT NULL,

    spam_flag BOOLEAN DEFAULT FALSE

);

CREATE INDEX idx_submissions_form
ON submissions(form_id);

CREATE INDEX idx_submissions_created
ON submissions(created_at DESC);

CREATE INDEX idx_submissions_payload
ON submissions USING GIN(payload);
