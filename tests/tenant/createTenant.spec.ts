import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { Tenant } from "../../src/entity/Tenant";

describe("POST /tenant/create testing", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("creating the tenant", () => {
        it("should return 201 status code", async () => {
            const tenantInfo = {
                name: "Hangout",
                address: "Basmath Road, Parbhani",
            };

            const response = await request(app)
                .post("/tenant/create")
                .send(tenantInfo);

            // 3. Assert (expectations testing)
            expect(response.statusCode).toBe(201);
        });

        it("should create a record in the database as a tenant", async () => {
            const tenantInfo = {
                name: "Hangout Cafe",
                address: "Basmath Road, Parbhani",
            };

            await request(app).post("/tenant/create").send(tenantInfo);

            const tenantRepo = connection.getRepository(Tenant);
            const tenants = await tenantRepo.find();

            // 3. Assert (expectations testing)
            expect(tenants).toHaveLength(1);

            expect(tenants[0].name).toBe(tenantInfo.name);
            expect(tenants[0].address).toBe(tenantInfo.address);
        });

        it("should return valid 400 code if fields are missing", async () => {
            const tenantInfo = {
                name: "",
                address: "Basmath Road, Parbhani",
            };

            const response = await request(app)
                .post("/tenant/create")
                .send(tenantInfo);

            expect(response.statusCode).toBe(400);
        });
    });
});
