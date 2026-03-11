export const hasSQLPunctuation = (input: string) => {
    return /\s|['"`;\\]/.test(input);
};
