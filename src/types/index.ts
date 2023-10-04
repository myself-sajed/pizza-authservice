import { Request } from "express";

export interface UserInfo {
    name: string;
    email: string;
    password: string;
}

export interface RequestWithUserInfo extends Request {
    body: UserInfo;
}
