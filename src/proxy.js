// TODO útfæra proxy virkni
import express from 'express';

export const router = express.Router();


router.get('/proxy', (req, res) => {
  const {
    period, type
  } = req.query;
  
  // check cache
  // request to geojson
  

  let gogn = {
    'data': [],
    'info': {
      'cached': false, 
      'time': 0.500,
    },
  }
  res.json(gogn);
});