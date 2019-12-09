'use strict';

const serviceManager = require('./service-manager');

module.exports = (app, firebase) => {
	require('./authService')(app, firebase, serviceManager);
	require('./carService')(app, firebase, serviceManager);
	require('./buyerService')(app, firebase, serviceManager);
	require('./adminServices')(app, firebase, serviceManager);
};
