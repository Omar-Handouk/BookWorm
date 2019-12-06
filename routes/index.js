'use strict';

module.exports = (app) => {
	require('./carRouter')(app);
	require('./buyerRouter')(app);
};
