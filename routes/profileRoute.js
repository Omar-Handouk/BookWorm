'use strict';

const express = require('express');
const router = express.Router();
const authService = require('../services/service-manager').get('authService');

module.exports = (app) => {
	router.get('/', authService.authenticate, (req, res) => {
		if (req.user.userType === 'admin') {
			res.redirect('/admin');
		} else {
			let options = {
				user: req.user,
				pageTitle: 'Profile',
				loggedIn: true,
				userType: req.user.userType === 'buyer'
			};

			res.render('profile', options);
		}
	});

	app.use('/profile', router);
};
