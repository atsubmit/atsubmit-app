import { validator } from "hono/validator";
import { z } from "zod";

export const emailListSchema = z
    .string()
    .transform((v) =>
        v
            .split(/\s*,\s*/)
            .map((s) => s.trim())
            .filter(Boolean),
    )
    .refine((emails) => emails.every((e) => z.email().safeParse(e).success), {
        message: "One or more email addresses are invalid.",
    });

export const updateNotificationSettingSchema = z.object({
    enabled: z
        .union([z.literal("on"), z.literal("true"), z.literal("1")])
        .optional()
        .transform((v) => !!v),

    "email-recipients": emailListSchema.optional(),
});

export const updateDefaultNotificationBodyService = () =>
    validator("form", (form, c) => {
        console.log("form", form);

        return updateNotificationSettingSchema.safeParse(form);
    });
