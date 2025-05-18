import config from "../config";
import userService from "./userService.js"
import { logPrettier } from "../log_helper/logHistory.js";
import { userCredentials } from "./userValidation.js";
import { validationResult } from "express-validator";

const router = config.express.Router()

table_name = process.env.TABLE_USER
router.get('/get-all', async(req, res) => {
    const result = await userService.getAll()
    if(result.message) {
        console.error(logPrettier('FAILED', req.id, result.message))
        res.status(404).json({ message : result.message })
    }
    console.log(logPrettier('SUCCESS', req.id, result))
    res.status(200).json(result);
})

router.get('/get-by-email', userCredentials, async(req, res) => {
    const { email } = req.body;
    const isValid = validationResult(req)
    if(!isValid.isEmpty()) { 
        console.log(logPrettier('VALIDATION ERROR', req.id, isValid, true))
        return res.status(400).json({ messages: isValid.array().map(err => err.msg) })
    }

    const result = await userService.getByEmail(email)
    
    if(result.message) {
        console.error(logPrettier('FAILED', req.id, result.message))
        res.status(404).json({ message : result.message })
    }
    console.log(logPrettier('SUCCESS', req.id, result))
    res.status(200).json(result); 
})

router.put('/update', userCredentials, async(req, res) => {
    const { user_name, email } = req.body;

    const isValid = validationResult(req)
    if(!isValid.isEmpty()) { 
        console.log(logPrettier('VALIDATION ERROR', req.id, isValid, true))
        return res.status(400).json({ messages: isValid.array().map(err => err.msg) })
    }

    // const result = toke
})

router.post('/register', userCredentials, async(req, res) => {
    const { user_name, email, password } = req.body;

    const isValid = validationResult(req)
    if(!isValid.isEmpty()) { 
        console.log(logPrettier('VALIDATION ERROR', req.id, isValid, true))
        return res.status(400).json({ messages: isValid.array().map(err => err.msg) })
    }

    const result = await userService.insertNewUser(user_name, email, password)

    if(result.message) {
        console.error(logPrettier('FAILED', req.id, result.message))
        res.status(404).json({ message : result.message })
    }
    console.log(logPrettier('SUCCESS', req.id, result))
    res.status(200).json(result);
})

export default router