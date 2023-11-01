/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { NextFunction, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registrationValidators from "../validators/registration-validators";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidators from "../validators/login-validators";
import { CredentialManagerService } from "../services/CredentialManagerService";
import { RequestWithAuthInfo } from "../types";
import authenticateAccessToken from "../middleware/authenticateAccessToken";
import authenticateRefreshToken from "../middleware/authenticateRefreshToken";
import parseRefreshToken from "../middleware/parseRefreshToken";
const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userservice = new UserService(userRepository);
const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepo);
const credentialService = new CredentialManagerService();
const authController = new AuthController(
    userservice,
    logger,
    tokenService,
    credentialService,
);

router.post(
    "/register",
    registrationValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

router.post(
    "/login",
    loginValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
);

router.post("/self", authenticateAccessToken, (req: Request, res: Response) =>
    authController.self(req as RequestWithAuthInfo, res),
);

router.post(
    "/refresh",
    authenticateRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(req as RequestWithAuthInfo, res, next),
);

router.post(
    "/logout",
    authenticateAccessToken,
    parseRefreshToken,
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(req as RequestWithAuthInfo, res, next),
);

export default router;
