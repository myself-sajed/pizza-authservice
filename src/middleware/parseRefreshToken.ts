import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { Request } from "express";

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ["HS256"],
    getToken: (req: Request) => {
        // making it flexible for both headers and cookies

        const authHeaders = req.headers.authorization;
        if (authHeaders && authHeaders.split(" ")[1] !== "undefined") {
            const token = authHeaders.split(" ")[1];

            if (token) {
                return token;
            }
        }

        interface AuthCookies {
            refreshToken: string;
        }

        const { refreshToken } = req.cookies as AuthCookies;

        if (refreshToken) {
            return refreshToken;
        }
    },
});
