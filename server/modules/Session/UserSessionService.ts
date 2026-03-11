import { MainEnv } from "@server/types";
import { Context } from "hono";
import { User } from "../Authentication/User";
import { randomBytes } from "node:crypto";
import { getSessionService, saveSessionService } from "./sessionService";
import { CookiePayload, encryptSessionToken } from "./SessionTokenService";
import { getSessionCookie, setSessionCookie } from "./CookieService";

export const saveUserSessionService = async (
    c: Context<MainEnv>,
    user: User,
    options?: {
        remember?: boolean;
    },
) => {
    const now = Date.now();
    const sessionId = randomBytes(32).toString("base64url");

    await saveSessionService(
        c,
        sessionId,
        {
            user_id: user.id,
            user_email: user.email,

            ss_created_at: now,
            ss_updated_at: now,
        },
        {
            remember: !!options?.remember,
        },
    );

    const accessToken = await encryptSessionToken(c, {
        sid: sessionId,
    } satisfies CookiePayload);

    await setSessionCookie(c, accessToken);
};
