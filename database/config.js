const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect( process.env.MONGO_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
    
        console.log('DB online');

    } catch (error) {
        console.log(error);
        throw new Error('DB offline couldnt connect');
    }
}

module.exports = {
    dbConnection
}
