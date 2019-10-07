require('dotenv').config()
const {
  ApolloServer
} = require('apollo-server-express')
const express = require('express')
const {
  typeDefs
} = require('./graphql/schema')
//const upload = require('./services/aws').upload;
const resolvers = require('./graphql/resolver').resolvers
const dbConfig = require('./config/mongoDb').mongoConnect() //connection to mongoose
const redisConnection = require('./config/redis').redisConnect() //redis connection
const port = process.env.PORT

const server = new ApolloServer({

  typeDefs,
  resolvers,
  context: ({
    req
  }) => ({
    token: req.query.token,
    origin: req.headers.origin,
    code: req.query.code,
    request: req
  })
})

const app = express()

//app.use("*", upload.single('image'))

server.applyMiddleware({
  app
})

//  start server
app.listen(port, () => {
  console.log('server started on 4000 port')
});