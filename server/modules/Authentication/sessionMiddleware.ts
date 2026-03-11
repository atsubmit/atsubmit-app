import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { Handler } from "hono/types";
import { validator } from "hono/validator";

import { MainEnv } from "@server/types";
import { CookiePayload } from "../Session/SessionTokenService";
import { getSessionCookie } from "../Session/CookieService";

export const sessionGuardMiddleware = (options: {
    requireSession: boolean;
    /**
     * - `string`: redirect to that route
     */
    handler?: string | Handler<MainEnv>;
}) => {
    return createMiddleware<MainEnv>(async (c, next) => {
        const required = options.requireSession;
        let payload: CookiePayload | null = null;
        try {
            payload = await getSessionCookie(c);
        } catch (error) {
            console.log(c.get("reqId"), "sessionGuardMiddleware", error);
        }

        let valid = false;

        if (required) {
            const sid = payload?.sid;
            if (sid) {
                valid = true;

                c.set("sid", sid);
            }
        } else {
            const sid = payload?.sid;
            if (!sid) {
                valid = true;
            }
        }

        if (!valid) {
            const handler = options?.handler;
            console.log(
                c.get("reqId"),
                "sessionGuardMiddleware",
                required,
                payload,
                !!handler,
            );

            try {
                if (handler) {
                    if (typeof handler === "string") {
                        return c.redirect(handler);
                    } else {
                        return handler(c, next);
                    }
                }
            } catch (error) {
                console.log(c.get("reqId"), "sessionGuardMiddleware", error);
            }

            throw new HTTPException(required ? 401 : 409);
        }

        return next();
    });
};

export const sessionRequiredMiddleware = (
    handler?: string | Handler<MainEnv>,
) => {
    return sessionGuardMiddleware({ requireSession: true, handler });
};

export const noSessionRequiredMiddleware = (
    handler?: string | Handler<MainEnv>,
) => {
    return sessionGuardMiddleware({ requireSession: false, handler });
};

export const sidEnsureValidator = validator("header", (value, c) => {
    const sid = c.get("sid");
    if (!sid) {
        return c.json({}, 401);
    }

    return {
        sid,
    };
});
