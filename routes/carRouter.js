'use strict';

const carService = require('../services/service-manager').get('carService');
const validation = require('../validations/car.validate');
const express = require('express');

const router = express.Router();

module.exports = (app) => {
	router.post('/', (req, res) => {
		// TODO: Future enhancement, check for car duplicates

		let carInfo = req.body;

		carInfo['Color'] = carInfo.Color.replace('#', '');

		let { error, value } = validation.create(carInfo); // eslint-disable-line no-unused-vars

		if (error) {
			res.json({ Details: error.details[0].message.replace(/"/g, '') });
		} else {
			carService.createCar(carInfo, () => {
				res.redirect('/admin?carAdded=1');
			});
		}
	});

	router.get('/', (req, res) => {
		carService.getCarByQuery(req.query, (response) => {
			res.json(response);
		});
	});

	router.get('/:id', (req, res) => {
		carService.getCarById(req.params.id, (response) => {
			res.json(response);
		});
	});

	router.put('/:id', (req, res) => {
		if (req.params.id === undefined) {
			res.json({ Error: 'Car ID is not supplied' });
		} else {
			let carInfo = req.body;

			let { error, value } = validation.update(carInfo); // eslint-disable-line no-unused-vars

			if (error) {
				res.json({ Details: error.details[0].message.replace(/"/g, '') });
			} else {
				carService.updateCar(carInfo, req.params.id, () => {
					res.redirect('/admin?carUpdated=1');
				});
			}
		}
	});

	router.delete('/:id', (req, res) => {
		if (req.params.id === undefined) {
			res.json({ Error: 'Car ID is not supplied' });
		} else {
			carService.deleteCar(req.params.id, () => {
				res.redirect('/admin?carDeleted=1');
			});
		}
	});

	app.use('/cars', router);
};
