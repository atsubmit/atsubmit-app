import { lazyPoolExecute } from "@server/db/pool";
import { parseSubmission } from "@server/modules/ApiSubmission/BodyParserService";
import { sanitizeHeaders } from "@server/modules/ApiSubmission/HeaderParserService";
import { newSubmissionService } from "@server/modules/ApiSubmission/NewSubmissionService";
import { ApiHono } from "@server/types";
import { getClientIp } from "@server/utils/request";
import { validateIP } from "@server/utils/validate/ip";

export const registerApiRoutes = (api: ApiHono) => {
    api.get("now", async (c) => {
        const result = await lazyPoolExecute(c, (client) => {
            return client.query<{ now: string }>("SELECT NOW() as now");
        });
        return c.json(result.rows);
    });

    api.on(["GET", "POST"], "f/:id", async (c) => {
        const rawBody = await c.req.raw.clone().text();
        const data = await parseSubmission(c);
        const slugId = c.req.param("id");

        const rawHeaders = c.req.header();
        const headers = sanitizeHeaders(rawHeaders);
        const ip = getClientIp(c) || "";
        const safeIP = validateIP(ip) || "";

        const result = await newSubmissionService(c, {
            slugId: slugId,
            ipAddress: safeIP,
            payload: data || null,
            rawHeaders: JSON.stringify(headers.headers),
            rawBody: rawBody || null,
        });
        console.log(c.get("reqId"), result);

        if (result) {
            return c.json(
                {
                    id: result.id,
                },
                200,
            );
        } else {
            return c.json(null, 400);
        }
    });
};
