// TODO útfæra proxy virkni
import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import { timerStart, timerEnd } from './time.js';
import { getEarthquakes, setEarthquakes } from './cache.js';

export const router = express.Router();

dotenv.config();

const {
  EARTHQUAKES_URL: earthquakes_url,
  EARTHQUAKES_DOMAIN: earthquakes_domain
} = process.env;

if(!earthquakes_url || !earthquakes_domain) {
  console.error('Vantar url eða domain fyrir fetch');
  process.exit(1);
}

router.get('/proxy', async (req, res) => {
  const startTime = timerStart();
  const {
    period, type
  } = req.query;
  
  // TODO er þetta secure?
  const URL = `${earthquakes_url}${type}_${period}${earthquakes_domain}`;

  let result;

  // Athuga cache
  try {
    result = await getEarthquakes(`${period}_${type}`);
  }
  catch (e) {
    console.error('error getting from cache', e);
  }

  if(result) {
    let data = {
      'data': JSON.parse(result),
      'info': {
        'cached': true, 
        'time': timerEnd(startTime),
      }
    }
    res.json(data);
    return;
  }

  // Ná í gögn frá earthquakes.usgs.gov
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
  let resultText = await result.text();
  await setEarthquakes(`${period}_${type}`, resultText);

  let gogn = {
    'data': JSON.parse(resultText),
    'info': {
      'cached': false, 
      'time': timerEnd(startTime),
    },
  }
  res.json(gogn);
});