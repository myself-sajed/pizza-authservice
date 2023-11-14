import { DataSource, Repository } from "typeorm";
import request from "supertest";
import { Tenant } from "../../src/entity/Tenant";
import { Roles } from "../../src/constants";
import { Express } from "express";

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

export const createTenant = async (
    tenantRepo: Repository<Tenant>,
    adminToken: string,
    app: Express,
) => {
    const tenantInfo = {
        name: "Hangout",
        address: "Basmath Road, Parbhani",
    };

    await request(app)
        .post("/tenant/create")
        .set("Cookie", [`accessToken=${adminToken};`])
        .send(tenantInfo);

    const tenants = await tenantRepo.find();

    const userInfo = {
        name: "Shaikh Sajed",
        email: "shaikhsajed98220@gmail.com",
        role: Roles.Manager,
        password: "hjakdfhk384928123",
        tenantId: tenants[0].id,
    };
    return userInfo;
};
