require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'dev'}` })
const express = require('express');
const compression = require('compression');
const { default: helmet } = require('helmet');
const morgan = require('morgan');

const app = express();
// init middleware
app.use(morgan('dev'));
// app.use(morgan('combined')); // => only  for production
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// init db
require('./dbs/init.mongodb');

// init routes
app.use('/', require('./routers'));

// handle error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;