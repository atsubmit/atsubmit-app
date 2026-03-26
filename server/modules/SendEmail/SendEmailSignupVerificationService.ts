import { MainContext } from "@server/types";
import { sendEmail } from "./SendEmailService";

export const sendEmailSignupVerification = async (
    c: MainContext,
    data: { link: string; send_to: string },
) => {
    return sendEmail(c, "/mail/send/ses-bounce", {
        link: data.link,
        send_to: data.send_to,
    });
};
