const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'orders' });

const newOrder = 'INSERT INTO orders (order_id, user_id, products, amount, completed) VALUES (?, ?, ?, ?, ?)';
const getCart = 'SELECT order_id, amount, products, completed FROM orders WHERE user_id = ? and completed = false';

// var addOrder = (order, callback) => {
// 	client.execute(newOrder, [order.order_id, order.user_id, order.products, order.amount, order.completed], {prepare: true})
//   .then(result => console.log('order added!'))
//   .catch(error => console.log('error!', error))
//   }
var addOrder = (order) => {
	return client.execute(newOrder, [order.order_id, order.user_id, order.products, order.amount, order.completed], {prepare: true})
  .then(result => console.log('order added!'))
  .catch(error => console.log('error!', error))
  }

var getOrder = (user_id) => {
	return client.execute(getCart, [user_id], {prepare: true})
	.then(result => {
		console.log(result);
		let order = {
			order_id: result.rows[0].order_id,
			amount: result.rows[0].amount,
			products: result.rows[0].products,
			completed: result.rows[0].completed
		}
		return order;
		})
	.catch(error => console.log('error!', error))
}

 module.exports = {
 	addOrder,
 	getOrder
 }