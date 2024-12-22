const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Local module imports
const db = require('./db');
const models = require('./models');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();

// Add CORS middleware with more permissive settings
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const DB_HOST = process.env.DB_HOST;
const port = process.env.PORT || 4000;

// Connect to MongoDB with error handling
db.connect(DB_HOST).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

const getUser = token => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return null;
  }
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    console.log('Incoming request headers:', req.headers);
    const token = req.headers.authorization?.replace('Bearer ', '');
    const user = getUser(token);
    return { models, user };
  },
  formatError: (err) => {
    console.error('GraphQL Error:', err);
    return {
      message: err.message,
      path: err.path,
      locations: err.locations,
    };
  },
});

async function startServer() {
  try {
    await server.start();
    
    server.applyMiddleware({
      app,
      path: '/api',
      cors: false,
    });

    app.listen({ port }, () => {
      console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
