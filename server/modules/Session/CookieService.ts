import { Context } from "hono";
import { deleteCookie, setCookie, getCookie } from "hono/cookie";
import { CookieOptions } from "hono/utils/cookie";
import {
    CookiePayload,
    decryptSessionToken,
    isCookiePayload,
} from "./SessionTokenService";
import { MainEnv } from "@server/types";

export const getAppCookieName = (
    c: Context<MainEnv>,
    postfix: string,
): string => {
    const env = c.env.APP_ENV || "";
    const sessionName = c.env.APP_SESSION_NAME || "atsubmit";
    return [sessionName, env, postfix].join("_").toLowerCase();
};

export type SessionCookieOverrides = Pick<
    CookieOptions,
    "maxAge" | "expires" | "sameSite"
>;

export const setSessionCookie = async (
    c: Context<MainEnv>,
    token: string,
    options?: SessionCookieOverrides,
) => {
    const sessionName = getAppCookieName(c, "ss");

    // __Secure-access
    await setCookie(c, sessionName, token, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "Lax",
        domain: c.env.APP_SESSION_DOMAIN || undefined,

        ...options, // SAFE overrides only
    });
};

export const deleteSessionCookie = async (c: Context<MainEnv>) => {
    const sessionName = getAppCookieName(c, "ss");

    // __Secure-access
    await deleteCookie(c, sessionName, {
        secure: true,
        path: "/",
        domain: c.env.APP_SESSION_DOMAIN,
    });
};

export const getSessionCookie = async (
    c: Context<MainEnv>,
): Promise<CookiePayload | null> => {
    const sessionName = getAppCookieName(c, "ss");
    if (!sessionName) {
        return null;
    }

    const token = getCookie(c, sessionName);
    if (!token) {
        return null;
    }

    const payload = await decryptSessionToken(c, token);
    if (!payload) {
        return null;
    }

    if (!isCookiePayload(payload)) {
        return null;
    }

    return payload;
};
