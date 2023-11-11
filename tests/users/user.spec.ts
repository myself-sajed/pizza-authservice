import app from "../../src/app";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { DataSource } from "typeorm";
import createJWKSMock from "mock-jwks";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe.skip("/GET User auth", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5000");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it("should return 200 as a response", async () => {
        const res = await request(app).post("/auth/self");

        expect(res.statusCode).toEqual(401);
    });

    it("should return 401 as a response status if tokens are not sent from client", async () => {
        const accessToken = jwks.token({
            sub: "1",
            role: Roles.Customer,
        });

        const res = await request(app)
            .post("/auth/self")
            .set("Cookie", [`accessToken=${accessToken};`]);

        expect(res.statusCode).toEqual(200);
    });

    it("should return the same id as of the registered user sending via token", async () => {
        // 1. info
        const userInfo = {
            name: "Shaikh Sajed new",
            email: "shaikhsajed98220@gmail.com",
            password: "hjakdfhk384928123",
            role: Roles.Customer,
        };

        // 2. registration
        await request(app).post("/auth/register").send(userInfo);

        // 3. get user
        const repo = connection.getRepository(User);
        const users = await repo.find();

        const accessToken = jwks.token({
            sub: String(users[0].id),
            role: userInfo.role,
        });

        const res = await request(app)
            .post("/auth/self")
            .set("Cookie", [`accessToken=${accessToken};`]);

        expect((res.body as Record<string, string>).id).toBe(users[0].id);
    });

    it("should not return the password field of the user", async () => {
        // 1. info
        const userInfo = {
            name: "Shaikh Sajed new",
            email: "shaikhsajed98220@gmail.com",
            password: "hjakdfhk384928123",
            role: Roles.Customer,
        };

        // 2. registration
        await request(app).post("/auth/register").send(userInfo);

        // 3. get user
        const repo = connection.getRepository(User);
        const users = await repo.find();

        const accessToken = jwks.token({
            sub: String(users[0].id),
            role: userInfo.role,
        });

        const res = await request(app)
            .post("/auth/self")
            .set("Cookie", [`accessToken=${accessToken};`]);

        expect(res.body as Record<string, string>).not.toHaveProperty(
            "password",
        );
    });
});
