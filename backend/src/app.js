const express = require('express');
const cors = require('cors');
const searchRoutes = require('./routes/searchRoutes');
const errorHandler = require('./middlewares/errorHandler');
const morgan = require("morgan");
const pool  = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));

pool.query("SELECT NOW()")
    .then(()=> console.log("DB Connected"))
    .catch(console.error);

app.use('/api', searchRoutes);

app.use(errorHandler);

module.exports = app;
