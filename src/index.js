const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

// Local module imports
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// Run the server on a port specified in our .env file or port 4000
const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 4000;

db.connect(DB_HOST);

// Apollo Server setup
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => {
        return {
            models,
            // Add other context properties as needed
        };
    }
});

async function startServer() {
    await server.start();
    // Apply the Apollo GraphQL middleware and set the path to /api
    server.applyMiddleware({ app, path: '/api' });
    app.listen({ port }, () =>
        console.log(
            `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
        )
    );
}

// Start server
startServer().catch(error => {
    console.error('Error starting server:', error);
});
