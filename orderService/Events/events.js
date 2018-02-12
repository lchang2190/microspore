
	// the name of your microservice e.g. 'orders', 'prime'
	let serviceName = 'orders';

	// require events log helper module
	const EventLog = require('./eventsSQS.js');

	// create a new event log instance with your service name
	const events = new EventLog(serviceName);

var eventSend = function (order) {
	let newOrder = {
	  orderId: order.order_id.toString(),
	  userId: order.user_id.toString(),
	  amount: order.amount.toString(),
	  timestamp: Date.now()
	};

	// send the event to the SQS queue
	events.send('neworder', newOrder)

	// optionally provide .then handler
	  .then((result) => {
	    //message sent
	    console.log('message sent to queque!');
	  })
	  .catch(error => console.log('error', error))

	// optionally async await
	// let result = await events.send('neworder', newOrder);
};

module.exports = eventSend;