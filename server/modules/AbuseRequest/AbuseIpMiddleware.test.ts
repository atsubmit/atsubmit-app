import { Hono } from "hono";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IP_93_123_109_209 } from "./AbuseLog.utils.test";
import { AbuseIpMiddleware } from "./AbuseIpMiddleware";

describe("AbuseIpMiddleware", () => {
    let consoleLog = console.log;
    let consoleError = console.error;

    let spyConsoleLog = vi
        .spyOn(console, "log")
        .mockImplementation(() => undefined);
    let spyConsoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

    beforeEach(() => {
        spyConsoleLog = vi
            .spyOn(console, "log")
            .mockImplementation(() => undefined);
        spyConsoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("Should return Not Found for those abused ip", async () => {
        const envHeaders = {
            accept: "*/*",
            "accept-encoding": "gzip, br",
            "cf-connecting-ip": "93.123.109.209",
            "cf-ipcountry": "NL",
            "cf-ray": "9e190c79e91bfbdc",
            "cf-visitor": '{"scheme":"https"}',
            connection: "Keep-Alive",
            host: "app.atsubmit.com",
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
            "x-forwarded-proto": "https",
            "x-real-ip": "93.123.109.209",
        };

        const app = new Hono();
        app.use(AbuseIpMiddleware);
        app.get("/", (c) => c.html("ok", 200));

        const res = await app.request("/.env", {
            headers: envHeaders,
        });
        expect(res.status).toStrictEqual(404);
        expect(await res.text()).include("404 Not Found");

        const foundLog = spyConsoleLog.mock.calls.find((item) =>
            item.join("|").includes("AbuseIpMiddleware:ABUSED_IP"),
        );
        expect(foundLog).toBeTruthy();
    });

    it("Should return Not Found for all logged request", async () => {
        const app = new Hono();
        app.use(AbuseIpMiddleware);
        app.get("/", (c) => c.html("ok", 200));

        let inspected = 0;
        for (let index = 0; index < IP_93_123_109_209.length; index++) {
            const log = IP_93_123_109_209[index];
            const splitted = log.split(/\s/g);
            if (splitted.length < 5) {
                continue;
            }

            const [id, arrow, method, path, ...others] = splitted;
            const headers = JSON.parse(others.join(" "));
            console.log(headers);

            const res = await app.request("/.env", {
                headers: headers,
            });
            expect(
                res.status,
                `entry ${index + 1}: id=${id}, reason: http_status`,
            ).toStrictEqual(404);
            expect(
                await res.text(),
                `entry ${index + 1}: id=${id}, reason: http_response`,
            ).include("404 Not Found");

            inspected += 1;
        }

        expect(IP_93_123_109_209.length).toStrictEqual(inspected);
    });
});
