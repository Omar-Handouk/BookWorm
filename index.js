'use strict';

// Load configuration
const config = require('./config');

const express = require('express');
const helmet = require('helmet');

// Initialize application
const app = express();

// Middleware initialization
app.use(helmet());

app.get('/', (req, res) => {
	let page = "<head><title>Landing Page</title></head>" +
		"<body><h1>Express server is setup correctly!</h1></body>";

	res.send(page);
});

app.listen(config.port, () => {
	console.info(`Application is running at port ${config.port}`);
});
