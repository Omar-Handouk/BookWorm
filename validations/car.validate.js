'use strict';

const JOI = require('@hapi/joi');

/**
 * Validate incoming data for all required field of car model
 * @param data
 * @returns {*}
 */
let create = (data) => {
	let schema = JOI.object().keys({
		Manufacturer: JOI.string().required(),
		Model: JOI.string().required(),
		YearOfMake: JOI.number()
			.required()
			.min(1990)
			.max(9999),
		Color: JOI.string().required(),
		Stock: JOI.number()
			.required()
			.min(0)
	});

	return schema.validate(data);
};

/**
 * Allow only to change the stock number
 * @param data
 * @returns {*}
 */
let update = (data) => {
	let schema = JOI.object().keys({
		Manufacturer: JOI.string().forbidden(),
		Model: JOI.string().forbidden(),
		YearOfMake: JOI.number()
			.forbidden()
			.min(1990)
			.max(9999),
		Color: JOI.string().forbidden(),
		Stock: JOI.number()
			.optional()
			.min(0)
	});

	return schema.validate(data);
};

module.exports = {
	create: create,
	update: update
};
