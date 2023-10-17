import { DataSource } from "typeorm";

export const trucateTables = async (connection: DataSource) => {
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
        const user = connection.getRepository(entity.name);
        await user.clear();
    }
};

export function isJWT(token: string | null): boolean {
    // Define a regular expression pattern for JWTs
    const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;

    if (token) {
        try {
            const parts = token.split(".");
            parts.forEach((part) => {
                Buffer.from(part, "base64").toString("utf-8");
            });
        } catch (error) {
            return false;
        }

        // Check if the token matches the JWT pattern
        return jwtPattern.test(token);
    }

    return false;
}
