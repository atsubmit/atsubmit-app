import { Hono } from "hono";
import { logger } from "hono/logger";
import { contextStorage } from "hono/context-storage";
import { ApiHono, MainHono, WebApiHono, WebHono } from "@server/types";
import { htmlPage } from "@server/utils/view";
import {
    registerWebApiRoutes,
    registerWebRoutes,
} from "@server/handlers/web/routes";
import { registerApiRoutes } from "@server/handlers/api/routes";
import { setupApiRoutes } from "@server/handlers/api/setup";
import { setupWebApiRoutes, setupWebRoutes } from "@server/handlers/web/setup";
import { randomBytes } from "crypto";

const app: MainHono = new Hono();

// https://hono.dev/docs/middleware/builtin/context-storage
app.use(contextStorage());

app.use((c, next) => {
    const rid = randomBytes(8).toString("hex");
    c.set("start", Date.now());
    c.set("reqId", rid);

    const handler = logger((message: string, ...rest: string[]) => {
        if (message.startsWith("<--")) {
            console.log(rid, message, ...rest, JSON.stringify(c.req.header()));
        } else {
            console.log(rid, message, ...rest);
        }
    });

    return handler(c, next);
});

/**
 * 1. RESPONSE DATA (JSON) FOR VIEW
 */
const webApi: WebApiHono = app.basePath("/webapi");
setupWebApiRoutes(webApi);
registerWebApiRoutes(webApi);
webApi.all("*", async (c) => {
    return c.json(null, 404);
});

/**
 * 2. RESPONSE DATA (JSON) FOR API
 */
const api: ApiHono = app.basePath("/api");
setupApiRoutes(api);
registerApiRoutes(api);
api.all("*", async (c) => {
    return c.json(null, 404);
});

/**
 * 3. RESPONSE VIEW
 */
const web: WebHono = app.basePath("/");
setupWebRoutes(web);
registerWebRoutes(web);
web.all("*", async (c) => {
    return c.html(htmlPage(c, { httpStatus: 404 }));
});

export default app;
