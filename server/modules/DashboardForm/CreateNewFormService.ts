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
            $1,                     -- user_id
            $2,                     -- form_name
            $3,                     -- endpoint_slug
            $4,                     -- submit_token

            us.default_allowed_domains,
            us.default_disallowed_domains,

            us.default_honeypot_enabled,
            us.default_honeypot_class_name,
            us.default_honeypot_input_name,
            us.default_honeypot_hidden_style,

            us.default_spam_filter_enabled,

            us.default_notification_enabled,
            us.default_notification_frequency,
            us.default_notification_via_email,
            us.default_notification_email_recipients

        FROM user_settings us
        WHERE us.user_id = $1
        RETURNING id;
	`;
    const params = [data.user_id, data.name, data.slug, data.token];
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
