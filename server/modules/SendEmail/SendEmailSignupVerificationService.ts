import { signRequest } from "@atsubmit/cloudflare-sign";
import { MainContext } from "@server/types";

export const sendEmailSignupVerification = async (
    c: MainContext,
    data: { link: string; send_to: string },
) => {
    const signed = await signRequest({
        secret: c.env.MAIL_WORKER_CRYPTO_SECRET,
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        url: new URL("/mail/send/signup-verify", "https://email.worker.local"),
        body: JSON.stringify({
            link: data.link,
            send_to: data.send_to,
        }),
    });
    return c.env.ATSUBMIT_MAIL.fetch(signed.url, {
        method: signed.method,
        headers: signed.headers,
        body: signed.body,
    });
};
