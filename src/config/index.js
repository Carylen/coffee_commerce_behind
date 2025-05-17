import jwt from 'jsonwebtoken'
import express from 'express'

const PORT = process.env.PORT
const jwt = {
    secret_key : process.env.JWT_SECRET_KEY,
    expires_in : process.env.JWT_EXPIRES_IN
}

// const express = express
export default { PORT, jwt, express }