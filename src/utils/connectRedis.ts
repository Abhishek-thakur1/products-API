import { createClient } from 'redis'
import logger from '../shared/Logger';

const redisUrl = 'redis://localhost:6379';

const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        logger.info('Redis client connected successfully!')
        redisClient.set('try', 'Hello Welcome to Express with TypeORM');
    } catch (err) {
        logger.error('Error connecting to Redis', err);
        setTimeout(connectRedis, 5000);
    }
}

connectRedis();

export default redisClient;