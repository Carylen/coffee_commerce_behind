import express from 'express'
import cors from 'cors'
import sql from './src/db_helper/neon_utils.js'
import tokenRoutoer from './src/token_manager/tokenController.js'

const app = express();
app.use(cors());
app.use(express.json());


const table_name = process.env.TABLE_TOKEN

// Simple route
app.get('/', async(req, res) => {
    res.status(200).json({'messages': 'Hi from Bekasi!'})
})

app.use("/tokenize", tokenRoutoer)

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Table Name : ${table_name}`)
  console.log(`Server running on port ${PORT}`);
});
