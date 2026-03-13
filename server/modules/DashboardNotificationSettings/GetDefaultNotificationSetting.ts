import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";
import { UserNotificationSettings } from "../Authentication/UserSettings";

export const getDefaultNotificationSetting = async (
    c: MainContext,
    user_id: string,
) => {
    const query = `
		SELECT
			  us.default_notification_enabled
			, us.default_notification_frequency
			, us.default_notification_via_email
			, us.default_notification_email_recipients
		FROM user_settings us
		WHERE
			us.user_id = $1
		LIMIT 1
	`;
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<UserNotificationSettings>(query, [user_id]);
    });

    return result.rows[0] || null;
};
