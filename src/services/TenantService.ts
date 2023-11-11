import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenant";
import { ICreateTenantData } from "../types";
import createHttpError from "http-errors";

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {
        this.tenantRepository = tenantRepository;
    }

    async createTenant(tenantData: ICreateTenantData) {
        try {
            const tenant = await this.tenantRepository.save(tenantData);
            return tenant;
        } catch (error) {
            const err = createHttpError("Could not create tenant");
            throw err;
        }
    }
}
