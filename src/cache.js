// TODO útfæra redis cache
import redis from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';

dotenv.config();

export let getEarthquakes;
export let setEarthquakes;


const {
  REDIS_URL: redis_url 
} = process.env;

try {
  if (!redis_url) {
    throw Error('No redis url');
  }

  const client = redis.createClient({
    url: redis_url,
  });

  const getAsync = promisify(client.get).bind(client);
  const setAsync = promisify(client.set).bind(client);

  getEarthquakes = async (key) => {
    let earthquakes = await getAsync(key);
    return earthquakes;
  }

  setEarthquakes = async (key, earthquakes) => {
    await setAsync(key, earthquakes);
  }
}
catch (e) {
  console.error('Error setting up redis client, running without cache', e);
  getEarthquakes = async (key) => { return false};
  setEarthquakes = async (key, value) => { return }
}
