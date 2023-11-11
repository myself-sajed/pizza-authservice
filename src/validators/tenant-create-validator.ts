import { checkSchema } from "express-validator";

export default checkSchema({
    name: {
        notEmpty: true,
        errorMessage: "Please provide a valid name of the tenant",
    },
    address: {
        notEmpty: true,
        errorMessage: "Please provide a valid address of the tenant",
    },
});
