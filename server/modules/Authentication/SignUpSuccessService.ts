import { MainContext } from "@server/types";
import { decrypt, encrypt } from "@server/utils/crypto";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { randomBytes } from "node:crypto";

export const setSignUpSuccessCookie = async (c: MainContext) => {
    const id = randomBytes(32).toString("hex");
    const value = await encrypt(id, c.env.SESSION_SECRET);
    setCookie(c, "signup_success", value, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
        maxAge: 5 * 60, // 5 minute (short-lived)
    });
};

export const hasSignUpSuccessCookie = async (c: MainContext) => {
    const raw = getCookie(c, "signup_success");
    if (!raw) {
        return false;
    }
    return await decrypt(raw, c.env.SESSION_SECRET);
};

export const resetSignUpSuccessCookie = (c: MainContext) => {
    deleteCookie(c, "signup_success", {
        path: "/",
    });
};
