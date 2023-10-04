import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserInfo } from "../types";

export class UserService {
    constructor(private userRepository: Repository<User>) {
        this.userRepository = userRepository;
    }
    async create({ name, email, password }: UserInfo) {
        await this.userRepository.save({ name, email, password });
    }
}
