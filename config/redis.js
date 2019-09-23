const redis = require("async-redis");

function redisConnect() {

    client = redis.createClient();

    client.on("connect", () => {
        console.log(" Redis connected  ")
    })

    client.on("error", (err) => {
        console.log("ERROR in redis connection ",err)
        process.exit();
    })

    client.on("disconnect", () => {
        console.log(" Redis disconnected ")
        process.exit();
    })
}
module.exports = {redisConnect}
    
