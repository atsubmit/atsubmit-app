export const createPGMockContext = () => {
    const store = new Map();

    return {
        env: {
            DB_URL: "postgres://test",
        },
        get: (key: string) => store.get(key),
        set: (key: string, value: any) => store.set(key, value),
    } as any;
};
