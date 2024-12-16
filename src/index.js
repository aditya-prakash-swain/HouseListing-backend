const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
require('dotenv').config();
const db = require('./db');

const app = express();
const DB_HOST = process.env.DB_HOST;

// Run the server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;


let notes = [
    {
        id: '1',
        content: 'This is a note',
        author: 'Adam Scott'
    },
    {
        id: '2',
        content: 'This is another note',
        author: 'Harlow Everly'
    },
    {
        id: '3',
        content: 'Oh hey look, another note!',
        author: 'Riley Harrison'
    }
];

// Construct a schema, using GraphQL's schema language
const typeDefs = gql`
type Note {
  id: ID
  content: String
  author: String
}
type Query {
  hello: String
  notes: [Note]
  note(id: ID): Note
}
type Mutation {
  newNote(content: String!): Note
}
`;

// Provide resolver functions for our schema fields
const resolvers = {
    Query: {
        hello: () => 'Hello world!',
        notes: () => notes,
        note: (parent, args) => {
            return notes.find(note => note.id === args.id);
        }
    },
    Mutation: {
        newNote: (parent, args) => {
            let noteValue = {
                id: notes.length + 1,
                content: args.content,
                author: 'Adam Scott'
            };
            notes.push(noteValue);
            return noteValue;
        }
    }
};

db.connect(DB_HOST);

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /api
async function startServer() {
    await server.start();
    server.applyMiddleware({ app, path: '/api' });
    app.listen({ port }, () =>
        console.log(
            `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
        )
    );
}

//start server
startServer().catch(error => {
    console.error('Error start:', error);
});
