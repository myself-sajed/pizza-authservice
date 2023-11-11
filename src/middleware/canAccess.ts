import { NextFunction, Request, Response } from "express";
import { RequestWithAuthInfo } from "../types";
import createHttpError from "http-errors";

export default (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as RequestWithAuthInfo;
        const roleFromToken = _req.auth.role;

        if (!roles.includes(roleFromToken)) {
            const err = createHttpError(
                403,
                "User is not Authorized to create a Tenant",
            );
            next(err);
            return;
        } else {
            next();
        }
    };
};
