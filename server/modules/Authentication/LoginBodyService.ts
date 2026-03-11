import { htmlPage } from "@server/utils/view";
import { zodErrorsToJson } from "@server/utils/zod/error";
import { validator } from "hono/validator";
import { z } from "zod";

export const loginSchema = z.object({
    email: z.email(),

    password: z.string().min(1),

    remember: z
        .union([z.literal("on"), z.literal("true"), z.literal("1")])
        .optional()
        .transform((v) => !!v),
});

export const validateLoginBodyService = () =>
    validator("form", (form, c) => {
        const parsed = loginSchema.safeParse(form);
        if (!parsed.success) {
            return c.html(
                htmlPage(c, {
                    context: {
                        email: form.email,
                        error: zodErrorsToJson(parsed.error),
                    },
                }),
            );
        }

        return parsed.data;
    });
