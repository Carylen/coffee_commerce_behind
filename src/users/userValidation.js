import { body } from "express-validator";


const userCredentials = [
    body('user_name')
    .notEmpty().withMessage('user_name cannot be empty').bail(),
    body('email')
    .notEmpty().withMessage('email cannot be empyt').bail()
    .isEmail().withMessage('email must be in correct format').bail(),
    body('password')
    .isStrongPassword({ minLength: 5 }).withMessage('password at least must be 5 characters').bail()
]

export { userCredentials }