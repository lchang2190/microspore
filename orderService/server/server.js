require('newrelic');
const Koa = require('koa');
const AWS = require('aws-sdk')
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const parser = require('koa-bodyparser');
const db = require('../database/index.js');
const path = require('path');
const eventSend = require('../Events/events.js');

AWS.config.loadFromPath(path.resolve(__dirname, '../Events/config.json'));
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});


app.use(parser());

// router.post('/orders', async (ctx) => {
// 	var order = ctx.request.body.params;
// 	try {
// 		db.updateOrder(order);
// 		ctx.status = 200;
// 		ctx.body = console.log('order added!');
// 	} catch (error) {
// 		ctx.status = 400;
// 		console.log('error', error)
// 	}
// })
router.post('/orders', async (ctx) => {
	var order = ctx.request.body.params;
	try {
		if (order.completed === true) {
			eventSend(order);
		}
		db.updateOrder(order);
		ctx.status = 200;
	} catch (error) {
		ctx.status = 400;
		console.log('error', error)
	}
})


router.get('/orders/:user_id', async (ctx) => {
	user_id = parseInt(ctx.params.user_id)
	try {
		var result = await db.getOrder(user_id);
			ctx.status = 200;
			ctx.body = result;
	} catch (error) {
		ctx.status = 404;
		console.log('error', error);
	}
})

// router.get('/events/orders', async (ctx) => {
// 	try {
// 		var result = await db.getCompletedOrders();
// 		for (var i = 0; i < result.length; i++) {
// 			eventSend(result[i]);
// 		}
// 		ctx.status = 200;
// 	} catch (error) {
// 		ctx.status = 400;
// 		console.log('error /events/orders!', error);
// 	}
// })

app.use(router.routes());
app.use(router.allowedMethods());

let port = process.env.PORT || 3000;

if (!module.parent) {
	app.listen(port, function() {
		console.log(`koa up on ${port}!`);
	});
}


module.exports = app;