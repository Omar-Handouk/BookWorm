'use strict';

module.exports = (app) => {
	require('./homeRouter')(app);
	require('./carRouter')(app);
	require('./buyerRouter')(app);
	require('./authRouter')(app);
	require('./profileRoute')(app);
	require('./adminRoute')(app);
	require('./directoryRoute')(app);
	require('./aboutRoute')(app);
};
