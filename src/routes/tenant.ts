import express, {
    NextFunction,
    Request,
    RequestHandler,
    Response,
} from "express";
import { TenantController } from "../controllers/TenantController";
import tenantCreateValidator from "../validators/tenant-create-validator";
import tenantListValidator from "../validators/tenant-list-validator";
import { TenantService } from "../services/TenantService";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenant";
import logger from "../config/logger";
import authenticateAccessToken from "../middleware/authenticateAccessToken";
import canOnlyBeAccessedBy from "../middleware/canAccess";
import { Roles } from "../constants";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
    "/create",
    authenticateAccessToken as RequestHandler,
    canOnlyBeAccessedBy([Roles.Admin]),
    tenantCreateValidator,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next) as unknown as RequestHandler,
);

router.get(
    "/getTenants",
    tenantListValidator,
    (req: Request, res: Response) =>
        tenantController.getTenants(req, res) as unknown as RequestHandler,
);

router.get(
    "/getAllTenantList",
    (req: Request, res: Response) =>
        tenantController.getAllTenantList(
            req,
            res,
        ) as unknown as RequestHandler,
);

router.post(
    "/findTenant",
    authenticateAccessToken as RequestHandler,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) =>
        tenantController.findTenant(req, res) as unknown as RequestHandler,
);

router.post(
    "/updateTenant",
    authenticateAccessToken as RequestHandler,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) =>
        tenantController.updateTenant(req, res) as unknown as RequestHandler,
);

router.post(
    "/deleteTenant",
    authenticateAccessToken as RequestHandler,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) =>
        tenantController.deleteTenant(req, res) as unknown as RequestHandler,
);

export default router;
