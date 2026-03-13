CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    display_name VARCHAR(100),

    timezone VARCHAR(64),

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    -- default domain policy
    default_allowed_domains TEXT[],
    default_disallowed_domains TEXT[],

    -- submission processing defaults
    default_honeypot_enabled BOOLEAN,
    default_honeypot_class_name VARCHAR(64),
    default_honeypot_input_name VARCHAR(20),
    default_honeypot_hidden_style VARCHAR(50),

    default_spam_filter_enabled BOOLEAN,

    -- notification defaults
    default_notification_enabled BOOLEAN,

    default_notification_frequency VARCHAR(20),
    default_notification_via_email BOOLEAN,

    default_notification_email_recipients TEXT[],

    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);