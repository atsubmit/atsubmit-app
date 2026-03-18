import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";

export const quickCreateNewFormService = async (
    c: MainContext,
    data: {
        user_id: string;
        name: string;
        slug: string;
        token: string;
    },
) => {
    const query = `
        INSERT INTO forms (
            user_id,
            name,
            endpoint_slug,
            submit_token,

            allowed_domains,
            disallowed_domains,

            honeypot_enabled,
            honeypot_class_name,
            honeypot_input_name,
            honeypot_hidden_style,

            spam_filter_enabled,

            notification_enabled,
            notification_frequency,
            notification_via_email,
            notification_email_recipients
        )
        SELECT
            $1,  -- user_id
            $2,  -- form_name
            $3,  -- endpoint_slug
            $4,  -- submit_token

            COALESCE(us.default_allowed_domains, $5),
            COALESCE(us.default_disallowed_domains, $6),

            COALESCE(us.default_honeypot_enabled, $7),
            COALESCE(us.default_honeypot_class_name, $8),
            COALESCE(us.default_honeypot_input_name, $9),
            COALESCE(us.default_honeypot_hidden_style, $10),

            COALESCE(us.default_spam_filter_enabled, $11),

            COALESCE(us.default_notification_enabled, $12),
            COALESCE(us.default_notification_frequency, $13),
            COALESCE(us.default_notification_via_email, $14),
            COALESCE(us.default_notification_email_recipients, $15)
        FROM LATERAL (
            SELECT *
            FROM user_settings us
            WHERE us.user_id = $1
        ) us
        RIGHT JOIN (SELECT 1) dummy ON TRUE
    `;

    const defaultAllowedDomains: string[] = []; // $5 (ARRAY)
    const defaultDisallowedDomains: string[] = []; // $6 (ARRAY)
    const defaultHoneypotEnabled = false; // $7 (boolean)
    const defaultHoneypotClassName = null; // $8
    const defaultHoneypotInputName = null; // $9
    const defaultHoneypotHiddenStyle = null; // $10
    const defaultSpamFilterEnabled = false; // $11 (boolean)
    const defaultNotificationEnabled = false; // $12 (boolean)
    const defaultNotificationFrequency = null; // $13 ('instant', 'daily', etc.)
    const defaultNotificationViaEmail = false; // $14 (boolean)
    const defaultNotificationRecipients: string[] = []; // $15 (ARRAY)

    // Example params
    const params = [
        data.user_id, // $1
        data.name, // $2
        data.slug, // $3
        data.token, // $4
        defaultAllowedDomains, // $5 (ARRAY)
        defaultDisallowedDomains, // $6 (ARRAY)
        defaultHoneypotEnabled, // $7 (boolean)
        defaultHoneypotClassName, // $8
        defaultHoneypotInputName, // $9
        defaultHoneypotHiddenStyle, // $10
        defaultSpamFilterEnabled, // $11 (boolean)
        defaultNotificationEnabled, // $12 (boolean)
        defaultNotificationFrequency, // $13 ('instant', 'daily', etc.)
        defaultNotificationViaEmail, // $14 (boolean)
        defaultNotificationRecipients, // $15 (ARRAY)
    ];
    console.log(params);

    const result = await lazyPoolExecute(c, async (client) => {
        return client.query(query, params);
    });

    return result.rows[0] || null;
};

export const createSubmissionEndpoint = (
    c: MainContext,
    endpoint_slug: string,
) => {
    new URL(c.env.APP_PUBLIC_API_ENDPOINT);
    return `${c.env.APP_PUBLIC_API_ENDPOINT}/f/${endpoint_slug}`;
};
