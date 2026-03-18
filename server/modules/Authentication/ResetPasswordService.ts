import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";
import { User } from "./User";

export const verifyCanResetPasswordWithEmail = async (
    c: MainContext,
    token: string,
) => {
    const query = `
        SELECT
            u.id
            , u.email
        FROM password_reset_tokens prt
        JOIN users u
            ON u.id = prt.user_id
        WHERE
            prt.token_hash = encode(digest($1, 'sha256'), 'hex')
            AND prt.used_at IS NULL
            AND prt.expires_at > now()
            AND u.deleted_at IS NULL
        LIMIT 1;
    `;
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<{ id: string; email: string }>(query, [token]);
    });

    const row = result.rows[0];
    return row || null;
};

export const resetPasswordService = async (
    c: MainContext,
    data: {
        user_id: string;
        password: string;
    },
) => {
    const query = `
        UPDATE auth_identities
        SET
                password_hash = crypt($1, gen_salt('bf')),
                updated_at = now()
        WHERE
                user_id = $2
                AND provider = 'email';
        `
    const query2 = `
        UPDATE password_reset_tokens
        SET used_at = now()
        WHERE
                user_id = $1
                AND used_at IS NULL;
    `;
    console.log(1)
    await lazyPoolExecute(c, async (client) => {
        await client.query("BEGIN");
        try {
            await client.query(query, [
                data.password,
                data.user_id,
            ]);
            await client.query(query2, [
                data.user_id,
            ]);
            await client.query("COMMIT");
        } catch (e) {
            await client.query("ROLLBACK");

            throw e;
        }
        console.log(3)
    });
    console.log(2)
};
