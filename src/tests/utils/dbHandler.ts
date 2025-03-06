import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

/**
 * Connect to the in-memory database.
 */
export const connectDB = async () => {
    // Start an in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect Mongoose to the in-memory server
    await mongoose.connect(uri, {
        // Additional options if needed
    });
    console.log('Connected to in-memory MongoDB');
};

/**
 * Close the database connection and stop the memory server.
 */
export const closeDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

/**
 * Clear all data in the database.
 */
export const clearDB = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany({});
    }
};

export async function processAllOutboxEvents() {
    return new Promise((resolve) => {
        setTimeout(resolve, 11000); // Wait for 2s to allow event processing
    });
}

