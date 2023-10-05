import bcrypt from "bcrypt";

export const hashData = async (dataToHash: string) => {
    // password hashing using bcrypt
    const saltRounds = 10;
    return await bcrypt.hash(dataToHash, saltRounds);
};
