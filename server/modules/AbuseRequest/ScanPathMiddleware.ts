import { createMiddleware } from "hono/factory";
import { MainEnv } from "@server/types";

/**
 * High-signal scanner detection patterns
 * - Keep this tight to avoid false positives
 */
const BLOCK_REGEX: RegExp[] = [
    /(^|\/)\.env(\.|$)/i,
    /(^|\/)\.git(\/|$)/i,
    /(^|\/)wp-/i,
    /(^|\/)xmlrpc/i,
    /(^|\/)vendor(\/|$)/i,
    /(^|\/)storage(\/|$)/i,
    /(^|\/)_debugbar/i,
    /(^|\/)telescope/i,
    /(^|\/)actuator/i,
    /backup\.(zip|tar|gz)$/i,
    /\.sql$/i,
    /\.bak$/i,
];

/**
 * Optional: exact sensitive files (fast path)
 */
const BLOCK_EXACT = new Set(["/.env", "/.git/config", "/composer.lock"]);

/**
 * Lightweight heuristic scoring (optional but powerful)
 */
function getSuspicionScore(path: string): number {
    let score = 0;

    if (BLOCK_EXACT.has(path)) score += 5;
    if (BLOCK_REGEX.some((r) => r.test(path))) score += 3;

    // noisy probing patterns
    if (path.split("/").length > 6) score += 1; // deep path
    if (path.includes("..")) score += 2; // traversal attempt

    return score;
}

export const ScanPathMiddleware = createMiddleware<MainEnv>(async (c, next) => {
    const url = new URL(c.req.url);
    const path = url.pathname;

    // --- fast path (exact match)
    if (BLOCK_EXACT.has(path)) {
        console.log(c.get("reqId"), "ScanPathMiddleware:EXACT_MATCH");
        return c.notFound();
    }

    // --- regex detection
    for (const r of BLOCK_REGEX) {
        if (r.test(path)) {
            console.log(c.get("reqId"), "ScanPathMiddleware:REGEX_MATCH", {
                pattern: r.toString(),
            });
            return c.notFound();
        }
    }

    // --- optional scoring (catch unknown patterns)
    const score = getSuspicionScore(path);
    if (score >= 5) {
        console.log(c.get("reqId"), "ScanPathMiddleware:SCORE_BLOCK", {
            score,
        });
        return c.notFound();
    }

    return next();
});
