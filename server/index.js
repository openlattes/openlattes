import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';

import './env'; // dotenv
import resolvers from './api/resolvers';
import typeDefs from './api/schema';

// Express
const app = express();
const port = 3000;

// Mongoose
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
const db = mongoose.connection;
/* eslint-disable no-console */
db.on('error', console.error.bind(console, 'connection error:'));
/* eslint-enable no-console */

// Apollo
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

// Parcel
app.use(express.static(path.resolve(__dirname, '../dist/public')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/public/index.html'));
});

/* eslint-disable no-console */
app.listen(port, () =>
  console.log(`Server ready at port ${port}`));
/* eslint-enable no-console */
