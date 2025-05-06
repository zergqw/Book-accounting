require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bookRouter = require('./routes/bookRoutes')
const errorHandler = require('./utils/errorHandler')

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is running...'
    })
})

app.use('/api/books', bookRouter)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found'
    });
});

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught exception: ', error);
    process.exit(1);
})

process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection: ', error);
    process.exit(1);
})

module.exports = app;