require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT || 3000;

//Database connection
const url = 'mongodb://localhost/node-api'
mongoose.connect(url, { useNewUrlParser: true,
                        useCreateIndex:true,
                        useUnifiedTopology: true,
                        useFindAndModify: true});

const connection = mongoose.connection

connection.once('open', () => {
    console.log('Database connected');
}).catch(err => {
     console.log('Database error');
})

//
app.use(express.json())
//Routes
const articlesRoutes = require('./routes/articles')
const registerRoutes = require('./routes/register')
const loginRoutes = require('./routes/login')
const userRoutes = require('./routes/user')
const refreshRoutes = require('./routes/refresh')
const logoutRoutes = require('./routes/logout')

app.use('/api/articles', articlesRoutes)
app.use('/api/register', registerRoutes)
app.use('/api/login', loginRoutes)
app.use('/api/user', userRoutes)
app.use('/api/refresh', refreshRoutes)
app.use('/api/logout', logoutRoutes)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})