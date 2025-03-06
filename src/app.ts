import { ApolloServer } from "apollo-server";
import schema from "./interfaces/graphql/schema";
import connectDB from "./infrastructure/database/database";
import FruitModel from "./domain/models/FruitModel";
import "./shared/cron/processOutbox";
import {startOutboxProcessor} from "./shared/cron/processOutbox";

export let serverInstance: ApolloServer | null = null

export const startServer = async () => {
    await connectDB();

    const server = new ApolloServer({
        schema,
        context: () => ({
            models: {
                FruitModel,
            },
        }),
    });

    const { url, server: httpServer } = await server.listen(); // Start the Apollo server

    serverInstance = server; // Save server instance

    console.log(`🚀 Server ready at ${url}`);

    return httpServer; // Return the underlying HTTP server instance
};

// Function to stop the server
export const stopServer = async () => {
    if (serverInstance) {
        await serverInstance.stop(); // Gracefully stop the Apollo server
    }
    // Ensure DB connection is closed
    const mongoose = require('mongoose');
    await mongoose.connection.close();
};

if (require.main === module) {
    startServer();
    startOutboxProcessor()
}
