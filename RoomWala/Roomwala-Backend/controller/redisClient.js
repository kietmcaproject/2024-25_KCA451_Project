import Redis from 'ioredis';

export const redis = new Redis({
    host: `${process.env.redis_host}`,
    port: `${process.env.redis_port}` || 13764,
    password: `${process.env.redis_password}`,
});

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("error", (err) => {
    console.log("Error in Redis connection", err);
});

redis.on("close", () => {
    console.log("Redis connection closed");
});