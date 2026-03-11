import { MainEnv } from '@server/types';
import { Context } from 'hono';
import { isRecord } from '@server/utils/validate/object';
import { decrypt, encrypt } from '@server/utils/crypto';

export type CookiePayload = {
    sid: string; // sessionId
};

export const isCookiePayload = (v: unknown): v is CookiePayload => {
    return isRecord(v) && typeof v.sid === 'string';
};

export const encryptSessionToken = (
    c: Context<MainEnv>,
    payload: Record<string, unknown>
) => {
    return encrypt(JSON.stringify(payload), c.env.SESSION_SECRET);
};

export const decryptSessionToken = async (
    c: Context<MainEnv>,
    token: string
): Promise<Record<string, unknown> | null> => {
    const output = await decrypt(token, c.env.SESSION_SECRET);
    if (!output) {
        return null;
    }

    const payload = JSON.parse(output);
    if (!isRecord(payload)) {
        return null;
    }

    return payload;
};
