import { expressjwt } from "express-jwt";
import { Config } from "../config";
import { Request } from "express";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import logger from "../config/logger";
import { IRevokeToken } from "../types";

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
    isRevoked: async (req: Request, token) => {
        try {
            const RefreshTokenRepo = AppDataSource.getRepository(RefreshToken);
            const refreshToken = await RefreshTokenRepo.findOne({
                where: {
                    id: Number((token?.payload as IRevokeToken).id),
                    user: { id: Number((token?.payload as IRevokeToken).sub) },
                },
            });
            return refreshToken === null;
        } catch (error) {
            logger.error(`Token was revoked`, {
                id: Number((token?.payload as IRevokeToken).id),
            });
        }

        return true;
    },
});
