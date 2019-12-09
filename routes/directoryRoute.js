'use strict';

const express = require('express');
const router = express.Router();

module.exports = (app) => {
	router.get('/', (req, res) => {
		if (!req.user) {
			res.redirect('/auth/login');
		} else {
			let options = {
				pageTitle: 'Car Directory',
				loggedIn: true
			};

			res.render('directory', options);
		}
	});

	app.use('/directory', router);
};
