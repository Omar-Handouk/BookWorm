'use strict';

const carService
  = require('../services/service-manager').get('carService');
const express = require('express');

const router = express.Router();

module.exports = (app) => {
  router.get('/all', (req, res) => {
    carService.getAllCars((documents) => {
      console.log(documents);
    })
  });

  app.use('/cars', router);
};