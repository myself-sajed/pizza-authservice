import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserInfo } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";

export class UserService {
    constructor(private userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }
    async create({ name, email, password }: UserInfo) {
        try {
            await this.userRepository.save({
                name,
                email,
                password,
                role: Roles.Customer,
            });
        } catch (error) {
            const err = createHttpError(
                500,
                "Could not save user to the database",
            );
            throw err;
        }
    }
}
