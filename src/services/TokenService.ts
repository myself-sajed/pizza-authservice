import createHttpError from "http-errors";
import path from "path";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import { Config } from "../config";
import { RefreshToken } from "../entity/RefreshToken";
import { User } from "../entity/User";
import { Repository } from "typeorm";

export class TokenService {
    constructor(private refreshTokenRepo: Repository<RefreshToken>) {
        this.refreshTokenRepo = refreshTokenRepo;
    }

    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer;
        try {
            privateKey = fs.readFileSync(
                path.join(__dirname, `../../certs/privateKey.pem`),
            );
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
}