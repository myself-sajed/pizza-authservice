import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";

export const AppDataSource = new DataSource({
    type: "postgres",
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    host: Config.DB_HOST,
    password: Config.DB_PASS,
    database: Config.DB_NAME,
    // dont use synchronize in production
    synchronize: false,
    logging: false,
    entities: ["src/entity/*.ts"],
    migrations: ["src/migration/*.ts"],
    subscribers: [],
});
