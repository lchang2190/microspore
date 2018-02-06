'use strict';

const faker = require('faker');

var generateUser = function(userContext, events, done) {
 var user_id = faker.random.number()

	userContext.vars.user_id = user_id;

	return done();
}

module.exports = {
	generateUser
};