const cassandra = require('cassandra-driver');
const faker = require('faker');
const client = new cassandra.Client({ contactPoints: ['172.31.1.112'], keyspace: 'orders' });
//172.17.0.3
const newOrder = 'INSERT INTO orders (order_id, user_id, products, amount, completed) VALUES (?, ?, ?, ?, ?)';
const getCart = 'SELECT * FROM orders WHERE user_id = ? and completed = false limit 1';
const delOrder = 'DELETE FROM orders WHERE user_id = ? and completed = false';
const addCompleted = 'INSERT INTO completed (order_id, user_id, amount) VALUES (?, ?, ?)';
const getCompleted = 'SELECT * FROM completed';
const getSingle = 'SELECT * FROM completed where user_id = ?';

////////////////////////TEST///////////////////////////////////
var findOrder = (user_id) => {
	return client.execute(getCart, [user_id], {prepare: true})
	.then( results => {
		return results.rows[0];
	})
}


////////////////////////////////////////////////////////////////

var deleteOrder = (user_id) => {
	return client.execute(delOrder, [user_id], {prepare: true})
	.then(results => console.log('deleted'))
	.catch(error => console.log('error deletion'))
}

var addOrder = (order) => {
	client.execute(newOrder, [order.order_id, order.user_id, order.products, order.amount, order.completed], {prepare: true})
  .then(result => {})
  .catch(error => console.log('error!', error))

  if (order.completed === true) {
  	client.execute(addCompleted, [order.order_id, order.user_id, order.amount], {prepare: true})
  	.then(result => {})
  	.catch(error => console.log('error!', error))
  }
 }

var updateOrder = (order) => {
	client.execute(delOrder, [order.user_id], {prepare: true})
  .then(result => {
  	addOrder(order)
  })
  .catch(error => console.log('error!', error))
  }

var addNewCart = (user) => {
	return client.execute(newOrder, [faker.random.number(), user, 'empty', 0.00, false], {prepare: true})
	.then(result => {
		return getOrder(user)
	})
	.catch(error => console.log('error adding new cart!', error))
}

var getOrder = (user_id) => {
	return client.execute(getCart, [user_id], {prepare: true})
	.then(result => {
		if (result.rows.length === 0) {
			return addNewCart(user_id)
		} else {
				let order = {
					user_id: user_id,
					order_id: result.rows[0].order_id,
					amount: result.rows[0].amount,
					products: result.rows[0].products,
					completed: result.rows[0].completed
				}
				return order;
			}
		})
	.catch(error => console.log('error!', error))
}

var getCompletedOrders = () => {
	return client.execute(getCompleted, {prepare: true})
	.then(result => {
		return result.rows;
	})
	.catch(error => {
		console.log('getCompletedOrders error!')
	})
}


//test db//
var getSingleCompleted = (user_id) => {
	return client.execute(getSingle, [user_id], {prepare: true})
	.then( result => {
		return result.rows;
	})
	.catch(error => {
		console.log('get single error!')
	})
}

 module.exports = {
 	addOrder,
 	getOrder,
 	getCompletedOrders,
 	addNewCart,
 	deleteOrder,
 	updateOrder,
 	findOrder,
 	getSingleCompleted
 }