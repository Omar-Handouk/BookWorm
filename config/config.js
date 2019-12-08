'use strict';

try {
	require('dotenv').config();

	module.exports = {
		environment: process.env.NODE_ENV,
		port: process.env.PORT,
		database_url: process.env.DB_URL,
		cookie_secret: process.env.COOKIE_SECRET
	};
} catch (e) {
	console.error(e);
}
