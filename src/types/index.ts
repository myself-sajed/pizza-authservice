import { Request } from "express";

export interface UserInfo {
    name: string;
    email: string;
    password: string;
}

export interface RequestWithUserInfo extends Request {
    body: UserInfo;
}

export interface RequestWithAuthInfo extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
    };
}
export interface IRevokeToken {
    sub: string;
    id: string;
}
export interface ICreateTenantData {
    name: string;
    address: string;
}

export interface RequestWithCreateTenantData extends Request {
    body: ICreateTenantData;
}
export interface RequestWithTenantId extends Request {
    body: {
        id: number;
    };
}

export interface RequestWithTenantUpdateInfo extends Request {
    body: {
        tenantToUpdate: number;
        detailsToUpdate: {
            name?: string;
            address?: string;
        };
    };
}

export interface TenantDetailsToUpdate {
    name?: string;
    address?: string;
}
