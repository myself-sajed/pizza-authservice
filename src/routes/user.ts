/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logger";
import authenticateAccessToken from "../middleware/authenticateAccessToken";
import canOnlyBeAccessedBy from "../middleware/canAccess";
import { Roles } from "../constants";
import registrationValidators from "../validators/registration-validators";
import { UserController } from "../controllers/UserContoller";
import { UserService } from "../services/UserService";
import { User } from "../entity/User";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post(
    "/create",
    authenticateAccessToken,
    canOnlyBeAccessedBy([Roles.Admin]),
    registrationValidators,
    (req: Request, res: Response, next: NextFunction) =>
        userController.create(req, res, next),
);

router.post(
    "/list",
    authenticateAccessToken,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.getUsersByTenantId(req, res, next),
);

router.post(
    "/update",
    authenticateAccessToken,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) => userController.updateUser(req, res),
);

router.post(
    "/delete",
    authenticateAccessToken,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) => userController.deleteUser(req, res),
);

export default router;
