import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from ".";

export const AppDataSource = new DataSource({
    type: "postgres",
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    host: Config.DB_HOST,
    password: Config.DB_PASS,
    database: Config.DB_NAME,
    // dont use synchronize in production
    synchronize: Config.NODE_ENV === "test" || Config.NODE_ENV === "dev",
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
