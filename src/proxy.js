// TODO útfæra proxy virkni
import express from 'express';
import fetch from 'node-fetch';
import { timerStart, timerEnd } from './time.js';
import { getEarthquakes, setEarthquakes } from './cache.js';

export const router = express.Router();

const periods = ['hour', 'day', 'week', 'month'];
const types = ['significant', '4.5', '2.5', '1.0', 'all'];

function sanitizePeriod(period) {
  if (periods.includes(period)) {
    return period;
  }
  return false;
}

function santizeType(type) {
  if (types.includes(type)) {
    return type;
  }
  return false;
}

router.get('/proxy', (req, res, next) => {
  let {
    period, type,
  } = req.query;

  period = sanitizePeriod(period);
  type = santizeType(type);

  if (!period || !type) {
    res.status(400).json({ error: 'bad query parameters' });
    return;
  }
  req.query.period = period;
  req.query.type = type;
  next();
});

router.get('/proxy', async (req, res) => {
  const {
    period, type,
  } = req.query;

  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;

  let result;

  const startTime = timerStart();
  // Athuga cache
  try {
    result = await getEarthquakes(`${period}_${type}`);
  } catch (e) {
    console.error('error getting from cache', e);
  }

  if (result) {
    const data = {
      data: JSON.parse(result),
      info: {
        cached: true,
        time: timerEnd(startTime),
      },
    };
    res.json(data);
    return;
  }

  // Ná í gögn frá earthquakes.usgs.gov
  try {
    result = await fetch(URL);
  } catch (e) {
    console.error('Villa við að sækja gögn frá vefþjónustu', e);
    res.status(500).send('Villa við að sækja gögn frá vefþónustu');
    return;
  }

  if (!result.ok) {
    console.error('Villa frá vefþjónustu', await result.text());
    res.status(500).send('Villa við að sækja gögn frá vefþjónustu');
    return;
  }

  // TODO setja gögn í cache
  const resultText = await result.text();
  await setEarthquakes(`${period}_${type}`, resultText);

  const gogn = {
    data: JSON.parse(resultText),
    info: {
      cached: false,
      time: timerEnd(startTime),
    },
  };
  res.json(gogn);
});
