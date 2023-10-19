import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/TokenService";

export default class AuthController {
    constructor(
        private userservice: UserService,
        private logger: Logger,
        private tokenService: TokenService,
    ) {
        this.userservice = userservice;
        this.tokenService = tokenService;
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
            // creating user
            const user = await this.userservice.create({
                name,
                email,
                password,
            });

            // jwt payload
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            // generating access token
            const accessToken = this.tokenService.generateAccessToken(payload);

            // persisting refresh token
            const refreshTokenRecord =
                await this.tokenService.saveRefreshTokenRecord(user);

            // generating refresh token
            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: refreshTokenRecord.id,
            });

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
            res.status(201).json(user);
        } catch (error) {
            next(error);
            return;
        }
    }
}
