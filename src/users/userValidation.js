import { body } from "express-validator";


const userCredentials = [
    body('user_name')
    .notEmpty().withMessage('user_name cannot be empty'),
    body('email')
    .notEmpty().withMessage('email cannot be empyt')
    .isEmail().withMessage('email must be in correct format'),
    body('password')
    .isLength({ min: 5 }).withMessage('password must be at least 5 characters')
]
const userByEmail = [
    body('email')
    .notEmpty().withMessage('email cannot be empyt')
    .isEmail().withMessage('email must be in correct format').bail()
]

const userUpdate = [
    body('user_name')
    .optional().notEmpty().withMessage('user_name cannot be empty'),
    body('email')
    .optional()
    .isEmail().withMessage('Email must be valid'),
    body('password')
    .optional()
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
]

export { userCredentials, userByEmail, userUpdate }