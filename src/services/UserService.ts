import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserInfo } from "../types";
import createHttpError from "http-errors";
import { Roles } from "../constants";
import { hashData } from "./Hashing";

export class UserService {
    constructor(private userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }
    async create({ name, email, password }: UserInfo) {
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
            role: Roles.Customer,
        });

        return newUser;
    }
}
