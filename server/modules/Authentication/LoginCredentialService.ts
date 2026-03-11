import { MainContext } from "@server/types";
import { User } from "./User";
import { lazyPoolExecute } from "@server/db/pool";
import { AuthIdentity } from "./AuthIdentity";

export const matchLoginCredentailService = async (
    c: MainContext,
    credential: { email: string; password: string },
): Promise<User | null> => {
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<User & Pick<AuthIdentity, "password_hash">>(
            `
            select
                  u.id
                , u.email
                , u.email_verified
                , u.deleted_at
                , u.scheduled_purge_at
                , u.created_at
                , u.updated_at
                , ai.password_hash as password_hash
            from users u
            join auth_identities ai
            on u.id = ai.user_id
            where
                u.deleted_at is null
                AND u.email = $1
                AND ai.provider = 'email'
                AND ai.password_hash = crypt($2, password_hash)
        `,
            [credential.email, credential.password],
        );
    });

    const row = result.rows[0];
    console.log(row);

    if (!row) {
        return null;
    }

    const { password_hash, ...user } = row;
    if (!password_hash) {
        return null;
    }

    return user;
};
