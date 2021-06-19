
const cors = require('cors');
const express = require('express');
require('dotenv').config();

const app = express()
app.use(cors());
app.use(express.json());

const route = require('./route');


app.use('/api/v1', route);
app.listen(process.env.PORT, () => {
    console.log(`loading on port ${process.env.PORT} .....`);
});