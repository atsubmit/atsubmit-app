import crypto from "node:crypto";
import { SnsSignedPayload } from "./SesBounceBodyService";

export const isValidAwsSnsSignature = async (message: SnsSignedPayload) => {
    // Extract the certificate URL and signature
    const signingCertUrl = message.SigningCertURL;
    const signatureBase64 = message.Signature;

    // Fetch the certificate (in a Worker, use fetch instead of fs/curl)
    const certRes = await fetch(signingCertUrl);
    const certPem = await certRes.text();

    // Build the string to sign
    const fields: (keyof SnsSignedPayload)[] = [
        "Message",
        "MessageId",
        "Subject",
        "Timestamp",
        "TopicArn",
        "Type",
    ];
    let stringToSign = "";

    fields.forEach((field, i) => {
        if (message[field] !== undefined) {
            stringToSign += `${field}\n${message[field]}`;
            if (i !== fields.length - 1) stringToSign += "\n";
        }
    });

    // Verify the signature
    const verifier = crypto.createVerify("sha256");
    verifier.update(stringToSign);
    verifier.end();

    return verifier.verify(certPem, signatureBase64, "base64");
};
