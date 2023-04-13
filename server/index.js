const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const {MONGODB_LINK} = require('../environment');

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const MONGODB = MONGODB_LINK;

const options = {
    useNewUrlParser: true,
}

mongoose.connect(MONGODB, options)
    .then(() => {
        console.log("Connection is Fine!")
        return server.listen({port: 5555})
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    })