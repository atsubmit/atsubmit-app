import { htmlPage } from "@server/utils/view";
import { validator } from "hono/validator";
import { z } from "zod";

export const verifyEmailSchema = z.object({
    token: z.string().min(1),
});

export const validateVerifyEmailQueryService = () =>
    validator("query", (query, c) => {
        const parsed = verifyEmailSchema.safeParse(query);
        if (!parsed.success) {
            return c.html(
                htmlPage(c, {
                    httpStatus: 401,
                }),
                401,
            );
        }

        return parsed.data;
    });
