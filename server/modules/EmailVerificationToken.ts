import { Timestamp, UUID } from "./Fields";

export interface EmailVerificationToken {
    id: UUID;

    user_id: UUID;

    token: string;

    expires_at: Timestamp; 
    used_at: string | null;

    created_at: Timestamp;
}
