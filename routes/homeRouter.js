'use strict';

const express = require('express');
const router = express.Router();

module.exports = (app) => {
	router.get('/', (req, res) => {
		let options = {
			pageTitle: 'Home',
			loggedIn: false
		};

		if (req.user) {
			options['user'] = req.user;
			options['loggedIn'] = true;
			options['userType'] = req.user.userType === 'buyer';
		}

		res.render('home', options);
	});

	app.use('/', router);
};
