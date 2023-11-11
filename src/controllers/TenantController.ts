import { NextFunction, Response } from "express";
import { TenantService } from "../services/TenantService";
import { RequestWithCreateTenantData } from "../types";
import { validationResult } from "express-validator";

export class TenantController {
    constructor(private tenantService: TenantService) {
        this.tenantService = tenantService;
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

            const tenant = await this.tenantService.createTenant({
                name,
                address,
            });

            res.status(201).json(tenant);
        } catch (error) {
            next(error);
        }
    }
}
