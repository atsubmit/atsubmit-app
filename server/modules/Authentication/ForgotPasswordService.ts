import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";
import { PasswordResetTokens } from "../PasswordResetTokens";
import { User } from "./User";

export const verifyCanResetPassword = async (c: MainContext, email: string) => {
    const query = `
	SELECT
		u.email as email
		, prt.created_at as created_at
	FROM password_reset_tokens prt
	RIGHT JOIN users u
		ON u.id = prt.user_id
	WHERE
		u.email = $1
		AND u.deleted_at IS NULL
	ORDER BY
		prt.created_at DESC
	LIMIT 1;
    `;
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<{
            email: User["email"];
            created_at: PasswordResetTokens["created_at"];
        }>(query, [email]);
    });

    const row = result.rows[0] || null;

    if (!row?.email) {
        // RIGHT JOIN + LIMIT 1
        // => there're always 1 row if email is valid
        return false;
    }

    const created_at = new Date(row.created_at).valueOf();
    const diff = Date.now() - created_at;

    return diff > 10e3;
};

export const insertPasswordResetTokenRecord = async (
    c: MainContext,
    data: {
        email: string;
        token: string;
    },
) => {
    const query = `
	INSERT INTO
		password_reset_tokens (
			user_id,
			token_hash,
			expires_at
		)
	SELECT
		u.id,
		encode(digest($1, 'sha256'), 'hex'),
		now() + interval '1 hour'
	FROM users u
	WHERE
		u.email = $2
		AND u.deleted_at is null
	LIMIT 1
	;
`;
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query(query, [data.token, data.email]);
    });

    return result.rowCount === 1;
};
