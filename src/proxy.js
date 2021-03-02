// TODO útfæra proxy virkni
import express from 'express';
import fetch from 'node-fetch';

import { getEarthquakes, setEarthquakes } from './cache.js';

export const router = express.Router();


router.get('/proxy', async (req, res) => {
  const {
    period, type
  } = req.query;
  
  console.log(`Gets request from client for ${period} and ${type}`);
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;

  let result;

  // TODO skoða fyrst cachið
  
  try {
    result = await fetch(URL);
  }
  catch (e) {
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
  
  let gogn = {
    'data': await result.json(),
    'info': {
      'cached': false, 
      'time': 0.500,
    },
  }
  res.json(gogn);
});