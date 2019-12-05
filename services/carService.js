'use strict';

class CarService {
	constructor(app, firebase) {
		this.app = app;
		this.firebase = firebase;
		this.db = this.firebase.firestore();
	}

	createCar(carInfo, callback) {
		let dbInsertion = this.db.collection('Cars');

		dbInsertion
			.add(carInfo)
			.then((ref) => {
				if (ref !== undefined && ref.id !== undefined) {
					callback({ Info: 'Car successfully added', ID: ref.id });
				} else {
					callback({ Error: 'There was a problem adding the car' });
				}
			})
			.catch();
	}

	getCarById(Id, callback) {
		let dbQuery = this.db.collection('Cars').doc(Id);

		dbQuery
			.get()
			.then((doc) => {
				if (doc.exists) {
					callback(doc.data());
				} else {
					callback({ Error: 'Document ID does not exist' });
				}
			})
			.catch((err) => console.error(err));
	}

	getCarByQuery(query, callback) {
		let dbQuery = this.db.collection('Cars');

		let keys = Object.keys(query);

		keys.forEach((key) => {
			dbQuery = dbQuery.where(key, '==', query[key]);
		});

		dbQuery = dbQuery
			.get()
			.then((snapshot) => {
				let cars = [];

				snapshot.forEach((doc) => cars.push(doc.data()));

				callback(cars);
			})
			.catch((err) => console.error(err));
	}

	updateCar(carInfo, Id, callback) {
		let dbUpdate = this.db.collection('Cars').doc(Id);

		dbUpdate
			.get()
			.then((doc) => {
				if (doc.exists) {
					dbUpdate
						.update(carInfo)
						.then((response) => callback({ Info: 'Car updated successfully' })) // eslint-disable-line no-unused-vars
						.catch((err) => console.error(err));
				} else {
					callback({ Error: 'Car does not exist' });
				}
			})
			.catch((err) => console.error(err));
	}

	deleteCar(Id, callback) {
		let dbDelete = this.db.collection('Cars').doc(Id);

		dbDelete
			.get()
			.then((doc) => {
				if (doc.exists) {
					dbDelete
						.delete()
						.then((response) => callback({ Info: 'Car deleted successfully' })) // eslint-disable-line no-unused-vars
						.catch((err) => console.error(err));
				} else {
					callback({ Error: 'Car does not exist' });
				}
			})
			.catch((err) => console.error(err));
	}
}

module.exports = (app, firebase, serviceManager) => {
	let carService = new CarService(app, firebase);
	serviceManager.set('carService', carService);
};
