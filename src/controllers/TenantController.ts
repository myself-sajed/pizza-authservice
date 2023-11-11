import { NextFunction, Response } from "express";
import { TenantService } from "../services/TenantService";
import { RequestWithCreateTenantData } from "../types";
import { validationResult } from "express-validator";
import { Logger } from "winston";

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {
        this.tenantService = tenantService;
        this.logger = logger;
    }

    async create(
        req: RequestWithCreateTenantData,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        try {
            const { name, address } = req.body;

            this.logger.debug("Request data for tenant creation :", {
                name,
                address,
            });

            const tenant = await this.tenantService.createTenant({
                name,
                address,
            });

            this.logger.info("Tenant created successfully", {
                id: tenant.id,
                name: tenant.name,
            });

            res.status(201).json(tenant);
        } catch (error) {
            next(error);
        }
    }
}
