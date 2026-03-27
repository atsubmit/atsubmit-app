import type { Timestamp, UUID } from "@server/modules/Fields";

export interface EmailLog {
    id: UUID;

    account_id: UUID | null;

    provider: string;
    external_id: string | null;
    payload: Record<string, unknown>;

    response_status: string;
    response_body: string;

    created_at: Timestamp;
}
