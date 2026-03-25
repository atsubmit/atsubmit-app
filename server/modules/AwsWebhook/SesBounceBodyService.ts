import z from "zod";

export interface SnsSignedPayload {
    Type: string;
    Message: string;
    MessageId: string;
    Subject?: string;

    TopicArn: string;
    Timestamp: string;

    Signature: string;
    SignatureVersion: string;
    SigningCertURL: string;
}

/**
 * https://docs.aws.amazon.com/sns/latest/dg/http-subscription-confirmation-json.html
 */
export interface SnsSubscriptionConfirmationPayload extends SnsSignedPayload {
    Token: string;
    SubscribeURL: string;
}
/**
 * https://docs.aws.amazon.com/sns/latest/dg/http-unsubscribe-confirmation-json.html
 */
export interface SnsUnsubscriptionConfirmationPayload extends SnsSignedPayload {
    Token: string;
    SubscribeURL: string;
}

/**
 * https://docs.aws.amazon.com/sns/latest/dg/http-notification-json.html
 */
export interface SnsNotificationPayload extends SnsSignedPayload {
    Subject: string;

    UnsubscribeURL: string;
}

export const SnsSignedPayloadSchema = z.object({
    Type: z.string(),
    Message: z.string(),
    MessageId: z.string(),
    /**
     * https://docs.aws.amazon.com/sns/latest/dg/sns-verify-signature-of-message-verify-message-signature.html
     */
    Subject: z.string().optional(),

    TopicArn: z.string(),
    Timestamp: z.iso.datetime(),

    Signature: z.string(),
    SignatureVersion: z.string(),
    SigningCertURL: z.url(),
});

export const SnsSubscriptionConfirmationSchema = SnsSignedPayloadSchema
    //
    .safeExtend({
        Type: z.enum(["SubscriptionConfirmation"]),
        Token: z.string(),
        SubscribeURL: z.url(),
    });

export const SnsUnsubscriptionConfirmationSchema = SnsSignedPayloadSchema
    //
    .safeExtend({
        Type: z.enum(["UnsubscribeConfirmation"]),
        Token: z.string(),
        SubscribeURL: z.url(),
    });

export const SnsNotificationPayloadSchema = SnsSignedPayloadSchema
    //
    .safeExtend({
        Type: z.enum(["Notification"]),
        Subject: z.string(),
        UnsubscribeURL: z.url(),
    });
