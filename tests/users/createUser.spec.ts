import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { Tenant } from "../../src/entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";
import { createTenant } from "../utils";
import { ResponseBody } from "../../src/types";
import { User } from "../../src/entity/User";

describe("POST /user/create testing", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5000");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();

        adminToken = jwks.token({
            sub: "1",
            role: Roles.Admin,
        });
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("creating the manager user by admin", () => {
        it("should only be created by admin ", async () => {
            const userInfoWithTenant = await createTenant(
                connection.getRepository(Tenant),
                adminToken,
                app,
            );

            const managerToken = jwks.token({
                sub: "1",
                role: Roles.Manager,
            });

            const res = await request(app)
                .post("/user/create")
                .set("Cookie", [`accessToken=${managerToken};`])
                .send(userInfoWithTenant);

            // 3. Assert (expectations testing)
            expect(res.statusCode).toBe(403);
        });

        it("should create a record in the database as a user with manager role", async () => {
            const userInfoWithTenant = await createTenant(
                connection.getRepository(Tenant),
                adminToken,
                app,
            );

            const res = await request(app)
                .post("/user/create")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(userInfoWithTenant);

            // 3. Assert (expectations testing)
            expect((res.body as Record<string, string>).name).toBe(
                userInfoWithTenant.name,
            );
        });

        it("should return the same tenantId which was passed", async () => {
            const userInfoWithTenant = await createTenant(
                connection.getRepository(Tenant),
                adminToken,
                app,
            );

            const res = await request(app)
                .post("/user/create")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(userInfoWithTenant);

            // 3. Assert (expectations testing)
            expect((res.body as { tenant: { id: string } }).tenant.id).toBe(
                userInfoWithTenant.tenantId,
            );
        });

        it("should return the list of users by tenantId", async () => {
            const tenantRepo = connection.getRepository(Tenant);

            const tenantInfo = {
                name: "Hangout",
                address: "Basmath Road, Parbhani",
            };
            const tenant = await tenantRepo.save(tenantInfo);
            const newTenant = await tenantRepo.save({
                name: "Hangout New",
                address: "Basmath Road, Parbhani",
            });

            await request(app)
                .post("/user/create")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send({
                    name: "New tenant manager",
                    email: "tenantnew@gmail.com",
                    role: Roles.Manager,
                    password: "hjakdfhk384928123",
                    tenantId: newTenant.id,
                });

            await request(app)
                .post("/user/create")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send({
                    name: "Shaikh Sajed",
                    email: "shaikhsajed98220@gmail.com",
                    role: Roles.Manager,
                    password: "hjakdfhk384928123",
                    tenantId: tenant.id,
                });

            await request(app)
                .post("/user/create")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send({
                    name: "Sameer Pathan",
                    email: "sameer@gmail.com",
                    role: Roles.Manager,
                    password: "hjakdfhk384928123",
                    tenantId: tenant.id,
                });

            const res = await request(app)
                .post("/user/list")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send({ tenantId: tenant.id });

            const resBody = res.body as ResponseBody;

            expect(resBody.users).toHaveLength(2);
            expect(resBody.users[0].name).toBe("Shaikh Sajed");
            expect(resBody.users[1].name).toBe("Sameer Pathan");

            expect(res.statusCode).toBe(201);
        });

        it("should return the updated user", async () => {
            const userInfoWithTenant = await createTenant(
                connection.getRepository(Tenant),
                adminToken,
                app,
            );

            const userRepo = connection.getRepository(User);
            const user = await userRepo.save(userInfoWithTenant);

            const updateDetails = {
                userToUpdate: user.id,
                detailsToUpdate: {
                    name: "Sameer Pathan",
                },
            };

            const response = await request(app)
                .post("/user/update")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send(updateDetails);

            const resBody = response.body as {
                name: string;
                id: number;
            };

            expect(resBody.name).toBe(updateDetails.detailsToUpdate.name);
            expect(resBody.id).toBe(user.id);
        });

        it("should delete the user using userId", async () => {
            const userInfoWithTenant = await createTenant(
                connection.getRepository(Tenant),
                adminToken,
                app,
            );

            const userRepo = connection.getRepository(User);
            const user = await userRepo.save(userInfoWithTenant);

            const response = await request(app)
                .post("/user/delete")
                .set("Cookie", [`accessToken=${adminToken};`])
                .send({ id: user.id });

            expect(response.statusCode).toBe(202);
        });
    });
});
