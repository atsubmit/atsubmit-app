import type { Timestamp, UUID } from "@server/modules/Fields";

export interface FormDomainSettings {
    /**
     * Allowed domains by default
     */
    allowed_domains?: string[];

    /**
     * Disallowed domains by default
     */
    disallowed_domains?: string[];
}

export interface FormHoneypotSettings {
    /**
     * Enable honeypot by default
     */
    honeypot_enabled?: boolean;

    /**
     * Honeypot class name
     * max length: 64
     */
    honeypot_class_name?: string;

    /**
     * Honeypot input name
     * max length: 64
     */
    honeypot_input_name?: string;

    /**
     * Honeypot hidden style
     * max length: 50
     */
    honeypot_hidden_style?: string;
}

export interface FormProcessingSettings extends FormHoneypotSettings {}

export interface FormNotificationSettings {
    /**
     * Notification enabled
     */
    notification_enabled?: boolean;

    /**
     * Notification frequency
     * max length: 20
     */
    notification_frequency?: string;

    /**
     * Enable email notifications
     */
    notification_via_email?: boolean;

    /**
     * Notification to those emails beside the owner
     */
    notification_email_recipients?: string[];
}

export interface Form
    extends
        FormDomainSettings,
        FormProcessingSettings,
        FormNotificationSettings {
    /** UUID — primary key. Default: generated via gen_random_uuid() */
    id: UUID;

    /** UUID — references users(id). NOT NULL */
    user_id: UUID;

    /**
     * Form display name
     * maxLength: 255
     */
    name: string;

    /**
     * Public endpoint slug
     * unique
     * maxLength: 100
     */
    endpoint_slug: string;

    /** Submission security token */
    submit_token: string;

    /** Default: true */
    is_active: boolean;

    created_at: Timestamp;
    updated_at: Timestamp;
}
