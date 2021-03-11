// TODO útfæra redis cache
import redis from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

export let getEarthquakes; // eslint-disable-line import/no-mutable-exports
export let setEarthquakes; // eslint-disable-line import/no-mutable-exports

const {
  REDIS_URL: redisUrl,
} = process.env;

try {
  if (!redisUrl) {
    throw Error('No redis url');
  }

  const client = redis.createClient({
    url: redisUrl,
  });

  const getAsync = promisify(client.get).bind(client);
  const setAsync = promisify(client.set).bind(client);

  getEarthquakes = async (key) => {
    const earthquakes = await getAsync(key);
    return earthquakes;
  };

  setEarthquakes = async (key, earthquakes) => {
    await setAsync(key, earthquakes);
  };
} catch (e) {
  console.error('Error setting up redis client, running without cache', e);
  getEarthquakes = async (key) => false; // eslint-disable-line no-unused-vars
  setEarthquakes = async (key, value) => { }; // eslint-disable-line no-unused-vars
}
