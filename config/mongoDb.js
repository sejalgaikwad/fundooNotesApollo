const mongoose = require("mongoose");

function mongoConnect(){
   // connection to mongoose
   mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true });
   // mongoose disconnected 
   mongoose.connection.on('disconnected',function(){
       console.log("connection to mongoose disconnected");
       process.exit();
   })
   // mongoose error
   mongoose.connection.on('error',function(err){
       console.log("ERROR",err)
       process.exit();
   })
   mongoose.connection.on("connected", () => {
    console.log("Successfully connected to the database");
  })
   }
   module.exports ={
       mongoConnect
   }

