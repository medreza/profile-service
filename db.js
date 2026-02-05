const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const mongoUri = process.env.MONGO_URI;

const connect = async () => {
    if (mongoose.connection.readyState !== 0) {
        return;
    }

    if (mongoUri) {
        await mongoose.connect(mongoUri);
        console.log(`Connected to external MongoDB at ${mongoUri}`);
    } else {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
        console.log(`MongoDB Memory Server connected at ${uri}`);
    }
};

const disconnect = async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
};

module.exports = { connect, disconnect };
