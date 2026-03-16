-- =====================================================
-- FORMS
-- =====================================================

CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- info
    name VARCHAR(255) NOT NULL,
    endpoint_slug VARCHAR(100) UNIQUE NOT NULL,
    submit_token TEXT NOT NULL,


    -- domain policy
    allowed_domains TEXT[],
    disallowed_domains TEXT[],

    -- submission processing defaults
    honeypot_enabled BOOLEAN,
    honeypot_class_name VARCHAR(64),
    honeypot_input_name VARCHAR(64),
    honeypot_hidden_style VARCHAR(50),

    spam_filter_enabled BOOLEAN,

    -- notification defaults
    notification_enabled BOOLEAN,

    notification_frequency VARCHAR(20),
    notification_via_email BOOLEAN,

    notification_email_recipients TEXT[],

    -- state
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
	request_id text NOT NULL,

    ip_address inet NULL,
	payload jsonb NULL,
	raw_body text NULL,
	raw_headers text NULL,

	spam_score int2 DEFAULT 0 NOT NULL,
	spam_reasons _text NULL,
	spam_checked_at timestamp NULL,

    created_at timestamp DEFAULT now() NOT NULL
);

CREATE INDEX idx_submissions_form
ON submissions(form_id);

CREATE INDEX idx_submissions_created
ON submissions(created_at DESC);

CREATE INDEX idx_submissions_payload
ON submissions USING GIN(payload);
