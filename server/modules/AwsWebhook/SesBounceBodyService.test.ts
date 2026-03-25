import { describe, expect, it } from "vitest";
import { SnsSubscriptionConfirmationSchema } from "./SesBounceBodyService";

describe("SnsSubscriptionConfirmationSchema", () => {
    const confirmPayload = {
        Type: "SubscriptionConfirmation",
        MessageId: "<message-id>",
        Token: "<confirm-token>",
        TopicArn: "<topic-arn>",
        Message:
            "You have chosen to subscribe to the topic <topic-arn>.\nTo confirm the subscription, visit the SubscribeURL included in this message.",
        SubscribeURL:
            "https://sns.us-east-1.amazonaws.com/?Action=ConfirmSubscription&TopicArn=<topic-arn>&Token=<confirm-token>",
        Timestamp: "2026-03-24T08:55:05.153Z",
        SignatureVersion: "1",
        Signature: "<signature>",
        SigningCertURL:
            "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-<pem-id>.pem",
    };

    it("Should parse confirm payload", () => {
        const payload = {
            ...confirmPayload,
        };
        const parsed = SnsSubscriptionConfirmationSchema.safeParse(payload);
        expect(parsed.success).toStrictEqual(true);
        expect(parsed.error).toBeFalsy();
        expect(parsed.data).toBeTypeOf("object");
        expect(parsed.data!.Type).toStrictEqual(payload.Type);
        expect(parsed.data!.MessageId).toStrictEqual(payload.MessageId);
        expect(parsed.data!.Token).toStrictEqual(payload.Token);
        expect(parsed.data!.TopicArn).toStrictEqual(payload.TopicArn);
        expect(parsed.data!.Message).toStrictEqual(payload.Message);
        expect(parsed.data!.Timestamp).toStrictEqual(payload.Timestamp);
        expect(parsed.data!.SignatureVersion).toStrictEqual(
            payload.SignatureVersion,
        );
        expect(parsed.data!.Signature).toStrictEqual(payload.Signature);
        expect(parsed.data!.SigningCertURL).toStrictEqual(
            payload.SigningCertURL,
        );
    });

    it("Should not parse missing confirm payload", () => {
        const payload = {
            Type: confirmPayload.Type,
        };

        const parsed = SnsSubscriptionConfirmationSchema.safeParse(payload);
        expect(parsed.success).toStrictEqual(false);
        expect(parsed.error).toBeTypeOf("object")
    });
});
