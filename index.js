import express from 'express'
import cors from 'cors'
import sql from './src/db_helper/neon_utils.js'

const app = express();
app.use(cors());
app.use(express.json());

// Simple route
app.get('/', async (req, res) => {
    // const rows = await sql.query('SELECT *  FROM users WHERE user_id = ANY($1)', [[1, 2]])
    const rows = await sql`SELECT * FROM token_usage_history`;
    // const user_name = rows.map((e) => (e.user_name))
    console.log(rows)
    res.send(rows);
});

app.post('/insert-token', async(req, res) => {
    const {token_type, total_token} = req.body

    if (!token_type || !total_token) {
        return res.status(400).json({ error: 'Missing token_type or total_token' });
    }
    
    try {
        const result = await sql`
        INSERT INTO token_usage_history (token_type, total_token)
        VALUES (${token_type}, ${total_token})
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
  console.log(`Server running on port ${PORT}`);
});
