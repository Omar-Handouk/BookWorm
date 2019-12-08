'use strict';

module.exports = (app) => {
	require('./homeRouter')(app);
	require('./carRouter')(app);
	require('./buyerRouter')(app);
	require('./authRouter')(app);
	require('./profileRoute')(app);
};
