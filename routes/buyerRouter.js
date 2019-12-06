'use strict';

const buyerService = require('../services/service-manager').get('buyerService');
const express = require('express');
const router = express.Router();

module.exports = (app) => {

    router.put('/save/:id', (req, res) => {

        if (req.params.id === undefined) {
			res.json({ Error: 'Car ID is not supplied' });
		}else {
            let userInfo = req.body.userId;
            //i should be able to save or unsave a car 
            //save is used as a check to see if i am saving or unsaving the car
            let save = req.body.save;
				buyerService.saveCar(req.params.id, userInfo, save, (response) => {
					res.json(response);
				});
			
        }
    });

    router.put('/book/:id', (req, res) => {

        if (req.params.id === undefined) {
			res.json({ Error: 'Car ID is not supplied' });
		}else {
            let userInfo = req.body.userId;
				buyerService.bookCar(req.params.id, userInfo,  (response) => {
					res.json(response);
				});
			
        }
    });

    router.delete('/deleteBooking/:id', (req, res) => {
		if (req.params.id === undefined) {
			res.json({ Error: 'Car ID is not supplied' });
		} else {
            let userInfo = req.body.userId;
            let token = req.body.token;
			buyerService.deleteBooking(req.params.id, userInfo, token, (response) => {
				res.json(response);
			});
		}
	});

    app.use('/user', router);
};
