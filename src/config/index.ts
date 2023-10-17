import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PASS,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    REFRESH_TOKEN_SECRET,
} = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PASS,
    DB_PORT,
    DB_NAME,
    DB_USERNAME,
    REFRESH_TOKEN_SECRET,
};
