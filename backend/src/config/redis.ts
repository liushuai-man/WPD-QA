import { createClient, type RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = parseInt(process.env.REDIS_PORT || '6380', 10);
const redisPassword = process.env.REDIS_PASSWORD;

let redisClient: RedisClientType | null = null;

async function initRedis(): Promise<RedisClientType> {
  redisClient = createClient({
    socket: {
      host: redisHost,
      port: redisPort,
    },
    password: redisPassword || undefined,
  });

  redisClient.on('error', (err) => {
    console.error('❌ Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('ready', () => {
    console.log('🚀 Redis is ready to accept commands');
  });

  redisClient.on('reconnecting', () => {
    console.log('🔄 Redis is reconnecting...');
  });

  redisClient.on('end', () => {
    console.log('🔌 Redis connection closed');
  });

  await redisClient.connect();
  return redisClient;
}

export { initRedis };
export type { RedisClientType };
