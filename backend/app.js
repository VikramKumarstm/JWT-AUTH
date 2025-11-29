const express = require('express')
const authRouter = require('./router/authRoute.js');
const databaseConnect = require('./config/databaseConfig.js');
require('dotenv').config();

const app = express();

app.use(express.json())

//database connection
databaseConnect()

app.use('/api/auth/', authRouter)

app.use('/', (req, res) => {
    res.status(200).json({
        data: 'jwt-auth server'
    })
})

module.exports = app