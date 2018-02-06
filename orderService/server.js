require('newrelic');
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const parser = require('koa-bodyparser');
var db = require('./database/index.js');

app.use(parser());

router.post('/orders', async (ctx) => {
	var order = ctx.request.body.params;
	try {
		db.updateOrder(order);
		ctx.status = 200;
		ctx.body = console.log('order added!');
	} catch (error) {
		console.log('error', error)
	}
})

router.get('/orders/:user_id', async (ctx) => {
	user_id = parseInt(ctx.params.user_id)
	try {
		var result = await db.getOrder(user_id);
		console.log(result);
		// if (result === undefined) {
		// 	var newCart = await db.addNewCart(user_id);
		// 	ctx.status = 200;
		// 	ctx.body = newCart;
		// } else {
			ctx.status = 200;
			ctx.body = result;
		// }
	} catch (error) {
		ctx.status = 404;
		console.log('error', error);
	}
})

router.get('/events/orders', async (ctx) => {
	try {
		var result = await db.getCompletedOrders();
		ctx.status = 200;
		ctx.body = result
	} catch (error) {
		console.log('error /events/orders!');
	}
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, function() {
	console.log('koa up on 3000!');
});