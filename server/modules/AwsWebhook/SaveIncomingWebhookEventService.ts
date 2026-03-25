import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";
import { IncomingWebhookEvent } from "../IncomingWebhookEvent";

export const saveIncomingWebhookEventService = async (
    c: MainContext,
    data: Pick<
        IncomingWebhookEvent,
        "provider" | "event_type" | "external_id" | "payload"
    >,
) => {
    const query = `
        INSERT INTO incoming_webhook_events (
			  provider
			, event_type
			, external_id
			, payload
			, status
			, attempts
			, created_at
        )
        VALUES (
			  $1
			, $2
			, $3
			, $4
			, $5
			, $6
			, now()
        )
	`;
    const params = [
        data.provider,
        data.event_type,
        data.external_id,
        data.payload,
        "pending",
        0,
    ];
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query(query, params);
    });

    return result.rows[0] || null;
};
