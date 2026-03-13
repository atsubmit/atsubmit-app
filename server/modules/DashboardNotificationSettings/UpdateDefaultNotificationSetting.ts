import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";
import { UserNotificationSettings } from "../Authentication/UserSettings";

export const upsertDefaultNotificationSetting = async (
    c: MainContext,
    data: {
        user_id: string;
        enabled?: boolean;
        via_email?: boolean;
        frequency?: string | null;
        email_recipients?: string[];
    },
) => {
    const query = `
        INSERT INTO user_settings (
            user_id,
            default_notification_enabled,
            default_notification_frequency,
            default_notification_via_email,
            default_notification_email_recipients,
            updated_at
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            now()
        )
        ON CONFLICT (user_id)
        DO UPDATE
        SET
            default_notification_enabled =
                COALESCE(EXCLUDED.default_notification_enabled, user_settings.default_notification_enabled),

            default_notification_frequency =
                COALESCE(EXCLUDED.default_notification_frequency, user_settings.default_notification_frequency),

            default_notification_via_email =
                COALESCE(EXCLUDED.default_notification_via_email, user_settings.default_notification_via_email),

            default_notification_email_recipients =
                COALESCE(EXCLUDED.default_notification_email_recipients, user_settings.default_notification_email_recipients),

            updated_at = now()

        RETURNING
            default_notification_enabled,
            default_notification_frequency,
            default_notification_via_email,
            default_notification_email_recipients;
    `;

    console.log("upsertDefaultNotificationSetting", data);

    return await lazyPoolExecute(c, async (client) => {
        return client.query<UserNotificationSettings>(query, [
            data.user_id,
            !!data.enabled,
            data.frequency ?? null,
            !!data.via_email,
            data.email_recipients ?? null,
        ]);
    });
};
