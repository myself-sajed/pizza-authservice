import { Response } from "express";
import { RequestWithUserInfo } from "../types";
import { UserService } from "../services/UserService";

export default class AuthController {
    constructor(private userservice: UserService) {
        this.userservice = userservice;
    }

    async register(req: RequestWithUserInfo, res: Response) {
        const { name, email, password } = req.body;
        await this.userservice.create({ name, email, password });
        res.status(201).json({ status: "success" });
    }
}
