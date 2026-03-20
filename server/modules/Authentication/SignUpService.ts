import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";
import { User } from "./User";

export const verifyCanSignUpWithEmail = async (
    c: MainContext,
    email: string,
) => {
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<Pick<User, "email">>(
            `
            select
                u.email
            from users u
            where
                u.deleted_at is null
                AND u.email = $1
        `,
            [email],
        );
    });

    return result.rowCount === 0;
};

export const emailSignupService = async (
    c: MainContext,
    credential: {
        email: string;
        password: string;
        verifyToken: string;
    },
) => {
    const query = `
        WITH new_user AS (
            INSERT INTO users
                (email, email_verified)
            VALUES
                ($1, FALSE)
            RETURNING id
        ),
        new_identity AS (
            INSERT INTO auth_identities (
                user_id,
                provider,
                password_hash
            )
            SELECT
                id,
                $2,
                crypt($3, gen_salt('bf'))
            FROM new_user
        ),
        new_token AS (
            INSERT INTO email_verification_tokens (
                user_id,
                token,
                expires_at
            )
            SELECT
                id,
                encode(digest($4, 'sha256'), 'hex'),
                now() + interval '24 hours'
            FROM new_user
            RETURNING token
        )

        SELECT token FROM new_token;
    `;
    await lazyPoolExecute(c, async (client) => {
        await client.query("BEGIN");
        try {
            await client.query(query, [
                credential.email,
                "email",
                credential.password,
                credential.verifyToken,
            ]);

            await client.query("COMMIT");
        } catch (e) {
            await client.query("ROLLBACK");

            throw e;
        }
    });
};
