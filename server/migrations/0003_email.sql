CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- tenant-id
    account_id UUID,

    provider TEXT NOT NULL,
    external_id TEXT,
    payload JSONB NOT NULL,

    response_status TEXT,
    response_body TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE incoming_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- tenant-id
    account_id UUID,

    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,

    external_id TEXT,
    
    payload JSONB NOT NULL,

    status TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ
);

-- Fast worker query (get pending events)
CREATE INDEX idx_incoming_webhook_events_status_created
ON incoming_webhook_events (status, created_at);

-- Optional: filter by provider
CREATE INDEX idx_incoming_webhook_events_provider
ON incoming_webhook_events (provider);

CREATE TABLE email_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email TEXT NOT NULL,
    
    -- tenant-id
    account_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000'

    -- provider scope (nullable = global across providers)
    provider TEXT NOT NULL,

    status TEXT NOT NULL,
    -- active | bounced | complained | suppressed | invalid

    status_reason TEXT,
    -- bounce | complaint | suppression | reject | unknown

    source TEXT NOT NULL,
    -- system | webhook | manual | import

    bounce_count INTEGER NOT NULL DEFAULT 0,
    complaint_count INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_status
ON email_recipients(email, status);

CREATE INDEX idx_blocked_email
ON email_recipients(email)
WHERE status IN ('complained', 'suppressed', 'invalid');

CREATE UNIQUE INDEX idx_email_recipients_unique
ON email_recipients (
    email,
    account_id,
    provider
);
