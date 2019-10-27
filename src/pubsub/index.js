import { RedisPubSub } from 'graphql-redis-subscriptions';

const REDIS_DOMAIN_NAME = '127.0.0.1';
const PORT_NUMBER = '6379';
const pubsub = new RedisPubSub({
    connection: {
         host: process.env.REDIS_HOST||REDIS_DOMAIN_NAME,
       // host:  REDIS_DOMAIN_NAME,
        port: PORT_NUMBER,
        retry_strategy: options => Math.max(options.attempt * 100, 3000)
    }
});


export default pubsub;