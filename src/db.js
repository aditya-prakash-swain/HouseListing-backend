const mongoose = require('mongoose');

module.exports = {
    connect: DB_Host => {
        mongoose.connect(DB_Host, /*{ useNewUrlParser: true, useUnifiedTopology: true }*/);
        mongoose.connection.on('error', err => {
            console.error('Error connecting to database:', err);
            process.exit();
        });
        mongoose.connection.once('open', () => { console.log('Connected to MongoDB');});

    },
    close: () => {
        mongoose.connection.close();
    }
}