import { NextFunction, Response } from "express";
import { UserService } from "../services/UserService";
import {
    RequestWithTenantId,
    RequestWithUserInfo,
    RequestWithUserUpdateInfo,
    UserListQueryParams,
} from "../types";
import createHttpError from "http-errors";
import { matchedData, validationResult } from "express-validator";
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

    async getUsersByTenantId(
        req: RequestWithUserInfo,
        res: Response,
        next: NextFunction,
    ) {
        const { tenantId } = req.body;

        const queryParams = matchedData(req, { onlyValidData: true });

        try {
            // creating user
            const users = await this.userService.findUsersByTenantId(
                Number(tenantId),
                queryParams as UserListQueryParams,
            );

            res.status(201).json({ users });
        } catch (error) {
            const err = createHttpError(400, "Could not create user");
            next(err);
            return;
        }
    }

    async updateUser(req: RequestWithUserUpdateInfo, res: Response) {
        try {
            const isUserExists = await this.userService.findById(
                req.body.userToUpdate,
            );

            if (!isUserExists) {
                throw new Error("User not found");
            } else {
                const updatedQuery = await this.userService.updateUserById(
                    req.body.userToUpdate,
                    req.body.detailsToUpdate,
                );

                if (updatedQuery.affected === 1) {
                    const tenant = await this.userService.findById(
                        req.body.userToUpdate,
                    );
                    this.logger.info("User updated successfully", {
                        id: req.body.userToUpdate,
                    });

                    res.status(200).json(tenant);
                    return;
                } else {
                    const err = createHttpError(400, "Could not update User");
                    throw err;
                }
            }
        } catch (error) {
            const err = createHttpError(400, "No user found");
            throw err;
        }
    }

    async deleteUser(req: RequestWithTenantId, res: Response) {
        try {
            const tenant = await this.userService.deleteUserById(req.body.id);
            if (!tenant) {
                const err = createHttpError(400, "No User found");
                throw err;
            }
            this.logger.info("User deleted successfully", {
                id: req.body.id,
            });
            res.status(202).json({});
        } catch (error) {
            const err = createHttpError(400, "No User found");
            throw err;
        }
    }
}
