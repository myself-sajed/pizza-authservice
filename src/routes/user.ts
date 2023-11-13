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

// router.get(
//     "/getTenants",
//     authenticateAccessToken,
//     canOnlyBeAccessedBy([Roles.Admin]),
//     (req: Request, res: Response) => tenantController.getTenants(req, res),
// );

// router.post(
//     "/findTenant",
//     authenticateAccessToken,
//     canOnlyBeAccessedBy([Roles.Admin]),
//     (req: Request, res: Response) => tenantController.findTenant(req, res),
// );

// router.post(
//     "/updateTenant",
//     authenticateAccessToken,
//     canOnlyBeAccessedBy([Roles.Admin]),
//     (req: Request, res: Response) => tenantController.updateTenant(req, res),
// );

// router.post(
//     "/deleteTenant",
//     authenticateAccessToken,
//     canOnlyBeAccessedBy([Roles.Admin]),
//     (req: Request, res: Response) => tenantController.deleteTenant(req, res),
// );

export default router;
