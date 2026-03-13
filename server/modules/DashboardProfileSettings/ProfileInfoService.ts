import { lazyPoolExecute } from "@server/db/pool";
import { User } from "../Authentication/User";
import { MainContext } from "@server/types";
import { UserProfile } from "../Authentication/UserProfile";

export const getProfileInfo = async (c: MainContext, email: string) => {
    const query = `
		SELECT
			u.email 			as email
			, up.display_name 	as display_name
			, up.timezone 		as timezone
			, up.created_at 	as created_at
			, up.updated_at 	as updated_at
		FROM users u
		JOIN user_profiles up
			ON u.id = up.user_id
		WHERE
			u.email = $1
			AND u.deleted_at IS NULL
		LIMIT 1
	`;
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<
            Pick<User, "email"> &
                Pick<
                    UserProfile,
                    "display_name" | "timezone" | "created_at" | "updated_at"
                >
        >(query, [email]);
    });

    return result.rows[0] || null;
};

export const upsertProfileInfo = async (
    c: MainContext,
    data: {
        user_id: string;
        name: string;
        timezone: string;
    },
) => {
    const query = `
		INSERT INTO user_profiles (
			user_id,
			display_name,
			timezone,
			updated_at
		)
		VALUES (
			$1,         -- user_id
			$2,         -- display_name
			$3,         -- timezone
			now()
		)
		ON CONFLICT (user_id)
		DO UPDATE
		SET
			display_name = EXCLUDED.display_name,
			timezone     = EXCLUDED.timezone,
			updated_at   = now()
		WHERE
			user_profiles.display_name IS DISTINCT FROM EXCLUDED.display_name
			OR user_profiles.timezone  IS DISTINCT FROM EXCLUDED.timezone;
	`;
    return await lazyPoolExecute(c, async (client) => {
        return client.query(query, [data.user_id, data.name, data.timezone]);
    });
};

export const upsertUserHoneyPotSetting = async (
    c: MainContext,
    data: {
        user_id: string;
        enabled: boolean;
        name?: string;
        hiddenStyle: string;
        hiddenClassName?: string;
    },
) => {
    const query = `
		INSERT INTO user_settings (
			user_id,
			default_honeypot_enabled,
			default_honeypot_class_name,
			default_honeypot_input_name,
			default_honeypot_hidden_style,
			updated_at
		)
		VALUES (
			$1,         -- user_id
			$2,         -- enabled
			$3,         -- class_name
			$4,         -- input_name
			$5,         -- hidden_style
			now()
		)
		ON CONFLICT (user_id)
		DO UPDATE
		SET
			default_honeypot_enabled		= EXCLUDED.default_honeypot_enabled,
			default_honeypot_class_name		= EXCLUDED.default_honeypot_class_name,
			default_honeypot_input_name		= EXCLUDED.default_honeypot_input_name,
			default_honeypot_hidden_style	= EXCLUDED.default_honeypot_hidden_style,
			updated_at   					= now();
		WHERE
			user_settings.default_honeypot_enabled				IS DISTINCT FROM EXCLUDED.default_honeypot_enabled,
			OR user_settings.default_honeypot_class_name		IS DISTINCT FROM EXCLUDED.default_honeypot_class_name,
			OR user_settings.default_honeypot_input_name		IS DISTINCT FROM EXCLUDED.default_honeypot_input_name,
			OR user_settings.default_honeypot_hidden_style		IS DISTINCT FROM EXCLUDED.default_honeypot_hidden_style
		;
	`;
    return await lazyPoolExecute(c, async (client) => {
        return client.query(query, [
            data.user_id,
            !!data.enabled,
            data.hiddenClassName ?? null,
            data.name ?? null,
            data.hiddenStyle ?? null,
        ]);
    });
};
