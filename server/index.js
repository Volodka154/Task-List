const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const MONGODB = "mongodb+srv://TestBase:TestBase@database.a9foczx.mongodb.net/test";
//const MONGODB = "mongodb://127.0.0.1:25154";


const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log("Connection is Fine!")
        return server.listen({port: 5555})
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    })









/*const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')
const mongoose = require('mongoose');

console.log(resolvers.Mutation.createMainTask())

const Main = mongoose.model("MainTask", taskSchema);
const task1 = new Main();

const Mini = mongoose.model("MiniTask", miniTaskSchema);

task1.tasks.push(new Mini());
console.log(task1.tasks);*/
