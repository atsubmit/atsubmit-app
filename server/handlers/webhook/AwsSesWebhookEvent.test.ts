import { env } from "cloudflare:workers";
import { afterEach, beforeEach, vi } from "vitest";
import { describe, expect, it } from "vitest";
import { Hono } from "hono";
import { registerWebhookRoutes } from "./routes";
import { MainHono } from "@server/types";
import * as SaveIncomingWebhookEventService from "@server/modules/AwsWebhook/SaveIncomingWebhookEventService";
import * as Db from "@server/db/pool";
import { awsSnsNotificationForSes } from "./AwsSesWebhookLog.utils.test";
import {
    AWS_SNS_WEBHOOK_EVENT_TYPE_SES_BOUNCE,
    AWS_SNS_WEBHOOK_EVENT_TYPE_SES_COMPLAINT,
    AWS_SNS_WEBHOOK_EVENT_TYPE_SES_DELIVERY,
    AWS_SNS_WEBHOOK_EVENT_TYPE_SES_REJECT,
    AWS_SNS_WEBHOOK_EVENT_TYPE_SES_SEND,
    AWS_SNS_WEBHOOK_EVENT_TYPE_SES_UNKNOWN,
} from "@server/modules/IncomingWebhookEvent";

describe("AWS_SES", () => {
    const consoleLog = console.log;
    const consoleError = console.error;

    let spySave: any | null = null;
    let spyDb: any | null = null;
    let spyConsoleLog: any | null = null;
    let spyConsoleError: any | null = null;
    beforeEach(() => {
        spyConsoleLog = vi
            .spyOn(console, "log")
            .mockImplementation(() => undefined);
        spyConsoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => undefined);

        spyDb = vi
            .spyOn(Db, "lazyPoolExecute")
            .mockImplementation(async (c: any, runner: any) => {
                const mockClientQuery = vi.fn().mockImplementation(async () => {
                    return {
                        command: "mock command",
                        rowCount: null,
                        oid: 123456789,
                        fields: ["mock field"],
                        rows: [],
                    };
                });
                const mockClient = {
                    release: vi.fn(),
                    query: mockClientQuery,
                };
                return runner(mockClient);
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
        spyDb = null;
    });

    it("Would persist all event", async () => {
        const app: MainHono = new Hono();

        const webhook = app.basePath("/webhook");

        registerWebhookRoutes(webhook);

        const nameMap: Record<string, string> = {
            Bounce: AWS_SNS_WEBHOOK_EVENT_TYPE_SES_BOUNCE,
            Complaint: AWS_SNS_WEBHOOK_EVENT_TYPE_SES_COMPLAINT,
            Delivery: AWS_SNS_WEBHOOK_EVENT_TYPE_SES_DELIVERY,
            Send: AWS_SNS_WEBHOOK_EVENT_TYPE_SES_SEND,
            Reject: AWS_SNS_WEBHOOK_EVENT_TYPE_SES_REJECT,
        };

        for (let index = 0; index < awsSnsNotificationForSes.length; index++) {
            const payload = awsSnsNotificationForSes[index];
            const response = await app.request(
                "/webhook/aws/ses/0ba971ed74210dad183e1d71d63c33",
                {
                    method: "POST",
                    body: JSON.stringify(payload),
                },
                env,
            );


            expect(response.status, `entry:${index + 1} http_status`).toEqual(
                200,
            );
            expect(
                await response.text(),
                `entry:${index + 1} http_response`,
            ).toEqual("null");

            // 1 call
            expect(
                spySave.mock.calls.length,
                `entry:${index + 1} http_save_params`,
            ).toStrictEqual(1);

            // 2 params (context, params)
            expect(
                spySave.mock.calls[0].length,
                `entry:${index + 1} http_save_param`,
            ).toStrictEqual(2);

            const params = spySave.mock.calls[0][1];
            // consoleLog(params)
            expect(
                params.provider,
                `entry:${index + 1} provider`,
            ).toStrictEqual("aws_sns");

            const event_type =
                nameMap[payload.eventType] ||
                AWS_SNS_WEBHOOK_EVENT_TYPE_SES_UNKNOWN;
            expect(
                params.event_type,
                `entry:${index + 1} event_type`,
            ).toStrictEqual(event_type);

            expect(
                params.external_id,
                `entry:${index + 1} external_id`,
            ).toStrictEqual(payload.mail.messageId);

            spySave.mockReset();
        }
    });
});
