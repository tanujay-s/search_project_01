require('dotenv').config();
const app = require('./app');
const initElastic = require('./config/initElastic');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await initElastic();

        app.listen(PORT, () => {
            console.log('Server is running on port: ', PORT);
        });
        
    } catch (err) {
        console.error('Failed to start server: ', err);
    }
}

startServer();
