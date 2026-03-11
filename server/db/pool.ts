import { ClientConfig, Pool, PoolClient } from "pg";
import { MainContext } from "@server/types";

export const getPool = (
    c: MainContext,
    config?: Omit<
        ClientConfig,
        "user" | "database" | "password" | "port" | "host" | "connectionString"
    >,
    options?: {
        forceNew?: boolean;
    },
) => {
    if (options?.forceNew) {
        c.set("pgPool", undefined);
    } else {
        const cPool = c.get("pgPool");
        if (cPool) {
            return cPool;
        }
    }

    const pool = new Pool({
        ...config,
        connectionString: c.env.DB_URL,
    });

    c.set("pgPool", pool);

    return pool;
};

export const lazyPoolExecute = async <T>(
    c: MainContext,
    runner: (client: PoolClient) => Promise<T>,
) => {
    const pool = getPool(c);
    const client = await pool.connect();

    try {
        return await runner(client);
    } finally {
        client.release();
    }
};
