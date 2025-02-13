import { Redis } from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";
import config from "../config";

export let client: Redis;
export let pubsubPublisher: Redis;
export let pubsubSubscriber: Redis;
export let pubsub: RedisPubSub;

export async function startRedis() {
    if (!client) {
        client = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            username: config.redis.username,
            password: config.redis.password,
            db: config.redis.database,
            maxRetriesPerRequest: null,
            retryStrategy: (times) => Math.min(times * 50, 2000),
        });

        client.on("connect", () => console.log("✅ Connected to Redis"));
        client.on("error", (err) => console.error("❌ Redis Error:", err));

        await new Promise((resolve) => client.once("ready", resolve));
    }

    if (!pubsubPublisher) {
        pubsubPublisher = client.duplicate();
        pubsubPublisher.on("connect", () => console.log("✅ PubSub Publisher Connected"));
        pubsubPublisher.on("error", (err) => console.error("❌ PubSub Publisher Error:", err));
    }

    if (!pubsubSubscriber) {
        pubsubSubscriber = client.duplicate();
        pubsubSubscriber.on("connect", () => console.log("✅ PubSub Subscriber Connected"));
        pubsubSubscriber.on("error", (err) => console.error("❌ PubSub Subscriber Error:", err));
    }

    // Initialize PubSub AFTER Redis is ready
    if (!pubsub) {
        pubsub = new RedisPubSub({
            publisher: pubsubPublisher,
            subscriber: pubsubSubscriber,
            connectionListener: (err) => {
                if (err) {
                    console.error("❌ Error connecting to Redis PubSub:", err);
                } else {
                    console.log("✅ Connected to Redis PubSub");
                }
            },
        });
    }
}
