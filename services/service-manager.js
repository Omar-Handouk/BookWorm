'use strict';

const services = {};
/**
 * @description Sets the name of a given service object instance
 *
 * @param serviceName
 * @param object
 */
let set = (serviceName, object) => {
	let servicesNames = getServicesNames();

	if (servicesNames.includes(serviceName)) {
		throw 'Service name used, please choose another name.';
	} else {
		services[serviceName] = object;
	}
};

/**
 * Given a service name, a service is provided if it is available
 * @param serviceName
 * @returns {*}
 */
let get = (serviceName) => {
	let serviceExists = Object.keys(services).includes(serviceName);

	if (serviceExists) {
		return services[serviceName];
	} else {
		throw 'Service does not exist.';
	}
};

/**
 * Return a list of all available services
 * @returns {string[]}
 */
let getServicesNames = () => {
	return Object.keys(services);
};

module.exports = {
	set: set,
	get: get,
	getServicesNames: getServicesNames
};
