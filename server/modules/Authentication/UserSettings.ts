import { Timestamp, UUID } from "../Fields";

export interface UserDomainSettings {
    /**
     * Allowed domains by default
     */
    default_allowed_domains?: string[];

    /**
     * Disallowed domains by default
     */
    default_disallowed_domains?: string[];
}

export interface UserHoneypotSettings {
    /**
     * Enable honeypot by default
     */
    default_honeypot_enabled?: boolean;

    /**
     * Honeypot class name
     * max length: 64
     */
    default_honeypot_class_name?: string;

    /**
     * Honeypot input name
     * max length: 64
     */
    default_honeypot_input_name?: string;

    /**
     * Honeypot hidden style
     * max length: 50
     */
    default_honeypot_hidden_style?: string;
}

export interface UserProcessingSettings extends UserHoneypotSettings {}

export interface UserNotificationSettings {
    /**
     * Notification enabled
     */
    default_notification_enabled?: boolean;

    /**
     * Notification frequency
     * max length: 20
     */
    default_notification_frequency?: string;

    /**
     * Enable email notifications
     */
    default_notification_via_email?: boolean;

    /**
     * Notification to those emails beside the owner
     */
    default_notification_email_recipients?: string[];
}

export interface UserSettings
    extends
        UserDomainSettings,
        UserProcessingSettings,
        UserNotificationSettings {
    user_id: UUID;

    created_at: Timestamp;
    updated_at: Timestamp;
}
