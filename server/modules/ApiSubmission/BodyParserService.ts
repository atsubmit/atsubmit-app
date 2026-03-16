import { MainContext } from "@server/types";

type Primitive = string | number | boolean | null;

export type SubmissionPayload =
    | Primitive
    | Primitive[]
    | Record<string, Primitive | Primitive[]>;

export const normalizePrimitive = (value: unknown): Primitive => {
    if (value === null || value === undefined) return null;

    if (typeof value === "number" || typeof value === "boolean") {
        return value;
    }

    if (typeof value !== "string") {
        return null;
    }

    const v = value.trim();

    if (v === "") return null;

    if (v === "true") return true;
    if (v === "false") return false;

    const n = Number(v);
    if (!Number.isNaN(n) && v.match(/^-?\d+(\.\d+)?$/)) {
        return n;
    }

    return v;
};

export const sanitizeJson = (input: unknown): SubmissionPayload | null => {
    if (input === null) return null;

    if (
        typeof input === "string" ||
        typeof input === "number" ||
        typeof input === "boolean"
    ) {
        return null;
    }

    if (Array.isArray(input)) {
        const arr: Primitive[] = [];

        for (const v of input) {
            if (
                typeof v === "string" ||
                typeof v === "number" ||
                typeof v === "boolean" ||
                v === null
            ) {
                arr.push(v);
            }
        }

        return arr;
    }

    if (typeof input === "object") {
        const out: Record<string, Primitive | Primitive[]> = {};

        for (const [k, v] of Object.entries(input)) {
            if (Array.isArray(v)) {
                const arr: Primitive[] = [];

                for (const item of v) {
                    if (
                        typeof item === "string" ||
                        typeof item === "number" ||
                        typeof item === "boolean" ||
                        item === null
                    ) {
                        arr.push(item);
                    }
                }

                out[k] = arr;
            } else if (
                typeof v === "string" ||
                typeof v === "number" ||
                typeof v === "boolean" ||
                v === null
            ) {
                out[k] = v;
            }
        }

        return out;
    }

    return null;
};

export const parseFormData = async (form: FormData) => {
    const data: Record<string, Primitive | Primitive[]> = {};

    for (const key of form.keys()) {
        const values = form.getAll(key);

        const primitives: Primitive[] = [];

        for (const v of values) {
            if (typeof v === "string") {
                primitives.push(normalizePrimitive(v));
            }
        }

        if (primitives.length === 1) {
            data[key] = primitives[0];
        } else if (primitives.length > 1) {
            data[key] = primitives;
        }
    }

    return data;
};

export const parseAsJSON = async (c: MainContext) => {
    let json: unknown | null = null;
    try {
        const text = await c.req.text();
        json = JSON.parse(text);
    } catch (error) {
        console.error(c.get("reqId"), error);
    }

    if (json) {
        return sanitizeJson(json);
    }

    return null;
};

export const parseAsForm = async (c: MainContext) => {
    let form: FormData | null = null;
    try {
        form = await c.req.formData();
    } catch (error) {
        console.error(c.get("reqId"), error);
    }

    if (form) {
        return await parseFormData(form);
    }

    return null;
};

export const parseSubmission = async (
    c: MainContext,
): Promise<SubmissionPayload | null> => {
    const type = c.req.header("Content-Type") || "";

    let useForm = false;
    let useJson = false;
    if (
        type.includes("multipart/form-data") ||
        type.includes("application/x-www-form-urlencoded")
    ) {
        useForm = true;
    }

    if (type.includes("application/json")) {
        useJson = true;
    }

    if (useJson) {
        return parseAsJSON(c);
    } else if (useForm) {
        return parseAsForm(c);
    } else {
        // 1. useJson && useForm
        // 2. !(useJson && useForm)

        try {
            return parseAsForm(c);
        } catch (error) {
            console.error(c.get("reqId"), error);
        }

        try {
            return parseAsJSON(c);
        } catch (error) {
            console.error(c.get("reqId"), error);
        }

        return null;
    }

    return null;
};
