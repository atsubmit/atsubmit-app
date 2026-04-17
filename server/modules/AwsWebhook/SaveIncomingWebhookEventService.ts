import { MainContext } from "@server/types";
import { IncomingWebhookEvent } from "../IncomingWebhookEvent";
import { sendEmail } from "../SendEmail/SendEmailService";

export const saveIncomingWebhookEventService = async (
    c: MainContext,
    data: Pick<
        IncomingWebhookEvent,
        "provider" | "event_type" | "external_id" | "payload"
    >,
) => {
    const reqId = c.get("reqId");
    const response = await sendEmail(c, "/enqueue/aws-ses-event", data, {
        reqId: reqId,
    });
    console.log(reqId, response.status, await response.text());
};
