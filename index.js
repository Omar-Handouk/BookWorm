'use strict';
// Load configuration
const { port: PORT, database_url: DB_URL } = require('./config/config');

const express = require('express');
const helmet = require('helmet');

const firebase = require('firebase-admin');
const serviceAccount = require('./config/bookworm-iv-firebase-adminsdk-i7tks-c04fef1e5e');

// Configure Firebase
firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: DB_URL
});

// Initialize application
const app = express();

// Middleware initialization
app.use(helmet());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false
	})
);

// Initialize Services
require('./services/index')(app, firebase);
// Initialize Routes
require('./routes/index')(app);

app.listen(PORT, () => {
	console.info(`Application is running at port ${PORT}`);
});
