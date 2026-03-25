import { env } from "cloudflare:workers";
import { afterEach, beforeEach, vi } from "vitest";
import { describe, expect, it } from "vitest";
import { Hono } from "hono";
import { registerWebhookRoutes } from "./routes";
import { MainHono } from "@server/types";
import * as SaveIncomingWebhookEventService from "@server/modules/AwsWebhook/SaveIncomingWebhookEventService";
import {
    SnsNotificationPayload,
    SnsSubscriptionConfirmationPayload,
    SnsUnsubscriptionConfirmationPayload,
} from "@server/modules/AwsWebhook/SesBounceBodyService";

describe("AWS_SNS", () => {
    const subscribePayload: SnsSubscriptionConfirmationPayload = {
        Type: "SubscriptionConfirmation",
        MessageId: "165545c9-2a5c-472c-8df2-7ff2be2b3b1b",
        Token: "2336412f37...",
        TopicArn: "arn:aws:sns:us-west-2:123456789012:MyTopic",
        Message:
            "You have chosen to subscribe to the topic arn:aws:sns:us-west-2:123456789012:MyTopic.\nTo confirm the subscription, visit the SubscribeURL included in this message.",
        SubscribeURL:
            "https://sns.us-west-2.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-west-2:123456789012:MyTopic&Token=2336412f37...",
        Timestamp: "2012-04-26T20:45:04.751Z",
        SignatureVersion: "1",
        Signature:
            "EXAMPLEpH+DcEwjAPg8O9mY8dReBSwksfg2S7WKQcikcNKWLQjwu6A4VbeS0QHVCkhRS7fUQvi2egU3N858fiTDN6bkkOxYDVrY0Ad8L10Hs3zH81mtnPk5uvvolIC1CXGu43obcgFxeL3khZl8IKvO61GWB6jI9b5+gLPoBc1Q=",
        SigningCertURL:
            "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem",
    };

    const notificationPayload: SnsNotificationPayload = {
        Type: "Notification",
        MessageId: "22b80b92-fdea-4c2c-8f9d-bdfb0c7bf324",
        TopicArn: "arn:aws:sns:us-west-2:123456789012:MyTopic",
        Subject: "My First Message",
        Message: "Hello world!",
        Timestamp: "2012-05-02T00:54:06.655Z",
        SignatureVersion: "1",
        Signature: "EXAMPLEw6JRN...",
        SigningCertURL:
            "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem",
        UnsubscribeURL:
            "https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:123456789012:MyTopic:c9135db0-26c4-47ec-8998-413945fb5a96",
    };

    const unsubscribePayload: SnsUnsubscriptionConfirmationPayload = {
        Type: "UnsubscribeConfirmation",
        MessageId: "47138184-6831-46b8-8f7c-afc488602d7d",
        Token: "2336412f37...",
        TopicArn: "arn:aws:sns:us-west-2:123456789012:MyTopic",
        Message:
            "You have chosen to deactivate subscription arn:aws:sns:us-west-2:123456789012:MyTopic:2bcfbf39-05c3-41de-beaa-fcfcc21c8f55.\nTo cancel this operation and restore the subscription, visit the SubscribeURL included in this message.",
        SubscribeURL:
            "https://sns.us-west-2.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:us-west-2:123456789012:MyTopic&Token=2336412f37fb6...",
        Timestamp: "2012-04-26T20:06:41.581Z",
        SignatureVersion: "1",
        Signature: "EXAMPLEHXgJm...",
        SigningCertURL:
            "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-f3ecfb7224c7233fe7bb5f59f96de52f.pem",
    };

    let spySave: any | null = null;
    beforeEach(() => {
        vi.spyOn(console, "log").mockImplementation(() => undefined);
        vi.spyOn(console, "error").mockImplementation(() => undefined);

        vi.mock("pg", () => {
            const mockClient = {
                release: vi.fn(),
                query: vi.fn(),
            };

            const mockPool = {
                connect: vi.fn(async () => mockClient),
            };

            return {
                Pool: vi.fn().mockImplementation(function () {
                    return mockPool;
                }),
            };
        });

        spySave = vi
            .spyOn(
                SaveIncomingWebhookEventService,
                "saveIncomingWebhookEventService",
            )
            .mockImplementation(async () => undefined);
    });

    afterEach(() => {
        vi.resetAllMocks();
        spySave = null;
    });

    it("SubscriptionConfirmation: Should persist only valid payload", async () => {
        const app: MainHono = new Hono();

        const webhook = app.basePath("/webhook");

        registerWebhookRoutes(webhook);

        const payload = {
            ...subscribePayload,
        };
        const response = await app.request(
            "/webhook/aws/ses/0ba971ed74210dad183e1d71d63c33",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
            env,
        );

        console.log(response.status, await response.text());
        // 1 call
        expect(spySave.mock.calls.length).toStrictEqual(1);
        // 2 params (context, params)
        expect(spySave.mock.calls[0].length).toStrictEqual(2);

        const params = spySave.mock.calls[0][1];
        expect(params.provider).toStrictEqual("aws_sns");
        expect(params.event_type).toStrictEqual("subscription_confirmation");
        expect(params.external_id).toStrictEqual(
            "165545c9-2a5c-472c-8df2-7ff2be2b3b1b",
        );
        expect(params.payload).toBeTruthy();
        expect(params.payload).toBeTypeOf("object");
        expect(Object.keys(params.payload).length).toStrictEqual(10);

        for (const key in subscribePayload) {
            if (!Object.hasOwn(subscribePayload, key)) continue;

            const originalValue = (subscribePayload as any)[key];
            expect(params.payload[key]).toStrictEqual(originalValue);
        }
    });

    it("SubscriptionConfirmation: Should only persist payload defined properties", async () => {
        const app: MainHono = new Hono();

        const webhook = app.basePath("/webhook");

        registerWebhookRoutes(webhook);

        const payload = {
            ...subscribePayload,
            _key_: "_value_",
        };
        const response = await app.request(
            "/webhook/aws/ses/0ba971ed74210dad183e1d71d63c33",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
            env,
        );

        console.log(response.status, await response.text());
        // 1 call
        expect(spySave.mock.calls.length).toStrictEqual(1);
        // 2 params (context, params)
        expect(spySave.mock.calls[0].length).toStrictEqual(2);

        const params = spySave.mock.calls[0][1];
        expect(params.provider).toStrictEqual("aws_sns");
        expect(params.event_type).toStrictEqual("subscription_confirmation");
        expect(params.external_id).toStrictEqual(
            "165545c9-2a5c-472c-8df2-7ff2be2b3b1b",
        );
        expect(params.payload).toBeTruthy();
        expect(params.payload).toBeTypeOf("object");

        expect(Object.keys(params.payload).length).toStrictEqual(10);
        expect("_key" in params.payload).toStrictEqual(false);
    });

    it("Notification: Should persist only valid payload", async () => {
        const app: MainHono = new Hono();

        const webhook = app.basePath("/webhook");

        registerWebhookRoutes(webhook);

        const payload = {
            ...notificationPayload,
        };
        const response = await app.request(
            "/webhook/aws/ses/0ba971ed74210dad183e1d71d63c33",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
            env,
        );

        console.log(response.status, await response.text());
        // 1 call
        expect(spySave.mock.calls.length).toStrictEqual(1);
        // 2 params (context, params)
        expect(spySave.mock.calls[0].length).toStrictEqual(2);

        const params = spySave.mock.calls[0][1];
        expect(params.provider).toStrictEqual("aws_sns");
        expect(params.event_type).toStrictEqual("notification");
        expect(params.external_id).toStrictEqual(payload.MessageId);

        expect(params.payload).toBeTruthy();
        expect(params.payload).toBeTypeOf("object");
        expect(Object.keys(params.payload).length).toStrictEqual(10);

        for (const key in notificationPayload) {
            if (!Object.hasOwn(notificationPayload, key)) continue;

            const originalValue = (notificationPayload as any)[key];
            expect(params.payload[key]).toStrictEqual(originalValue);
        }
    });

    it("UnsubscribeConfirmation: Should persist only valid payload", async () => {
        const app: MainHono = new Hono();

        const webhook = app.basePath("/webhook");

        registerWebhookRoutes(webhook);

        const payload = {
            ...unsubscribePayload,
        };
        const response = await app.request(
            "/webhook/aws/ses/0ba971ed74210dad183e1d71d63c33",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
            env,
        );

        console.log(response.status, await response.text());
        // 1 call
        expect(spySave.mock.calls.length).toStrictEqual(1);
        // 2 params (context, params)
        expect(spySave.mock.calls[0].length).toStrictEqual(2);

        const params = spySave.mock.calls[0][1];
        expect(params.provider).toStrictEqual("aws_sns");
        expect(params.event_type).toStrictEqual("unsubscribe_confirmation");
        expect(params.external_id).toStrictEqual(payload.MessageId);

        expect(params.payload).toBeTruthy();
        expect(params.payload).toBeTypeOf("object");
        expect(Object.keys(params.payload).length).toStrictEqual(10);

        for (const key in unsubscribePayload) {
            if (!Object.hasOwn(unsubscribePayload, key)) continue;

            const originalValue = (unsubscribePayload as any)[key];
            expect(params.payload[key]).toStrictEqual(originalValue);
        }
    });
});
