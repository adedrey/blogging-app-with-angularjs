const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const postRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

const app = express();
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended : false}))
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-ALlow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE, OPTIONS")
    next();
})
app.use(postRouter);
app.use(authRouter);
module.exports = app;

