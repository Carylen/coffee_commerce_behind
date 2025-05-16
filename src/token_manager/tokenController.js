import express from 'express'
import CustomParseFormat from 'dayjs/plugin/customParseFormat.js'
import { uploadHistoryToken, checkHistoryToken } from './tokenValidator.js'
import tokenHelper from './tokenRepository.js'
import dayjs from 'dayjs'
import { validationResult } from 'express-validator'
import chalk from 'chalk'
import { logPrettier } from '../log_helper/logHistory.js'

const router = express.Router()
dayjs.extend(CustomParseFormat)


router.get('/get-all-history', async(req, res) => {
    const result = await tokenHelper.historyToken()
    if(result.message) {
        console.error(logPrettier('FAILED', req.id, result.message))
        res.status(404).json({ message : result.message })
    }
    console.log(logPrettier('SUCCESS', req.id, result))
    res.status(200).json(result);
});

router.post('/get-today-cost', checkHistoryToken, async(req, res) => {
    const { date_usage } = req.body;
    // Validate the request.body
    const isValid = validationResult(req)
    if (!isValid.isEmpty()) {
        console.log(logPrettier('VALIDATION ERROR', req.id, isValid, true))
        return res.status(400).json({ messages: isValid.array().map(err => err.msg) });
    }
    // Insert to DB
    const result = await tokenHelper.costToken(date_usage)

    if(result.message) {
        console.log(logPrettier('FAILED', req.id, result.message))
        res.status(404).json({ message : result.message })
    }
    console.log(logPrettier('SUCCESS', req.id, result))
    res.status(200).json(result);
});

router.post('/insert-token', uploadHistoryToken, async(req, res) => {
    const {token_type, token_usage} = req.body
    
    const isValid = validationResult(req)
    if (!isValid.isEmpty()) {
        console.log(logPrettier('VALIDATION ERROR', req.id, isValid, true))
        return res.status(400).json({ 
            messages: isValid.array().map(err => ({
                field :err.path, 
                error : err.msg
            })) 
        });
    }
    
    const result = await tokenHelper.insertHistoryToken(token_type, token_usage)

    if(result.message) {
        console.error(logPrettier('FAILED', req.id, result.message))
        res.status(404).json({ message : result.message })
    }
    console.log(logPrettier('SUCCESS', req.id, result))
    res.status(200).json(result);
})

export default router