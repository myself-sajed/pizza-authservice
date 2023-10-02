import request from "supertest";
import app from "../src/app";

describe("POST /auth/register testing", () => {
    describe("with all the fields needed, happy test", () => {
        it("Should return valid status code 201", async () => {
            /// AAA
            // 1. Arrange
            const userInfo = {
                name: "Shaikh Sajed",
                role: "customer",
                email: "shaikhsajed98220@gmail.com",
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
                role: "customer",
                email: "shaikhsajed98220@gmail.com",
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
    });
});
