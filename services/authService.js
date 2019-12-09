'use strict';

class AuthService {
	authenticate(req, res, next) {
		if (!req.user) {
			res.redirect('/auth/login');
		} else {
			next();
		}
	}
}

module.exports = (app, firebase, serviceManager) => {
	let authService = new AuthService();
	serviceManager.set('authService', authService);
};
