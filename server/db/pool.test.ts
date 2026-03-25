import { afterEach, beforeEach, vi } from "vitest";

import { describe, expect, it } from "vitest";
import { getPool } from "./pool";
import { Pool } from "pg";
import { createPGMockContext } from "./pool.utils.test";

describe("getPool", () => {
    beforeEach(() => {
        vi.mock("pg", () => {
            const mockClient = {
                release: vi.fn(),
            };

            const mockPool = {
                connect: vi.fn(async () => mockClient),
            };

            return {
                Pool: vi.fn().mockImplementation(function () {
                    return mockPool;
                }),
            };
        });
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it("creates new pool if none exists", () => {
        const c = createPGMockContext();

        const pool = getPool(c);

        expect(Pool).toHaveBeenCalledTimes(1);
        expect(pool).toBeDefined();
    });

    it("reuses existing pool", () => {
        const c = createPGMockContext();

        const first = getPool(c);
        const second = getPool(c);

        expect(first).toBe(second);
        expect(Pool).toHaveBeenCalledTimes(1);
    });

    it("forceNew creates new pool", () => {
        const c = createPGMockContext();

        const first = getPool(c);
        const second = getPool(c, {}, { forceNew: true });

        expect(first).not.toBe(second);
        expect(Pool).toHaveBeenCalledTimes(2);
    });
});
