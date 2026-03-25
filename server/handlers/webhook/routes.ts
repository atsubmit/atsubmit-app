import { saveIncomingWebhookEventService } from "@server/modules/AwsWebhook/SaveIncomingWebhookEventService";
import {
    SnsNotificationPayloadSchema,
    SnsSignedPayloadSchema,
    SnsSubscriptionConfirmationSchema,
    SnsUnsubscriptionConfirmationSchema,
} from "@server/modules/AwsWebhook/SesBounceBodyService";
import {
    AWS_SNS_WEBHOOK_EVENT_TYPE_NOTIFICATION,
    AWS_SNS_WEBHOOK_EVENT_TYPE_SUBSCRIPTION_CONFIRMATION,
    AWS_SNS_WEBHOOK_EVENT_TYPE_UNKNOWN,
    AWS_SNS_WEBHOOK_EVENT_TYPE_UNSUBSCRIPTION_CONFIRMATION,
    INCOMING_WEBHOOK_EVENT_PROVIDER_AWS_SNS,
} from "@server/modules/IncomingWebhookEvent";
import { WebhookHono } from "@server/types";

export const registerWebhookRoutes = (webhook: WebhookHono) => {
    const aws = webhook.basePath("/aws");
    aws.on(
        ["post", "get"],
        "/ses/0ba971ed74210dad183e1d71d63c33",
        async (c) => {
            const text = await c.req.text();
            console.log(c.get("reqId"), text);

            let json: unknown | null = null;
            try {
                json = JSON.parse(text);
            } catch (error) {
                console.error(c.get("reqId"), "NOT_JSON");
                return c.json(null, 200);
            }

            if (!json || typeof json !== "object") {
                console.error(c.get("reqId"), "NOT_JSON");
                return c.json(null, 200);
            }

            const signedPayload = SnsSignedPayloadSchema.safeParse(json);
            if (!signedPayload.success) {
                console.error(c.get("reqId"), "NOT_SNS_SIGNED");
                return c.json(null, 200);
            }

            const subcribePayload =
                SnsSubscriptionConfirmationSchema.safeParse(json);
            if (subcribePayload.success) {
                await saveIncomingWebhookEventService(c, {
                    provider: INCOMING_WEBHOOK_EVENT_PROVIDER_AWS_SNS,
                    event_type:
                        AWS_SNS_WEBHOOK_EVENT_TYPE_SUBSCRIPTION_CONFIRMATION,
                    external_id: subcribePayload.data.MessageId,
                    payload: subcribePayload.data,
                });

                return c.json(null, 200);
            }

            const unsubcribePayload =
                SnsUnsubscriptionConfirmationSchema.safeParse(json);
            if (unsubcribePayload.success) {
                await saveIncomingWebhookEventService(c, {
                    provider: INCOMING_WEBHOOK_EVENT_PROVIDER_AWS_SNS,
                    event_type:
                        AWS_SNS_WEBHOOK_EVENT_TYPE_UNSUBSCRIPTION_CONFIRMATION,
                    external_id: unsubcribePayload.data.MessageId,
                    payload: unsubcribePayload.data,
                });

                return c.json(null, 200);
            }

            const notificationPayload =
                SnsNotificationPayloadSchema.safeParse(json);
            if (notificationPayload.success) {
                await saveIncomingWebhookEventService(c, {
                    provider: INCOMING_WEBHOOK_EVENT_PROVIDER_AWS_SNS,
                    event_type: AWS_SNS_WEBHOOK_EVENT_TYPE_NOTIFICATION,
                    external_id: notificationPayload.data.MessageId,
                    payload: notificationPayload.data,
                });

                return c.json(null, 200);
            }

            await saveIncomingWebhookEventService(c, {
                provider: INCOMING_WEBHOOK_EVENT_PROVIDER_AWS_SNS,
                event_type: AWS_SNS_WEBHOOK_EVENT_TYPE_UNKNOWN,
                external_id: signedPayload.data.MessageId,
                payload: json,
            });

            return c.json(null, 200);
        },
    );
};
