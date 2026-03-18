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
import { addFormDomainBodyService } from "@server/modules/DashboardForm/AddFormDomainBodyService";
import { addFormDomainService } from "@server/modules/DashboardForm/AddFormDomainService";
import { createNewFormBodyService } from "@server/modules/DashboardForm/CreateNewFormBodyService";
import {
    createSubmissionEndpoint,
    quickCreateNewFormService,
} from "@server/modules/DashboardForm/CreateNewFormService";
import { deleteFormDomainService } from "@server/modules/DashboardForm/DeleteFormDomainService";
import { getFormDomainService } from "@server/modules/DashboardForm/GetFormDomainService";
import { getFormGeneralSetting } from "@server/modules/DashboardForm/getFormGeneralSettingService";
import { getFormNotificationSetting } from "@server/modules/DashboardForm/GetFormNotificationSetting";
import { paginateForm } from "@server/modules/DashboardForm/getFormService";
import { honeypotFormSettingBodyService } from "@server/modules/DashboardForm/HoneypotFormSettingsBodyService";
import {
    getHoneypotFormSetting,
    updateHoneyPotFormSetting,
} from "@server/modules/DashboardForm/HoneypotFormSettingsService";
import {
    createRandomSlug,
    createRandomToken,
    refreshSubmitToken,
} from "@server/modules/DashboardForm/RefreshSubmitTokenService";
import { validateFormGeneralSettingService } from "@server/modules/DashboardForm/UpdateFormGeneralSettingBodyService";
import { updateFormGeneralSettingService } from "@server/modules/DashboardForm/UpdateFormGeneralSettingService";
import { updateFormNotificationBodyService } from "@server/modules/DashboardForm/UpdateFormNotificationBodySetting";
import { updateFormNotificationSetting } from "@server/modules/DashboardForm/UpdateFormNotificationSetting";
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
import {
    getSubmission,
    paginateSubmission,
} from "@server/modules/DashboardSubmissions/GetSubmissionsService";
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
                    console.log(c.env.APP_PUBLIC_ENDPOINT);
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

    web.get("/reset-password-success", async (c) => {
        return c.html(htmlPage(c, {}));
    });
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
    dashboard.get("/form/:slug", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const slug = c.req.param("slug");
        return c.redirect(`/dashboard/form/${slug || ""}/general`);
    });
    dashboard.get("/form/:slug/general", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const slug = c.req.param("slug");
        const setting = await getFormGeneralSetting(c, {
            user_id: session.user_id,
            slug: slug,
        });
        if (!setting) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 404,
                }),
            );
        }

        return c.html(
            htmlPage(c, {
                context: {
                    slug: slug,
                    endpointUrl: createSubmissionEndpoint(
                        c,
                        setting.endpoint_slug,
                    ),
                    name: setting.name || "",
                    isActive: !!setting.is_active,
                    submitToken: setting.submit_token,

                    error: undefined,
                },
            }),
        );
    });
    dashboard.post(
        "/form/:slug/general",
        validateFormGeneralSettingService(),
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

            const slug = c.req.param("slug");
            const form = c.req.valid("form");
            if (!form.error) {
                await updateFormGeneralSettingService(c, {
                    user_id: session.user_id,
                    slug: slug,
                    ...(form.data.active
                        ? {
                              isActive: true,
                              name: form.data.name,
                          }
                        : {
                              isActive: false,
                          }),
                });
            }

            const setting = await getFormGeneralSetting(c, {
                user_id: session.user_id,
                slug: slug,
            });
            if (!setting) {
                return c.html(
                    htmlPage(c, {
                        httpStatus: 404,
                    }),
                );
            }

            return c.html(
                htmlPage(c, {
                    context: {
                        slug: slug,
                        endpointUrl: createSubmissionEndpoint(
                            c,
                            setting.endpoint_slug,
                        ),
                        name: setting.name || "",
                        isActive: !!setting.is_active,
                        submitToken: setting.submit_token,

                        error: form.error
                            ? zodErrorsToJson(form.error)
                            : undefined,
                    },
                }),
            );
        },
    );

    dashboard.get("/form/:slug/processing", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const slug = c.req.param("slug");
        const setting = await getHoneypotFormSetting(c, {
            user_id: session.user_id,
            slug: slug,
        });
        if (!setting) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        return c.html(
            htmlPage(c, {
                context: {
                    slug: slug,
                    enabled: !!setting.honeypot_enabled,
                    name: setting.honeypot_input_name || "",
                    hiddenStyle: setting.honeypot_hidden_style || "",
                    hiddenClassName: setting.honeypot_class_name || "",
                },
            }),
        );
    });
    dashboard.post(
        "/form/:slug/processing",
        honeypotFormSettingBodyService(),
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

            const slug = c.req.param("slug");
            const form = c.req.valid("form");
            if (!form.error) {
                await updateHoneyPotFormSetting(
                    c,
                    !!form.data.enabled
                        ? {
                              user_id: session.user_id,
                              slug: slug,

                              enabled: form.data.enabled,
                              name: form.data.name,
                              hiddenStyle: form.data["hidden-style"],
                              hiddenClassName: form.data["hidden-classname"],
                          }
                        : {
                              user_id: session.user_id,
                              slug: slug,

                              enabled: form.data.enabled,
                          },
                );
            }

            const setting = await getHoneypotFormSetting(c, {
                user_id: session.user_id,
                slug: slug,
            });
            if (!setting) {
                return c.html(
                    htmlPage(c, {
                        httpStatus: 401,
                    }),
                );
            }

            return c.html(
                htmlPage(c, {
                    context: {
                        slug: slug,
                        enabled: !!setting.honeypot_enabled,
                        name: setting.honeypot_input_name || "",
                        hiddenStyle: setting.honeypot_hidden_style || "",
                        hiddenClassName: setting.honeypot_class_name || "",
                    },
                }),
            );
        },
    );

    dashboard.get("/form/:slug/domains", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }
        const slug = c.req.param("slug");
        const result = await getFormDomainService(c, {
            user_id: session.user_id,
            slug: slug,
        });
        return c.html(
            htmlPage(c, {
                context: {
                    slug: slug,
                    allowed: result?.allowed_domains || [],
                    disallowed: result?.disallowed_domains || [],
                },
            }),
        );
    });

    dashboard.get("/form/:slug/notifications", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const slug = c.req.param("slug");
        const result = await getFormNotificationSetting(c, {
            user_id: session.user_id,
            slug: slug,
        });
        return c.html(
            htmlPage(c, {
                context: result
                    ? {
                          slug: slug,
                          rules: NOTIFICATION_FREQUENT_RULES,
                          enabled: !!result.notification_enabled,
                          method: "email",
                          frequency: "weekly",
                          email_owner: session.user_email,
                          email_recipients:
                              result.notification_email_recipients,
                      }
                    : {
                          slug: slug,
                          rules: NOTIFICATION_FREQUENT_RULES,
                          enabled: false,
                      },
            }),
        );
    });
    dashboard.post(
        "/form/:slug/notifications",
        updateFormNotificationBodyService(),
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

            const slug = c.req.param("slug");
            const form = await c.req.valid("form");
            if (!form.error) {
                await updateFormNotificationSetting(c, {
                    user_id: session.user_id,
                    slug: slug,
                    enabled: form.data.enabled,
                    via_email: true,
                    frequency: "weekly",
                    email_recipients: form.data["email-recipients"],
                });
            }

            const result = await getFormNotificationSetting(c, {
                user_id: session.user_id,
                slug: slug,
            });
            return c.html(
                htmlPage(c, {
                    context: result
                        ? {
                              slug: slug,
                              rules: NOTIFICATION_FREQUENT_RULES,
                              enabled: !!result.notification_enabled,
                              method: "email",
                              frequency: "weekly",
                              email_owner: session.user_email,
                              email_recipients:
                                  result.notification_email_recipients,
                          }
                        : {
                              slug: slug,
                              rules: NOTIFICATION_FREQUENT_RULES,
                              enabled: false,
                          },
                }),
            );
        },
    );

    dashboard.get("/forms", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const result = await paginateForm(c, {
            user_id: session.user_id,
            page: 1,
            limit: 10,
        });

        return c.html(
            htmlPage(c, {
                context: {
                    items: result.items,
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                },
            }),
        );
    });
    dashboard.get("/forms/new", async (c) => {
        return c.html(htmlPage(c));
    });
    dashboard.post("/forms/new", createNewFormBodyService(), async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const token = createRandomToken();
        const slug = createRandomSlug();
        const form = c.req.valid("form");

        const result = await quickCreateNewFormService(c, {
            user_id: session.user_id,
            name: form.name,
            slug: slug,
            token: token,
        });
        console.log("result", result);

        return c.redirect("/dashboard/forms");
    });
    dashboard.get("/submissions", (c) => {
        return c.html(htmlPage(c, {}));
    });
    dashboard.get("/submission/:id", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const result = await getSubmission(c, {
            user_id: session.user_id,
            id: c.req.param("id"),
        });

        if (!result) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 404,
                }),
            );
        }

        return c.html(
            htmlPage(c, {
                context: {
                    submission: result,
                },
            }),
        );
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

    dashboard.post("/form/:slug/submit_token", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
            );
        }

        const token = createRandomToken();
        await refreshSubmitToken(c, {
            user_id: session.user_id,
            slug: c.req.param("slug"),
            token: token,
        });

        return c.json({
            token: token,
        });
    });

    dashboard.put(
        "/form/:slug/domains",
        addFormDomainBodyService(),
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
            const result = await addFormDomainService(c, {
                user_id: session.user_id,
                slug: c.req.param("slug"),
                allow: allow,
                disallow: disallow,
            });
            return c.json({
                allowed: result.allowed_domains,
                disallowed: result.disallowed_domains,
            });
        },
    );
    dashboard.delete(
        "/form/:slug/domains",
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
            const result = await deleteFormDomainService(c, {
                user_id: session.user_id,
                slug: c.req.param("slug"),
                allow: allow,
                disallow: disallow,
            });
            return c.json({
                allowed: result.default_allowed_domains,
                disallowed: result.default_disallowed_domains,
            });
        },
    );

    dashboard.get("/submissions", async (c) => {
        const sid = c.get("sid") || "";
        const session = await getSessionService(c, sid);
        if (!session) {
            return c.json(null, 401);
        }

        const list = await paginateSubmission(c, {
            user_id: session.user_id,
            page: 1,
            limit: 10,
        });

        return c.json({
            items: list.items,
            total: list.total,
            page: list.page,
            limit: list.limit,
        });
    });
};
