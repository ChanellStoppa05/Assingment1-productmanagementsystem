
import { createClient } from "redis";

// Create a connection to Redis Cloud
const redisClient = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,

   socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
}
});

// Display connection errors in the terminal
redisClient.on("error", (error) => {
    console.error("Redis connection error:", error);
});

// Connect to Redis when needed
export async function getRedisClient() {

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    return redisClient;
}
