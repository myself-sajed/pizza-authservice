import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { Request } from "express";

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ["HS256"],
    getToken: (req: Request) => {
        // making it flexible for both headers and cookies

        const refreshTokenCookie = (
            req.cookies as { refreshToken: string | null }
        ).refreshToken as string;

        if (refreshTokenCookie) {
            if (refreshTokenCookie) {
                return refreshTokenCookie;
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
