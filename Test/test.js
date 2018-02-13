const assert = require('chai').assert;
const expect = require('chai').expect;
const app = require('../orderService/server.js');
const supertest = require('supertest');
const db = require('../orderService/database/index.js');
const request = supertest.agent(app.listen());

describe('server test', function() {
	it('GET /orders/:user_id, should get user cart if order is incomplete upon login', function(done) {
		let testOrder = { 
			user_id: 28704,
     	order_id: 9709,
     	amount: '0',
     	products: 'empty',
     	completed: false 
     };
		request
			.get('/orders/28704')
			.expect(200)
			.end((err, res) => {
				assert.typeOf(res.body, 'object')
				done();
			})
	});

	// it('GET /events/orders, should get list of all the completed orders', function(done) {
	// 	request
	// 		.get('/events/orders')
	// 		.expect(200, done)
	// })

	it('POST /orders, should update an existing incompleted order', function(done) {
		let testOrder = {
			params: {
				user_id: 83068,
	     	order_id: 55635,
	     	amount: '930.97',
	     	products: 'Gloves',
	     	completed: true 
	     }
     }
		request
			.post('/orders')
			.send(testOrder)
			.expect(200)
			.end((err, res) =>{
				done();
			})
	})

	it('addOrder helper function should add a order to orders table if completed === false', function(done) {
		let testOrder = { 
			user_id: 123456,
			completed: false,
			amount: '216.78',
     	order_id: 123456,
     	products: 'Car'
     };

		db.addOrder(testOrder)
		
		db.findOrder(123456)
		.then(result=> {
    	assert.equal(JSON.stringify(result), JSON.stringify(testOrder))
			})
		.catch(error => console.log(error))

		done();	
	})

	it('deleteOrder helper function should remove an order where completed === false', function(done) {
		let testOrder = {
			user_id: 98765,
			completed: false,
			amount: '100.00',
			order_id: 98765,
			products: 'Candy'
		}
		db.addOrder(testOrder)

		db.deleteOrder(98765)
		.then(result => {
			db.findOrder(98765)
			.then(result => {
	    	assert.equal(result, undefined)
				})
			.catch(error => console.log(error))
		});
		done();
	})

	it('addOrder helper function should add order to completed table if completed === true', function(done) {
		let testOrder = { 
			user_id: 88888,
			completed: true,
			amount: '216.78',
     	order_id: 88888,
     	products: 'Car'
     };

    let testCompleted = {
    	user_id: 88888,
    	amount: '216.78',
    	order_id: 88888
    }

   db.addOrder(testOrder);

   db.getSingleCompleted(88888)
   .then(result => {
   		assert.equal(JSON.stringify(result[0]), JSON.stringify(testCompleted))
   })
   .catch(error => console.log(error))

   done();
	})
	
	it('getOrder helper function should get an incomplete order if it exists', function(done) {
	let testOrder = { 
		user_id: 79790,
	  order_id: 45831,
	  amount: '700.00',
	  products: 'Shirt',
	  completed: false 
	}

	db.getOrder(79790)
	.then(result => {
		assert.equal(JSON.stringify(result), JSON.stringify(testOrder))
	})
	.catch(error => console.log(error))

	done();
})

it('getOrder helper function should create an empty card if incomplete order does not exist', function(done) {
	let testOrder = {
		user_id: 666666,
	  order_id: 70256,
	  amount: '0',
	  products: 'empty',
	  completed: false 
	}
	db.getOrder(666666)
	.then(result => {
		assert.equal(result.products, testOrder.products)
	})
	.catch(error => console.log(error))

	done();
})
})



