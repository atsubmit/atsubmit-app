import { UUID } from "./Fields";

/**
 * Canonical email status used for delivery decisions
 */
export type EmailRecipientStatus =
    | "active"
    | "bounced"
    | "complained"
    | "suppressed"
    | "invalid";

/**
 * Reason explaining why the status was set
 */
export type EmailRecipientStatusReason =
    | "bounce"
    | "complaint"
    | "suppression"
    | "manual"
    | "reject"
    | "provider_sync"
    | "unknown";

/**
 * Source of the update
 */
export type EmailRecipientSource = "webhook" | "manual" | "system" | "import";

/**
 * Represents a recipient email status used for delivery decision.
 *
 * This table acts as a derived "safety layer" built from webhook events
 * (bounce, complaint, suppression) and manual overrides.
 *
 * One email can have multiple rows (per account/provider),
 * but each row represents the latest known state for that scope.
 */
export interface EmailRecipient {
    /** Primary ID (UUID) */
    id: UUID;

    /**
     * Email address (should be normalized to lowercase before storing)
     * Used as the main lookup key for send decisions
     */
    email: string;

    /**
     * Account / tenant ID (nullable for global scope)
     * Allows isolation between different users/projects
     * default: `00000000-0000-0000-0000-000000000000`
     */
    account_id: UUID;

    /**
     * Email provider source
     * null = global rule (applies to all providers)
     */
    provider: string;

    /**
     * Current status used for send decision
     */
    status: EmailRecipientStatus;

    /**
     * Reason for current status (source of truth explanation)
     */
    status_reason: EmailRecipientStatusReason | null;

    /**
     * Source of the update
     * - webhook: from provider (SES SNS, etc.)
     * - manual: user override
     * - system: internal logic
     * - import: bulk import / migration
     */
    source: EmailRecipientSource;

    /**
     * Number of bounce events observed
     */
    bounce_count: number;

    /**
     * Number of complaint events observed
     */
    complaint_count: number;

    /**
     * Record creation timestamp
     */
    created_at: string; // ISO date string

    /**
     * Last update timestamp
     */
    updated_at: string; // ISO date string
}
