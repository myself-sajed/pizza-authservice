import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        isEmail: true,
        notEmpty: true,
        errorMessage: "Please enter a valid email",
    },
});

// export default body("email").notEmpty().withMessage("Email is required.");
