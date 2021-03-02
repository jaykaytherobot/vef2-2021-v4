// TODO útfæra redis cache
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379/0',
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