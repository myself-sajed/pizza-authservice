import fs from "fs";
import path from "path";
import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";

export default class AuthController {
    constructor(
        private userservice: UserService,
        private logger: Logger,
    ) {
        this.userservice = userservice;
    }

    async register(
        req: RequestWithUserInfo,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, email, password } = req.body;
        this.logger.debug({ name, email, password: "******" });
        try {
            const user = await this.userservice.create({
                name,
                email,
                password,
            });

            let privateKey: Buffer;
            // let publicKey;
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, `../../certs/privateKey.pem`),
                );
            } catch (err) {
                const error = createHttpError(500, "Private key not found");
                next(error);
                return;
            }

            const payload = {
                sub: user.id,
                role: user.role,
            };

            const accessToken = jwt.sign(payload, privateKey, {
                algorithm: "RS256",
                issuer: "auth-service",
                expiresIn: "1h",
            });

            const refreshToken = jwt.sign(
                payload,
                Config.REFRESH_TOKEN_SECRET!,
                {
                    algorithm: "HS256",
                    issuer: "auth-service",
                    expiresIn: "1y",
                },
            );

            // sending cookies

            // 1. sending access token in cookies
            res.cookie("accessToken", accessToken, {
                maxAge: 60 * 60 * 1000, //1hr
                httpOnly: true,
                sameSite: "strict",
                domain: "localhost",
            });

            // 2. sending refresh token in cookies
            res.cookie("refreshToken", refreshToken, {
                maxAge: 60 * 60 * 1000 * 365, // 1yr
                httpOnly: true,
                sameSite: "strict",
                domain: "localhost",
            });

            this.logger.info("User registration was successful.");
            res.status(201).json({ status: "success" });
        } catch (error) {
            next(error);
            return;
        }
    }
}
