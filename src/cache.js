// TODO útfæra redis cache
import redis from 'redis';

const client = redis.client({
  url: 'redis://127.0.0.1:6379/0',
});