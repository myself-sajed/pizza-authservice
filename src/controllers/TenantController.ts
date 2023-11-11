import { NextFunction, Request, Response } from "express";
import { TenantService } from "../services/TenantService";
import {
    RequestWithCreateTenantData,
    RequestWithTenantId,
    RequestWithTenantUpdateInfo,
} from "../types";
import { validationResult } from "express-validator";
import { Logger } from "winston";
import createHttpError from "http-errors";

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

    async getTenants(req: Request, res: Response) {
        try {
            const tenants = await this.tenantService.getTenantList();
            res.status(200).json({ tenants });
        } catch (error) {
            const err = createHttpError(400, "No tenants found");
            throw err;
        }
    }

    async findTenant(req: RequestWithTenantId, res: Response) {
        try {
            const tenant = await this.tenantService.findTenantById(req.body.id);
            if (!tenant) {
                const err = createHttpError(400, "No tenant found");
                throw err;
            }
            res.status(200).json(tenant);
        } catch (error) {
            const err = createHttpError(400, "No tenant found");
            throw err;
        }
    }

    async updateTenant(req: RequestWithTenantUpdateInfo, res: Response) {
        try {
            const isTenantExists = await this.tenantService.findTenantById(
                req.body.tenantToUpdate,
            );

            if (!isTenantExists) {
                throw new Error("Tenant not found");
            } else {
                const updatedQuery = await this.tenantService.updateTenantById(
                    req.body.tenantToUpdate,
                    req.body.detailsToUpdate,
                );

                if (updatedQuery.affected === 1) {
                    const tenant = await this.tenantService.findTenantById(
                        req.body.tenantToUpdate,
                    );
                    this.logger.info("Tenant updated successfully", {
                        id: req.body.tenantToUpdate,
                    });

                    res.status(200).json(tenant);
                    return;
                } else {
                    const err = createHttpError(400, "Could not update tenant");
                    throw err;
                }
            }
        } catch (error) {
            const err = createHttpError(400, "No tenant found");
            throw err;
        }
    }

    async deleteTenant(req: RequestWithTenantId, res: Response) {
        try {
            const tenant = await this.tenantService.deleteTenantById(
                req.body.id,
            );
            if (!tenant) {
                const err = createHttpError(400, "No tenant found");
                throw err;
            }
            this.logger.info("Tenant deleted successfully", {
                id: req.body.id,
            });
            res.status(202).json({});
        } catch (error) {
            const err = createHttpError(400, "No tenant found");
            throw err;
        }
    }
}
