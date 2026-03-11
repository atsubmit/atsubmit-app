CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,

    recipient_email VARCHAR(255) NOT NULL,

    status VARCHAR(50) NOT NULL,

    provider_message_id VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_email_logs_submission
ON email_logs(submission_id);

CREATE INDEX idx_email_logs_status
ON email_logs(status);