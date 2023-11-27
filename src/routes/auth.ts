import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
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
        authController.register(req, res, next) as unknown as RequestHandler,
);

router.post(
    "/login",
    loginValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next) as unknown as RequestHandler,
);

router.post(
    "/self",
    authenticateAccessToken as RequestHandler,
    (req: Request, res: Response) =>
        authController.self(
            req as RequestWithAuthInfo,
            res,
        ) as unknown as RequestHandler,
);

router.post(
    "/refresh",
    authenticateRefreshToken as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        authController.refresh(
            req as RequestWithAuthInfo,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/logout",
    authenticateAccessToken as RequestHandler,
    parseRefreshToken as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
        authController.logout(
            req as RequestWithAuthInfo,
            res,
            next,
        ) as unknown as RequestHandler,
);

export default router;
