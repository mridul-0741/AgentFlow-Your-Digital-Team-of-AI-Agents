import Redis from "ioredis";

let redis = null;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    lazyConnect: true,
    maxRetriesPerRequest: 0,
    enableOfflineQueue: false,
  });

  console.log("Redis initialized (temporary safe mode)");
} catch (err) {
  console.log("Redis disabled:", err.message);
}

export default redis;