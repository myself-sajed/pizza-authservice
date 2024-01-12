import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
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
    authenticateAccessToken as RequestHandler,
    canOnlyBeAccessedBy([Roles.Admin]),
    registrationValidators,
    (req: Request, res: Response, next: NextFunction) =>
        userController.create(req, res, next) as unknown as RequestHandler,
);

router.post(
    "/list",
    authenticateAccessToken as RequestHandler,
    canOnlyBeAccessedBy([Roles.Admin, Roles.Manager]),
    (req: Request, res: Response, next: NextFunction) =>
        userController.getUsersByTenantId(
            req,
            res,
            next,
        ) as unknown as RequestHandler,
);

router.post(
    "/update",
    authenticateAccessToken as RequestHandler,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) =>
        userController.updateUser(req, res) as unknown as RequestHandler,
);

router.post(
    "/delete",
    authenticateAccessToken as RequestHandler,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) =>
        userController.deleteUser(req, res) as unknown as RequestHandler,
);

export default router;
