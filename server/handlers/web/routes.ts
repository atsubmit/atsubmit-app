import { validateForgotPasswordBodyService } from "@server/modules/Authentication/ForgotPasswordBodyService";
import {
    insertPasswordResetTokenRecord,
    verifyCanResetPassword,
} from "@server/modules/Authentication/ForgotPasswordService";
import { validateLoginBodyService } from "@server/modules/Authentication/LoginBodyService";
import { matchLoginCredentailService } from "@server/modules/Authentication/LoginCredentialService";
import { validateResetBodyService } from "@server/modules/Authentication/ResetPasswordBodyService";
import { validateResetPasswordQueryService } from "@server/modules/Authentication/ResetPasswordQueryService";
import {
    resetPasswordService,
    verifyCanResetPasswordWithEmail,
} from "@server/modules/Authentication/ResetPasswordService";
import {
    noSessionRequiredMiddleware,
    sessionRequiredMiddleware,
} from "@server/modules/Authentication/sessionMiddleware";
import { validateSignUpBodyService } from "@server/modules/Authentication/SignUpBodyService";
import {
    emailSignupService,
    verifyCanSignUpWithEmail,
} from "@server/modules/Authentication/SignUpService";
import { addDefaultDomainBodyService } from "@server/modules/DashboardDomainSettings/AddDefaultDomainBodyService";
import { addDefaultDomainService } from "@server/modules/DashboardDomainSettings/AddDefaultDomainService";
import { deleteDefaultDomainBodyService } from "@server/modules/DashboardDomainSettings/DeleteDefaultDomainBodyService";
import { deleteDefaultDomainService } from "@server/modules/DashboardDomainSettings/DeleteDefaultDomainService";
import { getDefaultDomainService } from "@server/modules/DashboardDomainSettings/GetDefaultDomainService";
import { NOTIFICATION_FREQUENT_RULES } from "@server/modules/DashboardNotificationSettings/GetDefaultNotificationFrequentRule";
import { getDefaultNotificationSetting } from "@server/modules/DashboardNotificationSettings/GetDefaultNotificationSetting";
import { updateDefaultNotificationBodyService } from "@server/modules/DashboardNotificationSettings/UpdateDefaultNotificationBodySetting";
import { upsertDefaultNotificationSetting } from "@server/modules/DashboardNotificationSettings/UpdateDefaultNotificationSetting";
import { defaultHoneypotSettingBodyService } from "@server/modules/DashboardProcessingSettings/DefaultHoneypotSettingsBodyService";
import {
    getDefaultHoneypotFormSetting,
    upsertUserHoneyPotSetting,
} from "@server/modules/DashboardProcessingSettings/DefaultHoneypotSettingsService";

import { validateProfileInfoBodyService } from "@server/modules/DashboardProfileSettings/ProfileInfoBodyService";
import {
    getProfileInfo,
    upsertProfileInfo,
} from "@server/modules/DashboardProfileSettings/ProfileInfoService";
import { SUPPORTED_TIMEZONE_OPTIONS } from "@server/modules/DashboardProfileSettings/SupportedTimezone";
import { deleteSessionCookie } from "@server/modules/Session/CookieService";
import {
    deleteSessionService,
    getSessionService,
} from "@server/modules/Session/SessionService";
import { saveUserSessionService } from "@server/modules/Session/UserSessionService";
import { WebHono, WebApiHono } from "@server/types";
import { htmlPage } from "@server/utils/view";
import { zodErrorsToJson } from "@server/utils/zod/error";
import { randomBytes } from "node:crypto";

export const registerWebRoutes = (web: WebHono) => {
    web.get("/logout", sessionRequiredMiddleware("/login"), async (c) => {
        try {
            const sid = c.get("sid");
            if (sid) {
                await deleteSessionCookie(c);
                await deleteSessionService(c, sid);

                c.set("sid", "");
            }
        } catch (error) {
            console.error(c.get("reqId"), error);
        }

        return c.redirect("/login");
    });

    web.get("/login", noSessionRequiredMiddleware("/dashboard"), async (c) => {
        return c.html(htmlPage(c, {}));
    });
    web.post(
        "/login",
        noSessionRequiredMiddleware("/dashboard"),
        validateLoginBodyService(),
        async (c) => {
            const form = c.req.valid("form");
            try {
                const user = await matchLoginCredentailService(c, {
                    email: form.email,
                    password: form.password,
                });
                if (user) {
                    await saveUserSessionService(c, user, {
                        remember: form.remember,
                    });

                    return c.redirect("/dashboard");
                }

                return c.html(
                    htmlPage(c, {
                        context: {
                            email: form.email,
                            error: "Incorrect username or password.",
                        },
                    }),
                );
            } catch (error) {
                console.error(c.get("reqId"), error);
                return c.html(
                    htmlPage(c, {
                        context: {
                            email: form.email,
                            error: "Something went wrong. Please try again later.",
                        },
                    }),
                );
            }
        },
    );

    web.get("/signup", noSessionRequiredMiddleware("/dashboard"), async (c) => {
        return c.html(htmlPage(c, {}));
    });
    web.post(
        "/signup",
        noSessionRequiredMiddleware("/dashboard"),
        validateSignUpBodyService(),
        async (c) => {
            const form = c.req.valid("form");
            try {
                const canUse = await verifyCanSignUpWithEmail(c, form.email);
                if (!canUse) {
                    return c.html(
                        htmlPage(c, {
                            context: {
                                error: "This email is already registered.",
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
            } catch (error) {
                console.error(c.get("reqId"), error);
                return c.html(
                    htmlPage(c, {
                        context: {
                            email: form.email,
                            error: "Something went wrong. Please try again later.",
                        },
                    }),
                );
            }
        },
    );

    web.get("/forgot-password-submitted", async (c) => {
        return c.html(htmlPage(c, {}));
    });
    web.get("/forgot-password", async (c) => {
        return c.html(htmlPage(c, {}));
    });
    web.post(
        "/forgot-password",
        validateForgotPasswordBodyService(),
        async (c) => {
            try {
                const form = c.req.valid("form");
                const canUse = await verifyCanResetPassword(c, form.email);
                if (canUse) {
                    const token = randomBytes(32).toString("hex");
                    const url = new URL(
                        "reset-password",
                        c.env.APP_PUBLIC_ENDPOINT,
                    );
                    url.searchParams.set("token", token);

                    await insertPasswordResetTokenRecord(c, {
                        email: form.email,
                        token: token,
                    });

                    console.log("========================");
                    console.log("RESET URL", url.toString());
                    console.log("========================");
                }

                return c.redirect("/forgot-password-submitted");
            } catch (error) {
                console.error(c.get("reqId"), error);

                return c.html(htmlPage(c, { httpStatus: 500 }));
            }
        },
    );

    web.get("/reset-password-used", async (c) => {
        return c.html(htmlPage(c, {}));
    });
    web.get(
        "/reset-password",
        validateResetPasswordQueryService(),
        async (c) => {
            const query = c.req.valid("query");
            const user = await verifyCanResetPasswordWithEmail(c, query.token);
            if (!user) {
                return c.redirect("/reset-password-used");
            }

            return c.html(
                htmlPage(c, {
                    context: {
                        email: user.email,
                    },
                }),
            );
        },
    );
    web.post("/reset-password", validateResetBodyService(), async (c) => {
        const form = c.req.valid("form");
        const user = await verifyCanResetPasswordWithEmail(c, form.token);
        if (!user) {
            return c.redirect("/reset-password-used");
        }

        await resetPasswordService(c, {
            password: form.password,
            user_id: user.id,
        });

        return c.redirect("/reset-password-success");
    });

    const dashboard = web.basePath("/dashboard");
    dashboard.use("*", sessionRequiredMiddleware("/login"));
    dashboard.get("/", async (c) => {
        return c.html(htmlPage(c, {}));
    });
    dashboard.get("/forms", async (c) => {
        return c.html(htmlPage(c));
    });
    dashboard.get("/forms/new", async (c) => {
        return c.html(htmlPage(c));
    });
    dashboard.get("/submissions", async (c) => {
        return c.html(htmlPage(c, {}));
    });
    dashboard.get("/settings", async (c) => {
        return c.html(htmlPage(c, {}));
    });
    dashboard.get("/settings/profile", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const info = await getProfileInfo(c, session.user_email);

        return c.html(
            htmlPage(c, {
                context: {
                    name: info?.display_name || "",
                    email: info?.email || session.user_email,
                    timezones: SUPPORTED_TIMEZONE_OPTIONS,
                    timezone: info?.timezone || "",
                },
            }),
        );
    });
    dashboard.post(
        "/settings/profile",
        validateProfileInfoBodyService(),
        async (c) => {
            const sid = c.get("sid") || "";
            const session = await getSessionService(c, sid);
            if (!session) {
                return c.html(
                    htmlPage(c, {
                        httpStatus: 401,
                    }),
                );
            }

            const form = c.req.valid("form");
            if (!form.error) {
                await upsertProfileInfo(c, {
                    user_id: session.user_id,
                    name: form.data.name,
                    timezone: form.data.timezone,
                });
            }

            const info = await getProfileInfo(c, session.user_email);
            return c.html(
                htmlPage(c, {
                    context: {
                        name: info?.display_name || "",
                        email: info?.email || session.user_email,
                        timezones: SUPPORTED_TIMEZONE_OPTIONS,
                        timezone: info?.timezone || "",
                        error: form.error
                            ? zodErrorsToJson(form.error)
                            : undefined,
                    },
                }),
            );
        },
    );

    dashboard.get("/settings/processing", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const setting = await getDefaultHoneypotFormSetting(c, session.user_id);
        return c.html(
            htmlPage(c, {
                context: setting
                    ? {
                          enabled: !!setting.default_honeypot_enabled,
                          name: setting.default_honeypot_input_name || "",
                          hiddenStyle:
                              setting.default_honeypot_hidden_style || "",
                          hiddenClassName:
                              setting.default_honeypot_class_name || "",
                      }
                    : {
                          enabled: false,
                      },
            }),
        );
    });
    dashboard.post(
        "/settings/processing",
        defaultHoneypotSettingBodyService(),
        async (c) => {
            const sid = c.get("sid") || "";
            const session = await getSessionService(c, sid);
            if (!session) {
                return c.html(
                    htmlPage(c, {
                        httpStatus: 401,
                    }),
                );
            }

            const form = c.req.valid("form");
            if (!form.error) {
                await upsertUserHoneyPotSetting(
                    c,
                    !!form.data.enabled
                        ? {
                              user_id: session.user_id,
                              enabled: form.data.enabled,
                              name: form.data.name,
                              hiddenStyle: form.data["hidden-style"],
                              hiddenClassName: form.data["hidden-classname"],
                          }
                        : {
                              user_id: session.user_id,
                              enabled: form.data.enabled,
                          },
                );
            }

            const setting = await getDefaultHoneypotFormSetting(
                c,
                session.user_id,
            );
            return c.html(
                htmlPage(c, {
                    context: setting
                        ? {
                              enabled: !!setting.default_honeypot_enabled,
                              name: setting.default_honeypot_input_name || "",
                              hiddenStyle:
                                  setting.default_honeypot_hidden_style || "",
                              hiddenClassName:
                                  setting.default_honeypot_class_name || "",
                              error: form.error
                                  ? zodErrorsToJson(form.error)
                                  : null,
                          }
                        : {
                              enabled: false,
                              error: form.error
                                  ? zodErrorsToJson(form.error)
                                  : null,
                          },
                }),
            );
        },
    );
    dashboard.get("/settings/domains", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }
        const result = await getDefaultDomainService(c, session.user_id);
        return c.html(
            htmlPage(c, {
                context: {
                    allowed: result?.default_allowed_domains || [],
                    disallowed: result?.default_disallowed_domains || [],
                },
            }),
        );
    });
    dashboard.get("/settings/notifications", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const result = await getDefaultNotificationSetting(c, session.user_id);
        return c.html(
            htmlPage(c, {
                context: result
                    ? {
                          rules: NOTIFICATION_FREQUENT_RULES,
                          enabled: !!result.default_notification_enabled,
                          method: "email",
                          frequency: "weekly",
                          email_owner: session.user_email,
                          email_recipients:
                              result.default_notification_email_recipients,
                      }
                    : {
                          rules: NOTIFICATION_FREQUENT_RULES,
                          enabled: false,
                      },
            }),
        );
    });
    dashboard.post(
        "/settings/notifications",
        updateDefaultNotificationBodyService(),
        async (c) => {
            const sid = c.get("sid") || "";
            const session = await getSessionService(c, sid);
            if (!session) {
                return c.html(
                    htmlPage(c, {
                        httpStatus: 401,
                    }),
                );
            }

            const form = await c.req.valid("form");
            if (!form.error) {
                await upsertDefaultNotificationSetting(c, {
                    user_id: session.user_id,
                    enabled: form.data.enabled,
                    via_email: true,
                    frequency: "weekly",
                    email_recipients: form.data["email-recipients"],
                });
            }

            const result = await getDefaultNotificationSetting(
                c,
                session.user_id,
            );
            return c.html(
                htmlPage(c, {
                    context: result
                        ? {
                              rules: NOTIFICATION_FREQUENT_RULES,
                              enabled: !!result.default_notification_enabled,
                              method: "email",
                              frequency: "weekly",
                              email_owner: session.user_email,
                              email_recipients:
                                  result.default_notification_email_recipients,
                              error: form.error
                                  ? zodErrorsToJson(form.error)
                                  : null,
                          }
                        : {
                              rules: NOTIFICATION_FREQUENT_RULES,
                              enabled: false,
                              error: form.error
                                  ? zodErrorsToJson(form.error)
                                  : null,
                          },
                }),
            );
        },
    );
};

export const registerWebApiRoutes = (webApi: WebApiHono) => {
    const dashboard = webApi.basePath("/dashboard");
    dashboard.use("*", sessionRequiredMiddleware("/login"));
    dashboard.put(
        "/settings/domains",
        addDefaultDomainBodyService(),
        async (c) => {
            const sid = c.get("sid") || "";
            const session = await getSessionService(c, sid);
            if (!session) {
                return c.html(
                    htmlPage(c, {
                        httpStatus: 401,
                    }),
                );
            }

            const form = c.req.valid("json");
            const allow = form.allow;
            const disallow = form.disallow;
            const result = await addDefaultDomainService(c, {
                user_id: session.user_id,
                allow: allow,
                disallow: disallow,
            });
            return c.json({
                allowed: result.default_allowed_domains,
                disallowed: result.default_disallowed_domains,
            });
        },
    );
    dashboard.delete(
        "/settings/domains",
        deleteDefaultDomainBodyService(),
        async (c) => {
            const sid = c.get("sid") || "";
            const session = await getSessionService(c, sid);
            if (!session) {
                return c.html(
                    htmlPage(c, {
                        httpStatus: 401,
                    }),
                );
            }

            const form = c.req.valid("json");
            const allow = form.allow;
            const disallow = form.disallow;
            const result = await deleteDefaultDomainService(c, {
                user_id: session.user_id,
                allow: allow,
                disallow: disallow,
            });
            return c.json({
                allowed: result.default_allowed_domains,
                disallowed: result.default_disallowed_domains,
            });
        },
    );
};
