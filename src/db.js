const mongoose = require('mongoose');

module.exports = {
    connect: DB_Host => {
        mongoose.connect(DB_Host, /*{ useNewUrlParser: true, useUnifiedTopology: true }*/);
        mongoose.connection.on('error', err => {
            console.error('Error connecting to database:', err);
            process.exit();
        })

    },
    close: () => {
        mongoose.connection.close();
    }
}