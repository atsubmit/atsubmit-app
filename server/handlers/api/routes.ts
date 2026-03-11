import { lazyPoolExecute } from "@server/db/pool";
import { ApiHono } from "@server/types";

export const registerApiRoutes = (api: ApiHono) => {
    api.get("now", async (c) => {
        const result = await lazyPoolExecute(c, (client) => {
            return client.query<{ now: string }>("SELECT NOW() as now");
        });
        return c.json(result.rows);
    });
};
