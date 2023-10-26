import { expressjwt, GetVerificationKey } from "express-jwt";
import jwksClient from "jwks-rsa";
import { Config } from "../config";
import { Request } from "express";

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI!,
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,

    algorithms: ["RS256"],

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
            accessToken: string;
        }

        const { accessToken } = req.cookies as AuthCookies;

        if (accessToken) {
            return accessToken;
        }
    },
});
