'use strict';

const express = require('express');
const router = express.Router();

module.exports = (app) => {
	// eslint-disable-next-line no-unused-vars
	router.get('/', (req, res) => {
		let options = {
			pageTitle: 'About',
			loggedIn: false
		};

		if (req.user) {
			options['loggedIn'] = 'true';
		}

		res.render('about', options);
	});

	app.use('/about', router);
};
