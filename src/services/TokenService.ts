import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";
import { Response } from "express";

export class TokenService {
    constructor(private refreshTokenRepo: Repository<RefreshToken>) {
        this.refreshTokenRepo = refreshTokenRepo;
    }

    generateAccessToken(payload: JwtPayload) {
        let privateKey: string;
        try {
            if (!Config.PRIVATE_KEY) {
                const error = createHttpError(
                    500,
                    "Secrete Key is not yet set",
                );
                throw error;
            }

            privateKey = Config.PRIVATE_KEY;
        } catch (err) {
            const error = createHttpError(500, "Private key not found");
            throw error;
        }
        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            issuer: "auth-service",
            expiresIn: "1h",
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = jwt.sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            issuer: "auth-service",
            expiresIn: "1y",
            jwtid: String(payload.id),
        });
        return refreshToken;
    }

    async saveRefreshTokenRecord(user: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;
        const refreshTokenRecord = await this.refreshTokenRepo.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });

        return refreshTokenRecord;
    }

    async deleteRefreshToken(refreshTokenId: number) {
        const refreshTokenRecord = await this.refreshTokenRepo.delete({
            id: refreshTokenId,
        });

        return refreshTokenRecord;
    }

    setCookie(
        res: Response,
        cookieName: string,
        cookieValue: string,
        maxAge: number,
    ) {
        return res.cookie(cookieName, cookieValue, {
            maxAge: maxAge,
            httpOnly: true,
            sameSite: "strict",
            domain: "localhost",
        });
    }
}
