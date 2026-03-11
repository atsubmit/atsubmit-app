import type { ZodError } from "zod";

export const zodErrorsToJson = <T>(error: ZodError<T>) => {
    const output: Record<string, string[]> = {};
    for (let index = 0; index < error.issues.length; index++) {
        const issue = error.issues[index];
        const path = issue.path.join(".");
        if (!output[path]) {
            output[path] = [];
        }

        output[path].push(issue.message);
    }

    return output;
};
