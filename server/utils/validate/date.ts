export const canParseToDate = (input: unknown): boolean => {
    return (
        (typeof input === 'number' || typeof input === 'string') &&
        !isNaN(new Date(input).valueOf())
    );
};
