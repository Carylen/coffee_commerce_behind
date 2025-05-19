import config from "../config/index.js";
import userService from "./userService.js"
import { logPrettier } from "../log_helper/logHistory.js";
import { userCredentials, userByEmail, userUpdate } from "./userValidation.js";
import { validationResult } from "express-validator";

const router = config.express.Router()

const table_name = process.env.TABLE_USER
router.get('/get-all', async(req, res, next) => {
    try {
        const result = await userService.getAll()
        console.log(logPrettier('SUCCESS', req.id, result))
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
})

router.post('/get-by-email', userByEmail, async(req, res, next) => {
    try {
        const { email } = req.body;

        const validationError = validationResult(req)
        if(!validationError.isEmpty()) { 
            const err = new Error(validationError.array().map(err => err.msg))
            err.statusCode = 400
            err.status = 'VALIDATION ERROR'
            throw err
        }   

        const result = await userService.getByEmail(email)
        console.log(logPrettier('SUCCESS', req.id, result))
        
        res.status(200).json(result); 
    } catch (error) {
        next(error)       
    }
})

router.put('/update', userUpdate, async(req, res, next) => {
    try {
        const { user_name, email, password } = req.body;

        const validationError = validationResult(req)
        if(!validationError.isEmpty()) { 
            const err = new Error(validationError.array().map(err => err.msg))
            err.statusCode = 400
            err.status = 'VALIDATION ERROR'
            throw err
        }

        const updateData = {};
        if (user_name) updateData.user_name = user_name;
        if (password) updateData.password = password;

        if (Object.keys(updateData).length === 0) {
            const err = new Error("No fields to update")
            err.statusCode = 400
            err.status = 'FAILED'
            throw err
        }
        const result = userService.updateUser(email, updateData)
        res.status(201).json(result)

    } catch (error) {
        next(error)
    }
    

    // const result = toke
})

router.post('/register', userCredentials, async(req, res, next) => {
    try {
        const { user_name, email, password } = req.body;
    
        const validationError = validationResult(req)
        if(!validationError.isEmpty()) { 
            const err = new Error(validationError.array().map(err => err.msg))
            err.statusCode = 400
            err.status = 'VALIDATION ERROR'
            throw err
        }
        
        const result = await userService.registerUser(user_name, email, password)
        console.log(logPrettier('SUCCESS', req.id, result))

        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
})

export default router