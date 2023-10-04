import express from "express";
import AuthController from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userservice = new UserService(userRepository);
const authController = new AuthController(userservice);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/register", (req, res) => authController.register(req, res));

export default router;
