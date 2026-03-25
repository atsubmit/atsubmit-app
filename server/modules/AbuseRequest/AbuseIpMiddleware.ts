import { createMiddleware } from "hono/factory";
import { ABUSE_100 } from "./AbuseIp";
import { getClientIp } from "@server/utils/request";
import { MainEnv } from "@server/types";

export const AbuseIpMiddleware = createMiddleware<MainEnv>(async (c, next) => {
    const rawIp = getClientIp(c);

    const forwarded = c.req.header("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || rawIp;

    if (!ip) {
        console.log(c.get("reqId"), "AbuseIpMiddleware:NO_IP");
        return next(); // don't block blindly
    }

    if (ABUSE_100.includes(ip)) {
        console.log(c.get("reqId"), "AbuseIpMiddleware:ABUSED_IP", ip);

        return c.notFound();
    }

    return next();
});
