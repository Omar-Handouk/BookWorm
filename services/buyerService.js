'use strict';

let admin = require('firebase-admin');
const uuidv1 = require('uuid/v1');
const status = {
	pendingPayment: 'pending payment',
	downPaymentProvided: 'down payment provided',
	finishedPayment: 'owned!'
};

class BuyerService {
	constructor(app, firebase) {
		this.app = app;
		this.firebase = firebase;
		this.db = this.firebase.firestore();
	}

	saveCar(Id, userId, save, callback) {
		let dbQuery = this.db.collection('Cars').doc(Id);
		dbQuery
			.get()
			.then((doc) => {
				if (doc.exists) {
					let currentData = {};

					currentData.Color = doc.data().Color;
					currentData.Manufacturer = doc.data().Manufacturer;
					currentData.Model = doc.data().Model;
					currentData.YearOfMake = doc.data().YearOfMake;

					let dbUser = this.db.collection('Users').doc(userId);
					dbUser
						.get()
						.then((document) => {
							if (document.exists) {
								if (save === 'true') {
									//saving the car
									dbUser
										.update({
											favouriteCars: admin.firestore.FieldValue.arrayUnion(
												currentData
											)
										})
										// eslint-disable-next-line no-unused-vars
										.then((document) => {
											callback({
												Info: 'Car Saved! Dont forget to check it out later!'
											});
										});
								} else {
									//unsaving the car
									dbUser
										.update({
											favouriteCars: admin.firestore.FieldValue.arrayRemove(
												currentData
											)
										})
										// eslint-disable-next-line no-unused-vars
										.then((document) => {
											callback({
												Info:
													'The car will miss you :( Check out the rest for something to catch your eye!'
											});
										});
								}
							} else {
								callback({ Info: 'Document User ID does not exist' });
							}
						})
						.catch((err) => console.error(err));
				} else {
					callback({ Info: 'Document Car ID does not exist' });
				}
			})
			.catch((err) => console.error(err));
	}

	bookCar(Id, userId, callback) {
		let dbQuery = this.db.collection('Cars').doc(Id);
		dbQuery
			.get()
			.then((doc) => {
				if (doc.exists) {
					if (doc.get('Stock') != 0) {
						dbQuery
							.update({
								Stock: doc.get('Stock') - 1
							})
							.then((response) => {});

						let dbUser = this.db.collection('Users').doc(userId);

						dbUser
							.get()
							.then((document) => {
								if (document.exists) {
									let currentData = {};

									currentData.Color = doc.data().Color;
									currentData.Manufacturer = doc.data().Manufacturer;
									currentData.Model = doc.data().Model;
									currentData.YearOfMake = doc.data().YearOfMake;
									currentData.token = uuidv1();
									currentData.status = status.pendingPayment;

									let bookingRequest = {};
									bookingRequest.token = currentData.token;
									bookingRequest.userId = userId;
									bookingRequest.carId = Id;
									bookingRequest.status = status.pendingPayment;

									let dbInsertion = this.db.collection('BookingRequests');

									dbInsertion
										.add(bookingRequest)
										.then((ref) => {})
										.catch();

									dbUser
										.update({
											bookedCars: admin.firestore.FieldValue.arrayUnion(currentData)
										})
										.then((document) => {
											callback({
												Info:
													'Congratulations! You have successfully booked your car! Please visit the nearest premises to you and present them with your following token number: ' +
													currentData.token +
													' ' +
													'along with a down payment! Thank you!'
											});
											return;
										});
								} else {
									callback({ Info: 'Document User ID does not exist' });
								}
							})
							.catch((err) => console.error(err));
					} else {
						callback({
							Info:
								'We are so sorry! This car just went out of stock :( Keep it in favourites and check on it later!'
						});
						return;
					}
				} else {
					callback({ Info: 'Document Car ID does not exist' });
				}
			})
			.catch((err) => console.error(err));
	}

	deleteBooking(Id, userId, token, callback) {
		let dbQuery = this.db.collection('Cars').doc(Id);
		dbQuery
			.get()
			.then((doc) => {
				if (doc.exists) {
					let dbUser = this.db.collection('Users').doc(userId);
					dbUser
						.get()
						// eslint-disable-next-line no-unused-vars
						.then((document) => {
							console.log('here');
							let userBookedCars = document.get('bookedCars');
							let currentCar = {};
							for (let i = 0; i < userBookedCars.length; i++) {
								currentCar = userBookedCars[i];
								if (currentCar.token == token) {
									if (currentCar.status != status.pendingPayment) {
										callback({
											Info:
												'Cannot cancel booking, Payment has been provided! Please contact an admin for support'
										});
										return;
									} else break;
								}
							}

							console.log('here2');
							dbQuery
								.update({
									Stock: doc.get('Stock') + 1
								})
								.then((reponse) => {});

							dbUser
								.update({
									bookedCars: admin.firestore.FieldValue.arrayRemove(currentCar)
								})
								// eslint-disable-next-line no-unused-vars
								.then((document) => {
									callback({
										Info:
											'We are sorry to see this happening :( Your booking has been cancelled'
									});
								});

							let dbRequest = this.db
								.collection('BookingRequests')
								.where('token', '==', token);

							dbRequest
								.get()
								.then((snapshot) => {
									snapshot.forEach((doc) => {
										let dbDelete = this.db.collection('BookingRequests').doc(doc.id);

										dbDelete
											.delete()
											.then((response) => {}) // eslint-disable-line no-unused-vars
											.catch((err) => console.error(err));
									});
								})
								.catch((err) => console.error(err));
						})
						.catch((err) => console.error(err));
				} else {
					callback({ Info: 'Document Car ID does not exist' });
				}
			})
			.catch((err) => console.error(err));
	}

	getBookings(userEmail, callback) {
		let dbRequest = this.db.collection('Users').where('email', '==', userEmail);
		dbRequest.get().then((snapshot) => {
			snapshot.forEach((doc) => {
				let bookedCars = doc.data().bookedCars;
				callback({ bookedCars });
			});
		});
	}

	getFavourites(userEmail, callback) {
		let dbRequest = this.db.collection('Users').where('email', '==', userEmail);
		dbRequest.get().then((snapshot) => {
			snapshot.forEach((doc) => {
				let favouriteCars = doc.data().favouriteCars;
				callback({ favouriteCars });
			});
		});
	}
}

module.exports = (app, firebase, serviceManager) => {
	let buyerService = new BuyerService(app, firebase);
	serviceManager.set('buyerService', buyerService);
};
