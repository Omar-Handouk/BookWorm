'use strict';

let admin = require('firebase-admin');
const uuidv1 = require('uuid/v1');
const status = {
	"pendingPayment" : "pending payment",
	"downPaymentProvided" : "down payment provided" ,
	"finishedPayment" : "owned!" 
}

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
								if (save === true) {
									//saving the car
									dbUser
										.update({
											'favouriteCars': admin.firestore.FieldValue.arrayUnion(
												currentData
											)
										})
										// eslint-disable-next-line no-unused-vars
										.then((document) => {
											callback({ Info: 'Document SAVE successfully updated!' });
										});
								} else {
									//unsaving the car
									dbUser
										.update({
											'favouriteCars': admin.firestore.FieldValue.arrayRemove(
												currentData
											)
										})
										// eslint-disable-next-line no-unused-vars
										.then((document) => {
											callback({ Info: 'Document UNSAVE successfully updated!' });
										});
								}
							} else {
								callback({ Error: 'Document User ID does not exist' });
							}
						})
						.catch((err) => console.error(err));
				} else {
					callback({ Error: 'Document Car ID does not exist' });
				}
			})
			.catch((err) => console.error(err));
	}

	bookCar(Id, userId, callback){
		let dbQuery = this.db.collection("Cars").doc(Id);
		dbQuery
		  .get()
		  .then((doc) => {
			if (doc.exists) {
			  if(doc.get('Stock') != 0){
				dbQuery.update({
				  "Stock" : doc.get('Stock') - 1
				}).then(reponse => { })
				
				let dbUser = this.db.collection("Users").doc(userId); 
  
				dbUser
			   .get()
			   .then((document) => {
				   if(document.exists){
					 let currentData = {};

					 currentData.Color = doc.data().Color;
					 currentData.Manufacturer = doc.data().Manufacturer;
					 currentData.Model = doc.data().Model;
					 currentData.YearOfMake = doc.data().YearOfMake;
					 currentData.token = uuidv1();
					 currentData.status = status.pendingPayment
					
					let bookingRequest = {}
					bookingRequest.token = currentData.token;
					bookingRequest.userId = userId;
					bookingRequest.carId = Id;
					bookingRequest.status = status.pendingPayment

					let dbInsertion = this.db.collection('BookingRequests');

					dbInsertion
						.add(bookingRequest)
						.then((ref) => {})
						.catch();

						dbUser.update({
						"bookedCars" : admin.firestore.FieldValue.arrayUnion(currentData)
						}).then((document) => {
						  callback({Info: "Document successfully updated!"});
						});    
					  
				   }else {
					callback({ Error: "Document User ID does not exist" });
				  }
			   })
			   .catch((err) => console.error(err));
			  }else{
				callback({ Error: "This car has just went out of stock!" });
			  }
			} else {
			  callback({ Error: "Document Car ID does not exist" });
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
							
							 
							let userBookedCars = document.get('bookedCars');
							let currentCar = {};
							for (let i=0; i<userBookedCars.length; i++){
								 currentCar = userBookedCars[i];
								if (currentCar.token == token) {
									if(currentCar.status != status.pendingPayment){
										callback({ Error: 'Cannot cancel booking! Payment has been provided' });
									}else 
									break
								}	
							}

							dbQuery.update({
								"Stock" : doc.get('Stock') + 1
							  }).then(reponse => { })

							dbUser
								.update({
									'bookedCars': admin.firestore.FieldValue.arrayRemove(currentCar)
								})
								// eslint-disable-next-line no-unused-vars
								.then((document) => {
									callback({ Info: 'Document successfully deleted!' });
								});

						
								let dbRequest = this.db.collection('BookingRequests').where('token', '==', token);


								dbRequest
								.get()
								.then((snapshot) => {
									
									snapshot.forEach((doc) => {
										
									let dbDelete = this.db.collection('BookingRequests').doc(doc.id)

									dbDelete
									.delete()
									.then((response) => callback({ Info: 'Request deleted successfully' })) // eslint-disable-line no-unused-vars
									.catch((err) => console.error(err));
									
										})
									})
								.catch((err) => console.error(err));
									

						})
						.catch((err) => console.error(err));

				} else {
					callback({ Error: 'Document Car ID does not exist' });
				}
			})
			.catch((err) => console.error(err));
	}
}
module.exports = (app, firebase, serviceManager) => {
	let buyerService = new BuyerService(app, firebase);
	serviceManager.set('buyerService', buyerService);
};
