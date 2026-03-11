import { validateLoginBodyService } from "@server/modules/Authentication/LoginBodyService";
import { matchLoginCredentailService } from "@server/modules/Authentication/LoginCredentialService";
import { noSessionRequiredMiddleware, sessionRequiredMiddleware } from "@server/modules/Authentication/sessionMiddleware";
import { validateSignUpBodyService } from "@server/modules/Authentication/SignUpBodyService";
import {
    emailSignupService,
    verifyCanSignUpWithEmail,
} from "@server/modules/Authentication/SignUpService";
import { deleteSessionCookie } from "@server/modules/Session/CookieService";
import { deleteSessionService } from "@server/modules/Session/SessionService";
import { saveUserSessionService } from "@server/modules/Session/UserSessionService";
import { WebHono, WebApiHono } from "@server/types";
import { htmlPage } from "@server/utils/view";

export const registerWebRoutes = (web: WebHono) => {
    web.get('/logout', sessionRequiredMiddleware('/login'), async (c) => {
        const sid = c.get('sid');
        if (sid) {
            await deleteSessionCookie(c);
            await deleteSessionService(c, sid);

            c.set('sid', '');
        }

        return c.redirect('/login');
    });

    web.get("/login", noSessionRequiredMiddleware(), async (c) => {
        return c.html(htmlPage(c, {}));
    });
    web.post(
        "/login",
        noSessionRequiredMiddleware(),
        validateLoginBodyService(),
        async (c) => {
            const form = c.req.valid("form");
            const user = await matchLoginCredentailService(c, {
                email: form.email,
                password: form.password,
            });

            if (user) {
                await saveUserSessionService(c, user);

                return c.redirect("/dashboard");
            }

            return c.html(
                htmlPage(c, {
                    context: {
                        email: form.email,
                    },
                }),
            );
        },
    );

    web.get("/signup", noSessionRequiredMiddleware(), async (c) => {
        return c.html(htmlPage(c, {}));
    });
    web.post(
        "/signup",
        noSessionRequiredMiddleware(),
        validateSignUpBodyService(),
        async (c) => {
            const form = c.req.valid("form");
            const canUse = await verifyCanSignUpWithEmail(c, form.email);
            if (!canUse) {
                return c.html(
                    htmlPage(c, {
                        context: {
                            error: "Email exist",
                        },
                    }),
                );
            }

            await emailSignupService(c, form);

            return c.html(
                htmlPage(c, {
                    context: {
                        email: form.email,
                    },
                }),
            );
        },
    );

    web.get("/forgot-password", async (c) => {
        return c.html(htmlPage(c, {}));
    });
    web.post("/forgot-password", async (c) => {
        return c.html(htmlPage(c, {}));
    });
    web.get("/reset-password", async (c) => {
        return c.html(htmlPage(c, {}));
    });
};

export const registerWebApiRoutes = (webApi: WebApiHono) => {};
