const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');
const process = require('process');

mongoose.connect('mongodb+srv://graphql-user:efV5FFzyuZtNJ2IH@cluster0.rkp0r.mongodb.net/graphql-db', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log("Database has been connected")
})

const port = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema
}));

app.listen(port, () => {
    console.log("Listening GraphQL on port 4000");
})