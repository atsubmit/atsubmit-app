import type { Timestamp, UUID } from "@server/modules/Fields";
export type AuthProvider =
    | "password"
    | "google"
    | "github"
    | "facebook"
    | string;

export interface AuthIdentity {
    id: UUID;

    user_id: UUID;

    provider: AuthProvider;
    provider_user_id: string | null;

    password_hash: string | null;

    created_at: Timestamp;
}
