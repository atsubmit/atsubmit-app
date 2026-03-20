import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";

type Result =
    | { status: "invalid" }
    | {
          status: "valid" | "used" | "expired";
          user_id: string;
          email: string;
          email_verified: boolean;
      };
export const updateEmailVerifiedService = async (
    c: MainContext,
    data: {
        token: string;
    },
): Promise<Result> => {
    const query = `
        WITH token_row AS (
            SELECT
                evt.id,
                evt.user_id,
                evt.used_at,
                evt.expires_at,
                u.email,
                u.email_verified
            FROM email_verification_tokens evt
            JOIN users u ON u.id = evt.user_id
            WHERE evt.token = encode(digest($1, 'sha256'), 'hex')
            LIMIT 1
        ),

        status_eval AS (
            SELECT
                *,
                CASE
                    WHEN id IS NULL THEN 'invalid'
                    WHEN used_at IS NOT NULL THEN 'used'
                    WHEN expires_at <= now() THEN 'expired'
                    ELSE 'valid'
                END AS status
            FROM token_row
        ),

        update_user AS (
            UPDATE users
            SET email_verified = TRUE
            WHERE id IN (
                SELECT user_id FROM status_eval WHERE status = 'valid'
            )
            RETURNING id
        ),

        update_token AS (
            UPDATE email_verification_tokens
            SET used_at = now()
            WHERE id IN (
                SELECT id FROM status_eval WHERE status = 'valid'
            )
            RETURNING id
        )

        SELECT
            status_eval.status,
            status_eval.user_id,
            status_eval.email,
            status_eval.email_verified
        FROM status_eval;
    `;
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<Result>(query, [data.token]);
    });

    const row = result.rows[0];

    if (!row) {
        return { status: "invalid" };
    }

    return row;
};
