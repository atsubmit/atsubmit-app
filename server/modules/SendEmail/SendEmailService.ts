import { signRequest } from "@atsubmit/cloudflare-sign";
import { MainContext } from "@server/types";

export const sendEmail = async (
    c: MainContext,
    path: string,
    data: Record<string, unknown>,
) => {
    const signed = await signRequest({
        secret: c.env.MAIL_WORKER_CRYPTO_SECRET,
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        url: new URL(path, "https://email.worker.local"),
        body: JSON.stringify(data),
    });
    return c.env.ATSUBMIT_MAIL.fetch(signed.url, {
        method: signed.method,
        headers: signed.headers,
        body: signed.body,
    });
};
