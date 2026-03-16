import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";
import { SubmissionPayload } from "./BodyParserService";

export const newSubmissionService = async (
    c: MainContext,
    data: {
        requestId: String;
        formId: string;
        ipAddress?: string | null;
        userAgent?: string | null;
        payload?: SubmissionPayload | null;
        rawHeaders?: string | null;
        rawBody?: string | null;
    },
) => {
    const query = `
                INSERT INTO submissions (
                form_id,
                ip_address,
                request_id,
                raw_headers,
                raw_body,
                payload
        )
        VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6::jsonb
        )

        RETURNING id
	`;
    const params = [
        data.formId,
        data.ipAddress,
        data.requestId,
        data.rawHeaders || null,
        data.rawBody || null,
        JSON.stringify(data.payload || null),
    ];
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<{ id: string }>(query, params);
    });

    return result.rows[0] || null;
};
