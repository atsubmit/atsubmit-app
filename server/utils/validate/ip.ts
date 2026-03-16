import { z } from "zod";

const ipSchema = z.union([z.ipv4(), z.ipv6()]).nullable().optional();

export function validateIP(ip: string | null | undefined): string | null {
    if (!ip) {
        return null;
    }

    const result = ipSchema.safeParse(ip);

    if (!result.success) {
        return null;
    }

    return result.data || null;
}
