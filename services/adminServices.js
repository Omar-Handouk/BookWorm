'use strict';

class AdminService {
	constructor(app, firebase) {
		this.app = app;
		this.firebase = firebase;
		this.db = this.firebase.firestore();
	}

	/**
	 * Used to get requests that are still pending payment
	 * @param callback
	 */
	getPendingRequests(callback) {
		let collectionRef = this.db.collection('BookingRequests');

		collectionRef
			.where('status', '==', 'pending payment')
			.get()
			.then((snapshot) => {
				let requests = [];

				if (!snapshot.empty) {
					snapshot.forEach((doc) => {
						requests.push({ id: doc.id, data: doc.data() });
					});
				}

				callback(requests);
			})
			.catch((err) => console.error(err));
	}

	/**
	 * Update the status of a booking request to down payment provided
	 * @param requestId
	 * @param callback
	 */
	updateRequestStatus(requestId, requestStatus, callback) {
		let collectionRef = this.db.collection('BookingRequests');

		let updateDoc = {
			status: requestStatus
		};

		collectionRef.doc(requestId).update(updateDoc);

		collectionRef
			.doc(requestId)
			.get()
			.then((doc) => {
				let orderToken = doc.data().token;
				let userId = doc.data().userId;

				this.db
					.collection('Users')
					.doc(userId)
					.get()
					.then((doc) => {
						let booked = doc.data().bookedCars;

						let bookingRequests = [];

						booked.forEach((doc) => {
							if (doc.token === orderToken) {
								doc['status'] = 'down payment provided';
							}

							bookingRequests.push(doc);
						});

						this.db
							.collection('Users')
							.doc(userId)
							.update({ bookedCars: bookingRequests })
							.then(() =>
								callback({ Info: `Order ${requestId} status has been updated` })
							)
							.catch((err) => console.error(err));
					})
					.catch((err) => console.error(err));
			})
			.catch((err) => console.error(err));
	}

	/**
	 * Used to delete a booking request
	 * @param requestId
	 * @param callback
	 */
	deleteRequest(requestId, callback) {
		let collectionRef = this.db.collection('BookingRequests');

		collectionRef
			.doc(requestId)
			.get()
			.then((doc) => {
				let orderToken = doc.data().token;
				let userId = doc.data().userId;

				this.db
					.collection('Users')
					.doc(userId)
					.get()
					.then((doc) => {
						// Remove booking from user
						let booked = doc.data().bookedCars;

						let bookingRequests = [];

						booked.forEach((doc) => {
							if (doc.token !== orderToken) {
								bookingRequests.push(doc);
							}
						});

						this.db
							.collection('Users')
							.doc(userId)
							.update({ bookedCars: bookingRequests });

						// Remove booking from booking collection
						collectionRef
							.doc(requestId)
							.delete()
							.then(() => {
								callback({
									Info: `Order ${requestId} has been deleted successfully`
								});
							})
							.catch((err) => console.error(err));
					})
					.catch((err) => console.error(err));
			})
			.catch((err) => console.error(err));
	}
}

module.exports = (app, firebase, serviceManager) => {
	let adminService = new AdminService(app, firebase);
	serviceManager.set('adminService', adminService);
};
