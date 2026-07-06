const cookieParser= require('cookie-parser')
const express = require('express')
const authRouter=require('./routes/authRouter')
const transactionRouter=require('./routes/transactionRouter')
const cors=require('cors')


const app = express()
app.use(
  cors({
    origin: ["http://localhost:5173","https://personal-expense-tracker-sand-pi.vercel.app/"], // your Vite dev server
    credentials: true,
  })
);
app.use(express.json())

const connectDB=require('./db/db')
const dotenv= require('dotenv')
dotenv.config()
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRouter)
app.use('/api/transaction', transactionRouter)

module.exports=app