'use strict';

const express = require('express');
const router = express.Router();
const authService = require('../services/service-manager').get('authService');
const buyerService = require('../services/service-manager').get('buyerService');
const db = require('firebase-admin').firestore();

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

	router.get('/getBookedCars', (req, res) => {
		let userEmail = req.user.email;
		buyerService.getBookings(userEmail, (response) => {
			let options = {
				pageTitle: 'Your Bookings',
				loggedIn: false,
				response: response.bookedCars
			};

			if (!req.user) {
				res.redirect('/auth/login');
			} else {
				options['loggedIn'] = 'true';
				options.userType = req.user.userType === 'buyer';
				res.render('yourBookings', options);
			}
		});
	});

	router.get('/getFavouriteCars', (req, res) => {
		let userEmail = req.user.email;
		buyerService.getFavourites(userEmail, (response) => {
			let options = {
				pageTitle: 'Your Favourite Cars',
				loggedIn: false,
				response: response.favouriteCars
			};

			if (!req.user) {
				res.redirect('/auth/login');
			} else {
				console.log(response);
				options['loggedIn'] = 'true';
				options.userType = req.user.userType === 'buyer';
				res.render('yourFavourites', options);
			}
		});
	});

	router.delete('/deleteBooking', (req, res) => {
		let userId = req.user.googleId;
		let model = req.query.model;
		let manufacturer = req.query.manufacturer;
		let color = req.query.color;
		let yearOfMake = req.query.yearOfMake;
		let token = req.query.token;

		let dbRequest = db
			.collection('Cars')
			.where('Manufacturer', '==', manufacturer)
			.where('Color', '==', color)
			.where('Model', '==', model)
			.where('YearOfMake', '==', yearOfMake);

		dbRequest.get().then((snapshot) => {
			snapshot.forEach((doc) => {
				console.log(doc.id);
				buyerService.deleteBooking(doc.id, userId, token, (response) => {
					let options = {
						pageTitle: 'Your Bookings',
						loggedIn: false,
						response: response.Info
					};

					if (!req.user) {
						res.redirect('/auth/login');
					} else {
						console.log(response);
						options['loggedIn'] = 'true';
						options.userType = req.user.userType === 'buyer';
						res.render('popups', options);
					}
				});
			});
		});
	});

	router.put('/saveCar', (req, res) => {
		let userId = req.user.googleId;
		let save = req.query.save;
		let model = req.query.model;
		let manufacturer = req.query.manufacturer;
		let color = req.query.color;
		let yearOfMake = req.query.yearOfMake;

		let dbRequest = db
			.collection('Cars')
			.where('Manufacturer', '==', manufacturer)
			.where('Color', '==', color)
			.where('Model', '==', model)
			.where('YearOfMake', '==', yearOfMake);

		dbRequest.get().then((snapshot) => {
			snapshot.forEach((doc) => {
				console.log(doc.id);
				buyerService.saveCar(doc.id, userId, save, (response) => {
					let options = {
						pageTitle: 'Your Favourites',
						loggedIn: false,
						response: response.Info
					};

					if (!req.user) {
						res.redirect('/auth/login');
					} else {
						console.log(response);
						options['loggedIn'] = 'true';
						options.userType = req.user.userType === 'buyer';
						res.render('popups', options);
					}
				});
			});
		});
	});

	router.put('/bookCar', (req, res) => {
		let userId = req.user.googleId;
		let model = req.query.model;
		let manufacturer = req.query.manufacturer;
		let color = req.query.color;
		let yearOfMake = req.query.yearOfMake;

		console.log(color);

		let dbRequest = db
			.collection('Cars')
			.where('Manufacturer', '==', manufacturer)
			.where('Color', '==', color)
			.where('Model', '==', model)
			.where('YearOfMake', '==', yearOfMake);

		dbRequest.get().then((snapshot) => {
			snapshot.forEach((doc) => {
				console.log(doc.id);
				buyerService.bookCar(doc.id, userId, (response) => {
					let options = {
						pageTitle: 'Booking Your Car',
						loggedIn: false,
						response: response.Info
					};

					if (!req.user) {
						res.redirect('/auth/login');
					} else {
						console.log(response);
						options['loggedIn'] = 'true';
						options.userType = req.user.userType === 'buyer';
						res.render('popups', options);
					}
				});
			});
		});
	});

	app.use('/profile', router);
};
