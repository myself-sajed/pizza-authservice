/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { NextFunction, Request, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import tenantCreateValidator from "../validators/tenant-create-validator";
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
    authenticateAccessToken,
    canOnlyBeAccessedBy([Roles.Admin]),
    tenantCreateValidator,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);

router.get("/getTenants", (req: Request, res: Response) =>
    tenantController.getTenants(req, res),
);

router.post(
    "/findTenant",
    authenticateAccessToken,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) => tenantController.findTenant(req, res),
);

router.post(
    "/updateTenant",
    authenticateAccessToken,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) => tenantController.updateTenant(req, res),
);

router.post(
    "/deleteTenant",
    authenticateAccessToken,
    canOnlyBeAccessedBy([Roles.Admin]),
    (req: Request, res: Response) => tenantController.deleteTenant(req, res),
);

export default router;
