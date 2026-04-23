-- Identity + source of truth
CREATE TABLE email_subscriber (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email                   TEXT NOT NULL,
    account_id              UUID NOT NULL,
    pref_weekly_digest      BOOLEAN NOT NULL DEFAULT true,
    pref_product_updates    BOOLEAN NOT NULL DEFAULT true,
    pref_promotions         BOOLEAN NOT NULL DEFAULT false,
    unsubscribe_at          TIMESTAMPTZ,         -- null = active, not-null = unsubscribed
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT unique_email_subscriber_email_account UNIQUE (email, account_id)
);
CREATE INDEX idx_email_subscriber_account ON email_subscriber (account_id);
CREATE INDEX idx_email_subscriber_active  ON email_subscriber (account_id)
    WHERE unsubscribe_at IS NULL;

-- Subscribe events (append-only, legal evidence)
-- GDPR erasure: never DELETE. Anonymize: set user_agent='redacted', ip_address=NULL
CREATE TABLE email_subscription_logs (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id           UUID NOT NULL REFERENCES email_subscriber(id),
    ip_address              INET,
    user_agent              TEXT,
    subscribe_from          TEXT NOT NULL,
    pref_weekly_digest      BOOLEAN NOT NULL DEFAULT true,
    pref_product_updates    BOOLEAN NOT NULL DEFAULT true,
    pref_promotions         BOOLEAN NOT NULL DEFAULT false,
    consent_text            TEXT NOT NULL,
    consent_version         TEXT NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_email_subscription_logs_subscriber ON email_subscription_logs (subscriber_id);

-- Unsubscribe events (append-only, legal evidence)
-- GDPR erasure: never DELETE. Anonymize: set user_agent='redacted', ip_address=NULL
CREATE TABLE email_unsubscription_logs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscriber_id    UUID NOT NULL REFERENCES email_subscriber(id),
    ip_address       INET,
    user_agent       TEXT,
    unsubscribe_from TEXT NOT NULL,
    consent_version  TEXT NOT NULL,
    reason_code      TEXT,
    reason_notes     TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_email_unsubscription_logs_subscriber ON email_unsubscription_logs (subscriber_id);
