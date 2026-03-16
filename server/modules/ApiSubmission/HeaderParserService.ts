type SanitizedHeaders = {
    headers: Record<string, string>;
    invalidKeys: string[];
    redacted: string[];
};

const HEADER_KEY_REGEX = /^[a-z0-9-]+$/i;

const SENSITIVE_HEADERS = new Set([
    "authorization",
    "cookie",
    "set-cookie",
    "proxy-authorization",
    "x-api-key",
    "x-auth-token",
]);

const MAX_HEADER_VALUE = 2000;
const MAX_HEADERS = 64;

export function sanitizeHeaders(
    input: Headers | Record<string, unknown>,
): SanitizedHeaders {
    const headers: Record<string, string> = {};
    const invalidKeys: string[] = [];
    const redacted: string[] = [];

    const entries =
        input instanceof Headers
            ? Array.from(input.entries())
            : Object.entries(input);

    for (const [rawKey, rawValue] of entries) {
        if (Object.keys(headers).length >= MAX_HEADERS) break;

        const key = rawKey.toLowerCase().trim();

        // validate header name
        if (!HEADER_KEY_REGEX.test(key)) {
            invalidKeys.push(rawKey);
            continue;
        }

        let value: string | null = null;

        if (typeof rawValue === "string") {
            value = rawValue;
        } else if (Array.isArray(rawValue)) {
            value = rawValue.filter((v) => typeof v === "string").join(", ");
        }

        if (value === null) {
            invalidKeys.push(rawKey);
            continue;
        }

        value = value.trim();

        // redact sensitive headers
        if (SENSITIVE_HEADERS.has(key)) {
            headers[key] = "[REDACTED]";
            redacted.push(key);
            continue;
        }

        // prevent very large headers
        if (value.length > MAX_HEADER_VALUE) {
            value = value.slice(0, MAX_HEADER_VALUE);
        }

        headers[key] = value;
    }

    return {
        headers,
        invalidKeys,
        redacted,
    };
}
