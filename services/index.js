'use strict';

const serviceManager = require('./service-manager');

module.exports = (app, firebase) => {
	require('./carService')(app, firebase, serviceManager);
	//require('./buyerService')(app, firebase, serviceManager);
};
