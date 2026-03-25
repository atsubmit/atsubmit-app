import { fileURLToPath, URL } from "node:url";

import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [
        cloudflareTest({
            wrangler: {},
            // miniflare: {
            //     kvNamespaces: ["KV"],

            //     services: {
            //         ATSUBMIT_MAIL: {
            //             fetch: async () => {
            //                 return new Response("mocked", { status: 200 });
            //             },
            //         },
            //     },
            // },
        }),
    ],

    resolve: {
        alias: {
            "@server": fileURLToPath(new URL("./server", import.meta.url)),
        },
    },
    test: {
        exclude: ["test/**/*.utils.test.ts", "server/**/*.utils.test.ts"],
        include: ["test/**/*.test.ts", "server/**/*.test.ts"],
        setupFiles: ["./vitest.worker.setup.ts"],
    },
});
