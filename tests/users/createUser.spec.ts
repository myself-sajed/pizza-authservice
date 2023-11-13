import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { Tenant } from "../../src/entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";
import { createTenant } from "../utils";

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

            console.log(res.body);

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

            console.log(res.body);

            // 3. Assert (expectations testing)
            expect((res.body as { tenant: { id: string } }).tenant.id).toBe(
                userInfoWithTenant.tenantId,
            );
        });

        // it("should return valid 400 code if fields are missing", async () => {
        //     const tenantInfo = {
        //         name: "",
        //         address: "Basmath Road, Parbhani",
        //     };

        //     const response = await request(app)
        //         .post("/tenant/create")
        //         .set("Cookie", [`accessToken=${adminToken};`])
        //         .send(tenantInfo);

        //     const tenantRepo = connection.getRepository(Tenant);
        //     const tenants = await tenantRepo.find();

        //     // 3. Assert (expectations testing)
        //     expect(tenants).toHaveLength(0);

        //     expect(response.statusCode).toBe(400);
        // });

        // it("should return valid 401 code if the user is not authenticated", async () => {
        //     const tenantInfo = {
        //         name: "Hangout Cafe",
        //         address: "Basmath Road, Parbhani",
        //     };

        //     const managerToken = jwks.token({
        //         sub: "1",
        //         role: Roles.Manager,
        //     });

        //     const response = await request(app)
        //         .post("/tenant/create")
        //         .set("Cookie", [`accessToken=${managerToken};`])
        //         .send(tenantInfo);

        //     expect(response.statusCode).toBe(403);

        //     const tenantRepo = connection.getRepository(Tenant);
        //     const tenants = await tenantRepo.find();

        //     // 3. Assert (expectations testing)
        //     expect(tenants).toHaveLength(0);
        // });

        // it("should return the tenant list / array", async () => {
        //     const tenantRepo = connection.getRepository(Tenant);
        //     await tenantRepo.save({
        //         name: "Hangout Cafe",
        //         address: "Basmath Road, Parbhani",
        //     });
        //     await tenantRepo.save({
        //         name: "Coffee Cafe",
        //         address: "Jintur Road, Parbhani",
        //     });

        //     const response = await request(app)
        //         .get("/tenant/getTenants")
        //         .set("Cookie", [`accessToken=${adminToken};`])
        //         .send();

        //     expect(
        //         (response.body as Record<string, string>).tenants,
        //     ).toHaveLength(2);
        // });

        // it("should return a tenant by id", async () => {
        //     const tenantInfo = {
        //         name: "Hangout Cafe",
        //         address: "Basmath Road, Parbhani",
        //     };

        //     const tenantRepo = connection.getRepository(Tenant);
        //     const tenant = await tenantRepo.save(tenantInfo);

        //     const response = await request(app)
        //         .post("/tenant/findTenant")
        //         .set("Cookie", [`accessToken=${adminToken};`])
        //         .send({ id: tenant.id });

        //     // 3. Assert (expectations testing)
        //     expect((response.body as Record<string, string>).id).toBe(
        //         tenant.id,
        //     );
        //     expect((response.body as Record<string, string>).name).toBe(
        //         tenantInfo.name,
        //     );
        //     expect((response.body as Record<string, string>).address).toBe(
        //         tenantInfo.address,
        //     );
        // });

        // it("should return an updated tenant", async () => {
        //     const tenantInfo = {
        //         name: "Hangout Cafe",
        //         address: "Basmath Road, Parbhani",
        //     };

        //     const tenantRepo = connection.getRepository(Tenant);
        //     const tenant = await tenantRepo.save(tenantInfo);

        //     const updateDetails = {
        //         tenantToUpdate: tenant.id,
        //         detailsToUpdate: {
        //             name: "Cafe Coffee Day",
        //         },
        //     };

        //     const response = await request(app)
        //         .post("/tenant/updateTenant")
        //         .set("Cookie", [`accessToken=${adminToken};`])
        //         .send(updateDetails);

        //     // 3. Assert (expectations testing)
        //     expect((response.body as Record<string, string>).id).toBe(
        //         tenant.id,
        //     );
        //     expect((response.body as Record<string, string>).name).toBe(
        //         updateDetails.detailsToUpdate.name,
        //     );
        //     expect((response.body as Record<string, string>).address).toBe(
        //         tenantInfo.address,
        //     );
        // });

        // it("should return 202 if the user is deleted successfully", async () => {
        //     const tenantInfo = {
        //         name: "Hangout Cafe",
        //         address: "Basmath Road, Parbhani",
        //     };

        //     const tenantRepo = connection.getRepository(Tenant);
        //     const tenant = await tenantRepo.save(tenantInfo);

        //     const response = await request(app)
        //         .post("/tenant/deleteTenant")
        //         .set("Cookie", [`accessToken=${adminToken};`])
        //         .send({ id: tenant.id });

        //     const isTenant = await tenantRepo.findOne({
        //         where: { id: tenant.id },
        //     });

        //     expect(response.statusCode).toBe(202);
        //     expect(isTenant).toBeFalsy();
        // });
    });
});
