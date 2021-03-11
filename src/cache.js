// TODO útfæra redis cache
import redis from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

const {
  REDIS_URL: redis_url 
} = process.env;

if(!redis_url) {
  console.error("Vantar redis url");
  process.exit(1);
}

const client = redis.createClient({
  url: redis_url,
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

export async function getEarthquakes(key) {
  let earthquakes = await getAsync(key);
  return earthquakes;
}

export async function setEarthquakes(key, earthquakes) {
  await setAsync(key, earthquakes);
}