'use strict';

require('dotenv').config();

const config = {
	environment: process.env.NODE_ENV,
	port: process.env.PORT,
	database_url: 'https://bookworm-iv.firebaseio.com/'
};

module.exports = config;
