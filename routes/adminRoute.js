'use strict';

const express = require('express');
const router = express.Router();
const adminService = require('../services/service-manager').get('adminService');

let adminAuth = (req, res, next) => {
	if (!req.user) {
		res.redirect('/auth/login');
	} else {
		next();
	}
};

module.exports = (app) => {
	router.get('/', adminAuth, (req, res) => {
		adminService.getPendingRequests((data) => {
			res.json(data);
		});
	});

	router.put('/', (req, res) => {
		let requestId = req.query.requestId;

		adminService.updateRequestStatus(requestId, (response) => {
			res.json(response);
		});
	});
	app.use('/admin', router);
};
