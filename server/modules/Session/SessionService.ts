import { MainEnv } from "@server/types";
import { isRecord } from "@server/utils/validate/object";
import { Context } from "hono";

export interface AppSession {
    user_id: string;
    user_email: string;

    ss_created_at: number;
    ss_updated_at: number;
}

export const isAppSession = (ss: unknown): ss is AppSession => {
    return (
        isRecord(ss) &&
        "user_id" in ss &&
        !!ss.user_id &&
        "user_email" in ss &&
        !!ss.user_email
    );
};

export const saveSessionService = async (
    c: Context<MainEnv>,
    sessionId: string,
    session: AppSession,
    options?: {
        remember?: boolean;
    },
) => {
    console.log("saveSession", sessionId, options);
    await c.env.KV.put(`ss:${sessionId}`, JSON.stringify(session), {
        expirationTtl: options?.remember ? undefined : 24 * 3600,
    });
};

export const getSessionService = async (
    c: Context<MainEnv>,
    sessionId: string,
) => {
    console.log("getSession", sessionId);
    const stub = await c.env.KV.get(`ss:${sessionId}`);
    const session = stub ? JSON.parse(stub) : null;

    if (!isAppSession(session)) {
        return null;
    }

    return session;
};

export const deleteSessionService = async (
    c: Context<MainEnv>,
    sessionId: string,
) => {
    console.log("deleteSession", sessionId);
    await c.env.KV.delete(`ss:${sessionId}`);
};
