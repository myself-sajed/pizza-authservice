import express, { NextFunction, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logger";
import registrationValidators from "../validators/registration-validators";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userservice = new UserService(userRepository);
const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepo);
const authController = new AuthController(userservice, logger, tokenService);

router.post(
    "/register",
    registrationValidators,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
);

export default router;
