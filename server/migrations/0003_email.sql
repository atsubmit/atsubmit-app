CREATE TABLE incoming_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,

    external_id TEXT,
    
    payload JSONB NOT NULL,

    status TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ
);

-- Deduplication (SNS MessageId)
CREATE UNIQUE INDEX idx_incoming_webhook_events_unique_external
ON incoming_webhook_events (provider, external_id)
WHERE external_id IS NOT NULL;

-- Fast worker query (get pending events)
CREATE INDEX idx_incoming_webhook_events_status_created
ON incoming_webhook_events (status, created_at);

-- Optional: filter by provider
CREATE INDEX idx_incoming_webhook_events_provider
ON incoming_webhook_events (provider);