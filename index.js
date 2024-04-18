const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const userRoutes = require('./userRoutes')

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Db connected');
})

app.use('/api/', userRoutes);

app.listen(8000, () => {
    console.log('Server started');
})