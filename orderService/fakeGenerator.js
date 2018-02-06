var faker = require('faker');
var uuid = require('uuid/v1');
var axios = require('axios');
var db = require('./database/index.js');
const fs = require('fs');
// const file = fs.createWriteStream('./bigFile5.txt');

var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var randomCard = faker.helpers.createCard(); // random contact card containing many properties

// var generateDataObject = function() {
// 	var order = {
// 		order_id: uuidv1(), 		
// 		user_id: faker.random.number(),
// 		products: faker.commerce.product(),
// 		amount: faker.finance.amount(),
// 		completed: faker.random.boolean()
// 	}

// 	return JSON.stringify(order);
// }

var generateDataArrayTrue = function () {
	var data = [
		faker.random.number(), true, faker.finance.amount(), faker.random.number(), faker.commerce.product()
	]
	return data;
}

var generateDataArrayFalse = function () {
	var data = [
		faker.random.number(), false, faker.finance.amount(), faker.random.number(), faker.commerce.product()
	]
	return data;
}

var generateAlot = function() {
	for (let i = 0; i < 2000000; i++) {
		if (i % 50000 === 0) {
			file.write(generateDataArrayFalse() + '\n');
		} else {
			file.write(generateDataArrayTrue() + '\n');	
		}
	}	
}

var insertNewOrder = function () {
	axios.post('http://localhost:3000/orders', { 
		params: {
	  	order_id: 69028, 		
			user_id: 1000032,
			products: faker.commerce.product(),
			amount: faker.finance.amount(),
			completed: true
		}
  })
  .then(response => {
  	console.log('generate data res', response);

  })
  .catch(error => {
  	console.log('generate data error', error);
  })
}

var getOrder = function (user_id) {
	axios.get('http://localhost:3000/orders/' + user_id)
	.then(results => {
		console.log('success!', results);
	})
	.catch(error => {
		console.log('get data error', error);
	})
}

var getCompletedOrders = function () {
	axios.get('http://localhost:3000/events/orders')
	.then(results => {
		console.log('received completed orders', results);
	})
	.catch(error => {
		console.log('error recieving completed orders', error);
	})
}


// generateAlot();
// insertNewOrder();
getOrder(1000032);
// getCompletedOrders();