const mongoose = require("mongoose");

function mongoConnect() {
    // connection to mongoose
    mongoose.connect("mongodb://localhost:27017/apollo", { useNewUrlParser: true });

    // mongoose disconnected 
    mongoose.connection.on('disconnected',  () => {
        console.log("connection to mongoose Disconnected");
        process.exit();
    })

    // mongoose error
    mongoose.connection.on('error',  (err) => {
        console.log("ERROR in mongodb Connection", err)
        process.exit();
    })

    // mongoose connected 
    mongoose.connection.on("connected", () =>{
        console.log("Successfully connected to the database");
    })
}
module.exports = { mongoConnect }