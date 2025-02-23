// src/app.ts
import { ApolloServer } from 'apollo-server';
import schema from './interfaces/graphql/schema';
import connectDB from './infrastructure/database/database';
import FruitModel from "./domain/models/FruitModel";

const startServer = async () => {
    await connectDB();

    const server = new ApolloServer({
        schema,
        context: () => ({
            models: {
                FruitModel,
            },
        }),
    });

    server.listen().then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
    });
};

startServer();
