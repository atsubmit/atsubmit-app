import app from "@server/index";
import { env } from "cloudflare:workers";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Example", () => {
    let consoleLog = console.log;
    let consoleError = console.error;

    const spyConsoleLog = vi
        .spyOn(console, "log")
        .mockImplementation(() => undefined);
    const spyConsoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => undefined);

    beforeEach(() => {
        env.APP_ENV = "production";
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("Should return 404 response with 404 view data", async () => {
        const res = await app.request("/this-path-is-not-exist", {}, env);
        expect(res.status).toStrictEqual(404);
        expect(await res.text()).include('data-status="404"');
    });
});
