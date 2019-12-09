'use strict';

const express = require('express');
const router = express.Router();
const adminService = require('../services/service-manager').get('adminService');
const carService = require('../services/service-manager').get('carService');

let adminAuth = (req, res, next) => {
	if (!req.user) {
		res.redirect('/auth/login');
	} else if (req.user.userType === 'buyer') {
		res.redirect('/profile');
	} else {
		next();
	}
};

module.exports = (app) => {
	router.get('/', adminAuth, (req, res) => {
		adminService.getPendingRequests((data) => {
			let options = {
				pageTitle: 'Admin Dashboard',
				loggedIn: true,
				userType: false
			};

			if (req.query.noStatus === '1') {
				options['noStatus'] = true;
			}

			if (req.query.carUpdated === '1') {
				options['carUpdated'] = true;
			}

			if (req.query.carDeleted === '1') {
				options['carDeleted'] = true;
			}

			if (req.query.carAdded === '1') {
				options['carAdded'] = true;
			}
			if (data.length !== 0) {
				options['response'] = data;
			}

			if (req.query.orderUpdated === '1') {
				options['orderUpdated'] = true;
			}

			if (req.query.orderDeleted === '1') {
				options['orderDeleted'] = true;
			}

			carService.getCarByQuery({}, (data) => {
				if (data.length !== 0) {
					options['cars'] = data;
				}

				res.render('admin', options);
			});
		});
	});

	router.get('/add', adminAuth, (req, res) => {
		let options = {
			pageTitle: 'Admin Dashboard | Add Car',
			loggedIn: true,
			userType: false
		};

		res.render('addCar', options);
	});

	router.put('/', adminAuth, (req, res) => {
		let requestId = req.query.requestId;
		let requestStatus = req.body.Status;
		if (
			requestStatus === undefined ||
			requestStatus === null ||
			requestStatus === ''
		) {
			res.redirect('/admin?noStatus=1');
		} else {
			adminService.updateRequestStatus(requestId, requestStatus, () => {
				res.redirect('/admin?orderUpdated=1');
			});
		}
	});

	// eslint-disable-next-line no-unused-vars
	router.delete('/', adminAuth, (req, res) => {
		let requestId = req.query.requestId;

		// eslint-disable-next-line no-unused-vars
		adminService.deleteRequest(requestId, (response) => {
			res.redirect('/admin?orderDeleted=1');
		});
	});

	app.use('/admin', router);
};
