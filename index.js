import express from 'express'
import cors from 'cors'
import sql from './src/db_helper/neon_utils.js'
import CustomParseFormat from 'dayjs/plugin/customParseFormat.js'
import dayjs from 'dayjs'
import token_helper from './src/token_manager/tokenRepository.js'

const app = express();
app.use(cors());
app.use(express.json());
dayjs.extend(CustomParseFormat)

const table_name = process.env.TABLE_TOKEN

// Simple route
app.get('/', async(req, res) => {
    res.status(200).json({'messages': 'Hi from Bekasi!'})
})

app.get('/get-all-history', async(req, res) => {
    const result = await token_helper.historyToken()
    if(result.message) {
        console.error(result.message)
        return res.status(404).json({ message : result.message })
    }
    console.log(result)
    res.status(200).json(result);
});

app.post('/get-today-cost', async(req, res) => {
    const { date_usage } = req.body;

    if(!date_usage || date_usage.trim() == '') {
        res.status(400).json({ messages : '{date_usage} cannot be empty'})
    }
    else if(dayjs(date_usage, "YYYY-MM-DD", true).isValid() == false) {
        res.status(400).json({ messages : "please use right format 'YYYY-MM-DD'" })
    }
    const result = await token_helper.costToken(date_usage)
    if(result.message) {
        console.error(result.message)
        return res.status(404).json({ message : result.message })
    }
    console.log(result)
    res.status(200).json(result);
});

app.post('/insert-token', async(req, res) => {
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
    try {
        const result = await sql`
        INSERT INTO ${sql.unsafe(table_name)} (token_type, token_usage, total_cost)
        VALUES (${token_type}, ${token_usage}, ${cost})
        RETURNING *;
        `;

        res.status(201).json(result[0]);
    } catch (error) {
        console.log(`Error : ${error.message}`)
        res.status(500).json({ error: error.message })
    }
})

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Table Name : ${table_name}`)
  console.log(`Server running on port ${PORT}`);
});
