import express from 'express'
import cors from 'cors'
import sql from './src/db_helper/neon_utils.js'

const app = express();
app.use(cors());
app.use(express.json());

const table_name = process.env.TABLE_TOKEN

// Simple route
app.get('/', async (req, res) => {
    // const rows = await sql.query('SELECT *  FROM users WHERE user_id = ANY($1)', [[1, 2]])
    const rows = await sql`SELECT * FROM ${sql.unsafe(table_name)}`;
    // const user_name = rows.map((e) => (e.user_name))
    console.log(rows)
    res.send(rows);
});

app.post('/insert-token', async(req, res) => {
    const {token_type, token_usage} = req.body
    let cost = 0
    
    if (!token_type || !token_usage) {
        return res.status(400).json({ error: 'Missing token_type or token_usage' });
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
