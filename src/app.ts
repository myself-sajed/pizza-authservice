import express, { Request, Response, NextFunction } from "express";
import createHttpError, { HttpError } from "http-errors";

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get("/", (req, res) => {
    const err = createHttpError(401, "Something went wrong");
    throw err;
    // res.send({ status: "success" });
});

// Global error handling
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
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
