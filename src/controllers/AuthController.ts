import { NextFunction, Response } from "express";
import { RequestWithUserInfo } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";

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
        const { name, email, password } = req.body;
        this.logger.debug({ name, email, password: "******" });
        try {
            await this.userservice.create({ name, email, password });
            this.logger.info("User registration was successful.");
            res.status(201).json({ status: "success" });
        } catch (error) {
            next(error);
            return;
        }
    }
}
