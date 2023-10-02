import request from "supertest";
import app from "./src/app";

describe.skip("Testing App Auth Service", () => {
    it("should work", () => {
        const result = 10 + 12;
        expect(result).toBe(22);
    });

    it("check the url", async () => {
        const response = await request(app).get("/").send();
        expect(response.statusCode).toBe(401);
    });
});
