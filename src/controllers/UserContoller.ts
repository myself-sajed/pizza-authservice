import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import { RequestWithUserInfo } from "../types";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { Logger } from "winston";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {
        this.userService = userService;
    }
    async create(req: RequestWithUserInfo, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, email, password, role, tenantId } = req.body;
        this.logger.debug({ name, email, password: "******" });

        try {
            // creating user
            const user = await this.userService.create({
                name,
                email,
                password,
                role,
                tenantId,
            });

            res.status(201).send(user);
        } catch (error) {
            const err = createHttpError(400, "Could not create user");
            next(err);
            return;
        }
    }
}
