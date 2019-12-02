'use strict';

const services = {};

let set = (serviceName, object) => {
	let servicesNames = getServicesNames();

	if (servicesNames.includes(serviceName)) {
		throw 'Service name used, please choose another name.';
	} else {
		services[serviceName] = object;
	}
};

let get = (serviceName) => {
	let serviceExists = Object.keys(services).includes(serviceName);

	if (serviceExists) {
		return services[serviceName];
	} else {
		throw 'Service does not exist.';
	}
};

let getServicesNames = () => {
	return Object.keys(services);
};

module.exports = {
	set: set,
	get: get,
	getServicesNames: getServicesNames
};
