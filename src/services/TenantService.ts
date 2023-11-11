import { Repository } from "typeorm";
import { Tenant } from "../entity/Tenant";
import { ICreateTenantData, TenantDetailsToUpdate } from "../types";
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

    async getTenantList() {
        try {
            return await this.tenantRepository.find();
        } catch (error) {
            const err = createHttpError("Could not create tenant");
            throw err;
        }
    }

    async findTenantById(id: number) {
        try {
            return await this.tenantRepository.findOne({
                where: { id },
            });
        } catch (error) {
            const err = createHttpError("Error not find tenant");
            throw err;
        }
    }

    async updateTenantById(id: number, dataToUpdate: TenantDetailsToUpdate) {
        try {
            return await this.tenantRepository.update({ id }, dataToUpdate);
        } catch (error) {
            const err = createHttpError("Error updating tenant");
            throw err;
        }
    }

    async deleteTenantById(id: number) {
        try {
            return await this.tenantRepository.delete(id);
        } catch (error) {
            const err = createHttpError("Error deleting tenant");
            throw err;
        }
    }
}
