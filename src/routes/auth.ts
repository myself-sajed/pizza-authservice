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
import authenticate from "../middleware/authenticate";
import { RequestWithAuthInfo } from "../types";
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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

router.post(
    "/login",
    loginValidators,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/self", authenticate, (req: Request, res: Response) =>
    authController.self(req as RequestWithAuthInfo, res),
);

export default router;
