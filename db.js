const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connect = async () => {
    if (mongoose.connection.readyState !== 0) {
        return;
    }

    mongoServer = await MongoMemoryServer.create({
        binary: {
            version: '6.0.14'
        }
    });
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB Memory Server connected at ${uri}`);
};

const disconnect = async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
};

module.exports = { connect, disconnect };
