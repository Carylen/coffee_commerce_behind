import express from 'express'
import CustomParseFormat from 'dayjs/plugin/customParseFormat.js'
import tokenHelper from './tokenRepository.js'
import dayjs from 'dayjs'

const router = express.Router()
dayjs.extend(CustomParseFormat)


router.get('/get-all-history', async(req, res) => {
    const result = await tokenHelper.historyToken()
    if(result.message) {
        console.error(result.message)
        res.status(404).json({ message : result.message })
    }
    console.log(result)
    res.status(200).json(result);
});

router.post('/get-today-cost', async(req, res) => {
    const { date_usage } = req.body;

    if(!date_usage || date_usage.trim() == '') {
        res.status(400).json({ messages : '{date_usage} cannot be empty'})
    }
    else if(dayjs(date_usage, "YYYY-MM-DD", true).isValid() == false) {
        res.status(400).json({ messages : "please use right format 'YYYY-MM-DD'" })
    }
    
    const result = await tokenHelper.costToken(date_usage)
    if(result.message) {
        console.error(result.message)
        res.status(404).json({ message : result.message })
    }
    console.log(result)
    res.status(200).json(result);
});

router.post('/insert-token', async(req, res) => {
    const {token_type, token_usage} = req.body
    let cost = 0
    
    if (!token_type || !token_usage) {
        res.status(400).json({ error: 'Missing token_type or token_usage' });
    }

    if (token_type.trim().toLowerCase() == 'input_token') {
        // For calculate the input_token
        cost = (token_usage / 1000000 * 16520 * 0.075).toFixed(2)
        console.log(`Token Type : ${token_type}\nToken Usage : ${token_usage}\nCost : ${cost}`)
    }
    else{
        // For calculate the output_token
        cost = (token_usage / 1000000 * 16520 * 0.30).toFixed(2)
        console.log(`Token Type : ${token_type}\nToken Usage : ${token_usage}\nCost : ${cost}`)
    }
    
    const result = await tokenHelper.insertHistoryToken(token_type, token_usage, cost)
    if(result.message) {
        console.error(result.message)
        res.status(404).json({ message : result.message })
    }
    console.log(result)
    res.status(200).json(result);
})

export default router