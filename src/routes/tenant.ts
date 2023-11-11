/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { NextFunction, Request, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import tenantCreateValidator from "../validators/tenant-create-validator";
import { TenantService } from "../services/TenantService";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenant";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService);

router.post(
    "/create",
    tenantCreateValidator,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);

export default router;
