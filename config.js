'use strict';

require('dotenv').config();

const config = {
	environment: process.env.NODE_ENV,
	port: process.env.PORT
};

module.exports = config;
