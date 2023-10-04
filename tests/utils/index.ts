import { DataSource } from "typeorm";

export const trucateTables = async (connection: DataSource) => {
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
        const user = connection.getRepository(entity.name);
        await user.clear();
    }
};
