'use strict';

const CarModel = require('../models/car');

class CarService {
  constructor(app, firebase){
    this.app = app;
    this.firebase = firebase;
    this.db = this.firebase.firestore();
  }

  createCar(carInfo, callback) {
    /*let modelKeys = Object.keys(CarModel);
    let infoKey = Object.keys(carInfo);

    let insertion = {};
    */
  }

  getCarById(Id, callback) {

  }

  getCarByQuery(query, callback) {

  }

  getAllCars(callback) {
    this.db
      .collection("Toyota")
      .get()
      .then(snapshot => {
        let documents = [];

        snapshot.forEach(doc => documents.push(doc.data()));

        callback(documents);
      })
      .catch(err => console.error(err));
  }
}

module.exports = (app, firebase, serviceManager) => {
  let carService = new CarService(app, firebase);
  serviceManager.set('carService', carService);
};