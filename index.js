'use strict';
// Load configuration
const {
	port: PORT,
	database_url: DB_URL,
	cookie_secret: COOKIE_SECRET
} = require('./config/config');

const express = require('express');
const helmet = require('helmet');

const firebase = require('firebase-admin');
const serviceAccount = require('./config/firebase_credentials');

// Configure Firebase
firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: DB_URL
});

const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');

// Require Passport Setup
require('./config/passport-config');

const passport = require('passport');
const cookieSession = require('cookie-session');

// Initialize application
const app = express();

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs());

// Middleware initialization
app.use(helmet());
app.use(
	cookieSession({
		maxAge: 24 * 60 * 60 * 1000,
		keys: [COOKIE_SECRET]
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false
	})
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Initialize Services
require('./services/index')(app, firebase);
// Initialize Routes
require('./routes/index')(app);

app.get('/', (req, res) => {
	res.render('home', { pageTitle: 'Home' });
});

app.listen(PORT, () => {
	console.info(`Application is running at port ${PORT}`);
});
