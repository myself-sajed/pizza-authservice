import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { isJWT } from "../utils";

describe("POST /auth/login testing", () => {
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

    describe("with all the fields needed, happy test", () => {
        it("Should return valid status code 200", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed new",
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            /// AAA
            // 1. Arrange
            const loginInfo = {
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/login")
                .send(loginInfo);

            // 3. Assert (expectations testing)
            expect(response.statusCode).toBe(200);
        });

        it("Should return the email that has been sent", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed new",
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            /// AAA
            // 1. Arrange
            const loginInfo = {
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/login")
                .send(loginInfo);

            // 3. Assert (expectations testing)
            expect((response.body as Record<string, string>).email).toBe(
                userInfo.email,
            );
        });

        it("Should return 401 if email or password does not exist", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed new",
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            /// AAA
            // 1. Arrange
            const loginInfo = {
                email: "shaikhsajed982200@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/login")
                .send(loginInfo);

            // 3. Assert (expectations testing)
            expect(response.statusCode).toBe(401);
        });

        it("Should return 401 if password is incorrect", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed new",
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            /// AAA
            // 1. Arrange
            const loginInfo = {
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed982200",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/login")
                .send(loginInfo);

            // 3. Assert (expectations testing)
            expect(response.statusCode).toBe(401);
        });

        it("Should return valid access and refresh tokens", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed new",
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            /// AAA
            // 1. Arrange
            const loginInfo = {
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/login")
                .send(loginInfo);

            // 3. Assert (expectations testing)
            interface Headers {
                ["set-cookie"]: [];
            }

            let accessToken = null;
            let refreshToken = null;

            // 3. Assert (expectations testing)
            const cookies = (response.headers as Headers)["set-cookie"] || [];
            cookies.forEach((cookie: string) => {
                if (cookie.includes("accessToken")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }

                if (cookie.includes("refreshToken")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJWT(accessToken)).toBeTruthy();
            expect(isJWT(refreshToken)).toBeTruthy();
        });

        it("Should i have same email that has been sent to the server and user of the db", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed new",
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            /// AAA
            // 1. Arrange
            const loginInfo = {
                email: "shaikhsajed98220@gmail.com",
                password: "shaikhsajed98220",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/login")
                .send(loginInfo);

            // 3. Assert (expectations testing)
            expect((response.body as Record<string, string>).dbUserEmail).toBe(
                userInfo.email,
            );
        });
    });
});
