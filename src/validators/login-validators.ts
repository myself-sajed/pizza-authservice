import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        isEmail: true,
        notEmpty: true,
        errorMessage: "Please enter a valid email",
    },
    password: {
        notEmpty: true,
        errorMessage: "Please enter a valid password",
        isLength: {
            options: { min: 8 }, // Minimum length of 8 characters
            errorMessage: "Password must be at least 8 characters long",
        },
    },
});
