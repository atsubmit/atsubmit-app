import { signRequest } from "@atsubmit/cloudflare-sign";
import { MainContext } from "@server/types";
import { randomBytes } from "node:crypto";

export const sendEmail = async (
    c: MainContext,
    path: string,
    data: Record<string, unknown>,
    options?: {
        reqId?: string;
    },
) => {
    const rid = randomBytes(8).toString("hex");
    console.log("[mail]<--", options?.reqId, rid, path);

    try {
        const signed = await signRequest({
            secret: c.env.MAIL_WORKER_CRYPTO_SECRET,
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            url: new URL(path, "https://email.worker.local"),
            body: JSON.stringify(data),
        });

        const response = await c.env.ATSUBMIT_MAIL.fetch(signed.url, {
            method: signed.method,
            headers: signed.headers,
            body: signed.body,
        });
        console.log("[mail]-->", rid, response.status);
        return response;
    } catch (error) {
        console.error("[mail]-->", rid, error);

        throw error;
    }
};
