import { Request, Response } from "express";

export default class AuthController {
    register(req: Request, res: Response) {
        res.status(201).json({ status: "success" });
    }
}
