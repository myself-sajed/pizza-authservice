import express, { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import cors from "cors";

// routers
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";
import userRouter from "./routes/user";

import "reflect-metadata";
import cookieParser from "cookie-parser";
import { Config } from "./config";

const ORIGIN_URI = Config.ORIGIN_URI;

const app = express();
app.use(
    cors({
        origin: [ORIGIN_URI!],
        credentials: true,
    }),
);
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Welcome to Auth Service");
});

app.use("/auth", authRouter);
app.use("/tenant", tenantRouter);
app.use("/user", userRouter);

// Global error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default app;
