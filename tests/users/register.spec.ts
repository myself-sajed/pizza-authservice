import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { trucateTables } from "../utils";
import { User } from "../../src/entity/User";

describe("POST /auth/register testing", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // truncate logic
        await trucateTables(connection);
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("with all the fields needed, happy test", () => {
        it("Should return valid status code 201", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed new",
                email: "shaikhsajed98220@gmail.com",
                password: "123",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/register")
                .send(userInfo);

            // 3. Assert (expectations testing)
            expect(response.statusCode).toBe(201);
        });

        it("Should return valid status JSON", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed",
                email: "shaikhsajed98220@gmail.com",
                password: "123",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/register")
                .send(userInfo);

            // 3. Assert (expectations testing)
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        it("check the database and if the user persist", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed 3",
                email: "shaikhsajed98220@gmail.com",
                password: "123",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            // 3. Assert (expectations testing)
            const repo = connection.getRepository(User);
            const users = await repo.find();

            expect(users).toHaveLength(1);
        });
    });
});
