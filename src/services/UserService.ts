import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserDetailsToUpdate, UserInfo, UserListQueryParams } from "../types";
import createHttpError from "http-errors";
import { hashData } from "./Hashing";

export class UserService {
    constructor(private userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }
    async create({ name, email, password, role, tenantId }: UserInfo) {
        const user = await this.userRepository.findOne({
            where: { email },
        });
        if (user) {
            const err = createHttpError(400, "Email already exists");
            throw err;
        }

        // password hashing using bcrypt
        const hashedPassword = await hashData(password);

        const newUser = await this.userRepository.save({
            name,
            email,
            password: hashedPassword,
            role,
            tenant: tenantId ? { id: Number(tenantId) } : undefined,
        });

        return newUser;
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOne({
            where: { email },
        });
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: { id },
            relations: { tenant: true },
        });
    }

    async findUsersByTenantId(
        tenantId: number,
        queryParams: UserListQueryParams,
    ) {
        const { currentPage, perPage } = queryParams;
        if (tenantId === 0) {
            const queryBuilder = this.userRepository.createQueryBuilder();
            const result = await queryBuilder
                .skip((currentPage - 1) * perPage)
                .take(perPage)
                .getManyAndCount();

            const [users, count] = result;

            return { users, count, currentPage, perPage };
        }
        const [users, count] = await this.userRepository.findAndCount({
            where: { tenant: { id: tenantId } },
        });

        return {
            users,
            count,
            perPage,
            currentPage,
        };
    }

    async updateUserById(id: number, dataToUpdate: UserDetailsToUpdate) {
        try {
            return await this.userRepository.update({ id }, dataToUpdate);
        } catch (error) {
            const err = createHttpError("Error updating user");
            throw err;
        }
    }

    async deleteUserById(id: number) {
        try {
            return await this.userRepository.delete(id);
        } catch (error) {
            const err = createHttpError("Error deleting tenant");
            throw err;
        }
    }
}
