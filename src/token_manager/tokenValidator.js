import { body } from "express-validator";

const uploadHistoryToken = [
    body('token_type')
        .notEmpty().withMessage('token_type cannot be empty.'),
    body('token_usage')
        .notEmpty().withMessage('token_usage cannot be empty')
        .bail()
        .custom((value) => {
            if(typeof value != 'number') {
                throw new Error("token_usage must be a number or integer");
            }
            return true
        })
        // .toInt().isInt().withMessage('token_usage must be Integer')
]

const checkHistoryToken = [
    body('date_usage')
        .notEmpty().withMessage('date_usage cannot be empty.')
        .bail()
        .custom((value) => {
            const validFormat = dayjs(value, "YYYY-MM-DD", true).isValid()
            if(!validFormat) {
                throw new Error("Please use right format 'YYYY-MM-DD'");
            }
            return true
        })
]

export {uploadHistoryToken, checkHistoryToken}