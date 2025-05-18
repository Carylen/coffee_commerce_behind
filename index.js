import express from 'express'
import cors from 'cors'
import sql from './src/db_helper/neon_utils.js'
import tokenRouter from './src/token_manager/tokenController.js'
import userRouter from './src/users/userController.js'
import requestID from 'express-request-id'
import jwt from 'jsonwebtoken'

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestID());


const table_name = process.env.TABLE_TOKEN

app.use((req, res, next) => {
    console.log(`Request ID: ${req.id}, Method: ${req.method}, URL: ${req.url}`);
    console.log(req.body)
    next();
});
// Simple route
app.get('/', async(req, res) => {
    res.status(200).json({'messages': 'Hi from Bekasi!'})
})

app.use("/tokenize", tokenRouter)
app.use("/user", userRouter)

// Start server

app.listen( () => {
    console.log(`Table Name : ${table_name}`)
    console.log(`Server running on port ${process.env.PORT}`);
    // console.log(`JWT_SECRET_KEY: ${process.env.JWT_SECRET_KEY}`)
});

