import { lazyPoolExecute } from "@server/db/pool";
import { MainContext } from "@server/types";
import { SubmissionPayload } from "./BodyParserService";

export const newSubmissionService = async (
    c: MainContext,
    data: {
        slugId: string;
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
            raw_headers,
            raw_body,
            payload
        )
        SELECT
            f.id,       -- get form_id from slug
            $2,
            $3,
            $4,
            $5::jsonb
        FROM forms f
        WHERE f.endpoint_slug = $1

        RETURNING id
	`;
    const params = [
        data.slugId,
        data.ipAddress,
        data.rawHeaders || null,
        data.rawBody || null,
        JSON.stringify(data.payload || null),
    ];
    const result = await lazyPoolExecute(c, async (client) => {
        return client.query<{ id: string }>(query, params);
    });

    return result.rows[0] || null;
};
