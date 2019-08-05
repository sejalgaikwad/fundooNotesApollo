const redis = require("async-redis");
exports.redisConnection = function(){
client = redis.createClient();
client.on("connect",function(){
    console.log(" redis connected  ")
})
client.on("error",function(){
    console.log("error in redis connection ")
    process.exit();
})
client.on("disconnect",function(){
    console.log(" redis disconnected ")
    process.exit();
})
}