import chalk from "chalk";
// import { Result, ValidationError, validationResult } from "express-validator";


export const logPrettier = (status, reqId, data, isValidation = false) => {
    /** adssad **/
    let logStatus = status.trim().toLowerCase() == 'success'
        ? chalk.green(`[${status}]`)
        : chalk.red(`[${status}]`)
    
    let logId = chalk.blue(`[${reqId}]`)

    let logMessage = isValidation == true
        /** IF theres reach the validations, the format will be : */
        ? chalk.magenta(JSON.stringify(
            data.array().map(e => ({
                errorMessage: e.msg,
                path: e.path
            }))
        ))
        /** IF False, throw the json string */
        : chalk.magenta(JSON.stringify(data))

    return `${logStatus} ${logId} ${logMessage}`
}