const express  = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log('Db connected');
})

const app = express();

app.listen(8000, ()=>{
    console.log('Server started');
})