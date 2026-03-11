import { htmlPage } from "@server/utils/view";
import { zodErrorsToJson } from "@server/utils/zod/error";
import { validator } from "hono/validator";
import { z } from "zod";

export const signupSchema = z.object({
    email: z.email(),

    password: z.string().min(1),
});

export const validateSignUpBodyService = () =>
    validator("form", (form, c) => {
        const parsed = signupSchema.safeParse(form);
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
