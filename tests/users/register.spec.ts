import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { isJWT } from "../utils";
import { RefreshToken } from "../../src/entity/RefreshToken";

describe.skip("POST /auth/register testing", () => {
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
        it("Should return valid status code 201", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed new",
                email: "shaikhsajed98220@gmail.com",
                password: "hjakdfhk384928123",
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
                password: "hjakdfhk384928123",
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
                password: "hjakdfhk3849281234",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            // 3. Assert (expectations testing)
            const repo = connection.getRepository(User);
            const users = await repo.find();

            expect(users).toHaveLength(1);
        });

        it("check if the db item is has the same name as the info", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed shaikh moiz",
                email: "shaikhsajed98220@gmail.com",
                password: "hjakdfhk3849281234",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            // 3. Assert (expectations testing)
            const repo = connection.getRepository(User);
            const user = await repo.find();

            expect(user[0].name).toBe(userInfo.name);
        });

        it("should have customer as the role of every registering user", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed shaikh moiz",
                email: "shaikhsajed98220@gmail.com",
                password: "hjakdfhk3849281234",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            // 3. Assert (expectations testing)
            const repo = connection.getRepository(User);
            const user = await repo.find();

            expect(user[0].role).toBe(Roles.Customer);
        });

        it("should store the hashed password only", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed shaikh moiz",
                email: "shaikhsajed98220@gmail.com",
                password: "hjakdfhk3849281234",
            };

            // 2. Act
            await request(app).post("/auth/register").send(userInfo);

            // 3. Assert (expectations testing)
            const repo = connection.getRepository(User);
            const user = await repo.find();

            expect(user[0].password).not.toBe(userInfo.password);
            expect(user[0].password).toHaveLength(60);
        });

        it("should check if the e-mail already exists or not", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed shaikh moiz",
                email: "shaikhsajed98220@gmail.com",
                password: "hjakdfhk3849281234",
            };

            // 2. Act
            const repo = connection.getRepository(User);
            await repo.save({ ...userInfo, role: Roles.Customer });

            await request(app).post("/auth/register").send(userInfo);

            // 3. Assert (expectations testing)
            const user = await repo.find();

            expect(user).toHaveLength(1);
        });

        it("should return valid access and refresh tokens", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed 3",
                email: "shaikhsajed98220@gmail.com",
                password: "hjakdfhk3849281234",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/register")
                .send(userInfo);

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

        it("should return a record with user id", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed 3",
                email: "shaikhsajed98220@gmail.com",
                password: "hjakdfhk3849281234",
            };

            // 2. Act
            const response = await request(app)
                .post("/auth/register")
                .send(userInfo);

            const refreshTokenRepo = connection.getTreeRepository(RefreshToken);
            const refreshToken = await refreshTokenRepo.find();
            expect(refreshToken).toHaveLength(1);

            const tokens = await refreshTokenRepo
                .createQueryBuilder("refreshToken")
                .where("refreshToken.userId = :userId", {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();

            expect(tokens).toHaveLength(1);
        });
    });

    describe("With some fields missing", () => {
        it("should not create a record if the name does not exist", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "",
                email: "shaikhsajed@gmail.com",
                password: "hjakdfhk3849281234",
            };

            // 2. Act
            const res = await request(app)
                .post("/auth/register")
                .send(userInfo);

            // 3. Assert (expectations testing)
            expect(res.statusCode).toBe(400);
        });
        it("should not create a record if the email does not exist", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed shaikh moiz",
                email: "",
                password: "hjakdfhk3849281234",
            };

            // 2. Act
            const res = await request(app)
                .post("/auth/register")
                .send(userInfo);

            // 3. Assert (expectations testing)
            expect(res.statusCode).toBe(400);
        });
        it("should not create a record if the password does not exist", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed shaikh moiz",
                email: "shaikhsajed@gmail.com",
                password: "",
            };

            // 2. Act
            const res = await request(app)
                .post("/auth/register")
                .send(userInfo);

            // 3. Assert (expectations testing)
            expect(res.statusCode).toBe(400);
        });
        it("should check of the password has length at least 8 characters other wise return 400", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed ahmed shaikh moiz",
                email: "shaikhsajed@gmail.com",
                password: "1234567",
            };

            // 2. Act
            const res = await request(app)
                .post("/auth/register")
                .send(userInfo);

            // 3. Assert (expectations testing)
            expect(res.statusCode).toBe(400);
        });
    });
});
