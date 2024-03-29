import { checkSchema } from "express-validator";

export default checkSchema(
    {
        qTerm: {
            customSanitizer: {
                options: (value: unknown) => {
                    return value || "";
                },
            },
        },
        currentPage: {
            customSanitizer: {
                options: (value: string) => {
                    const parsedValue = Number(value);
                    return Number.isNaN(parsedValue) ? 1 : parsedValue;
                },
            },
        },
        perPage: {
            customSanitizer: {
                options: (value: string) => {
                    const parsedValue = Number(value);
                    return Number.isNaN(parsedValue) ? 7 : parsedValue;
                },
            },
        },
    },
    ["query"],
);
