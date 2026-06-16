import { initRedis, type RedisClientType } from '../config/redis';

let redisPromise: Promise<RedisClientType> | null = null;
let redisClientInstance: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisPromise) {
    redisPromise = initRedis().then((client) => {
      redisClientInstance = client;
      return client;
    });
  }
  return redisPromise;
}

export async function setVerificationCode(email: string, code: string) {
  const client = await getRedisClient();
  await client.setEx(`verify:${email}`, 300, code);
}

export async function getVerificationCode(
  email: string
): Promise<string | null> {
  const client = await getRedisClient();
  return client.get(`verify:${email}`);
}

export async function deleteVerificationCode(email: string) {
  const client = await getRedisClient();
  await client.del(`verify:${email}`);
}

export async function setRefreshToken(email: string, token: string) {
  const client = await getRedisClient();
  await client.setEx(`refresh:${email}`, 604800, token);
}

export async function getRefreshToken(email: string): Promise<string | null> {
  const client = await getRedisClient();
  return client.get(`refresh:${email}`);
}

export async function deleteRefreshToken(email: string) {
  const client = await getRedisClient();
  await client.del(`refresh:${email}`);
}

export async function closeRedis() {
  if (redisClientInstance) {
    await redisClientInstance.quit();
    redisClientInstance = null;
    redisPromise = null;
  }
}

export async function setCache(key: string, value: string, ttl: number) {
  const client = await getRedisClient();
  await client.setEx(key, ttl, value);
}

export async function getCache(key: string): Promise<string | null> {
  const client = await getRedisClient();
  const data = await client.get(key);
  return data || null;
}

export async function deleteCache(key: string) {
  const client = await getRedisClient();
  await client.del(key);
}
