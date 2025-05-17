import config from "../config";
import userHelper from "./userRepository.js"
import { logPrettier } from "../log_helper/logHistory.js";
import { userCredentials } from "./userValidation.js";
import { validationResult } from "express-validator";

const router = config.express.Router()

table_name = process.env.TABLE_USER
router.get('/get-users', async(req, res) => {
    const result = await userHelper.getAllUser()
    if(result.message) {
            console.error(logPrettier('FAILED', req.id, result.message))
            res.status(404).json({ message : result.message })
        }
    console.log(logPrettier('SUCCESS', req.id, result))
    res.status(200).json(result);
})

router.get('/get-user-by-email', userCredentials, async(req, res) => {
    const { email } = req.body;
    const isValid = validationResult(req)
    if(!isValid.isEmpty()) { 
        console.log(logPrettier('VALIDATION ERROR', req.id, isValid, true))
        return res.status(400).json({ messages: isValid.array().map(err => err.msg) })
    }

    const result = await userHelper.getUserByEmail(email)
    
    if(result.message) {
        console.error(logPrettier('FAILED', req.id, result.message))
        res.status(404).json({ message : result.message })
    }
    console.log(logPrettier('SUCCESS', req.id, result))
    res.status(200).json(result); 
})

router.put('/update-user', userCredentials, async(req, res) => {
    const { user_name, email } = req.body;

    const isValid = validationResult(req)
    if(!isValid.isEmpty()) { 
        console.log(logPrettier('VALIDATION ERROR', req.id, isValid, true))
        return res.status(400).json({ messages: isValid.array().map(err => err.msg) })
    }

    const result = toke
})

export default router