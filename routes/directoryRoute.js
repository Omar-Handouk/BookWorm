'use strict';

const express = require('express');
const router = express.Router();
const carService = require('../services/service-manager').get('carService');

module.exports = (app) => {
	router.get('/', (req, res) => {
		if (!req.user) {
			res.redirect('/auth/login');
		} else {
			let options = {
				pageTitle: 'Car Directory',
				loggedIn: true
			};

			let query = {};
			if (req.query) {
				query = req.query;

				Object.keys(query).forEach((key) => {
					if (query[key] === '' || query[key] === '#f2f7b8') {
						delete query[key];
					}
				});

				if (query.Color) {
					query['Color'] = query.Color.replace('#', '');
				}
			}
			carService.getCarByQuery(query, (response) => {
				if (response.length !== 0) {
					options['cars'] = response;
				}

				res.render('directory', options);
			});
		}
	});

	app.use('/directory', router);
};
