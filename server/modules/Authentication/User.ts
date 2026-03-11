import type { Timestamp, UUID } from "@server/modules/Fields";

export interface User {
  id: UUID;

  email: string;
  email_verified: boolean;

  deleted_at: Timestamp | null;
  scheduled_purge_at: Timestamp | null;

  created_at: Timestamp;
  updated_at: Timestamp;
}
