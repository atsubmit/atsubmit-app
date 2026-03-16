import { Context } from 'hono';

export const wantJson = (c: Context) => {
    return (
        (c.req.header('Accept') || '').includes('json') ||
        (c.req.header('Content-Type') || '').includes('json')
    );
};

export function getClientIp(c: any): string | null {
    const req = c.req.raw;

    const headers = req.headers;

    const ip =
        headers.get("cf-connecting-ip") ||     // Cloudflare
        headers.get("x-real-ip") ||            // Nginx
        headers.get("x-forwarded-for")?.split(",")[0].trim() || // proxies
        null;

    return ip;
}