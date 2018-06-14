// -------------- BEHIND
const eventm = require('../eventm');

const myLib = new function()
{
	const mevent = eventm('myLib');

	this.ready = (cb) => mevent.on('ready', cb, { isUnique: false, onlyData: true, cache: true });
	setTimeout(() => mevent.resolve('ready'), 1000);

	this.listen = (cb) => mevent.on('listen', cb, { cache: true });
	setTimeout(() => mevent.resolve('listen', 'Listen port 4000'), 2000);

	this.response = (cb) => mevent.on('response', cb, { promise: true });
	setTimeout(() => mevent.resolve('response', 'Hello World'), 3000);

	this.send = (data) => {
		mevent.on('send', null, { promise: true });
		mevent.reject('send', `You can't send message`);
	};
}

// -------------- AHEAD
myLib.ready(async () => {
	console.log('MyLib is ready');
	myLib.listen(async (err, data) => { // if promise is enable you can just do it : await myLib.listen();
		if (err) return ;
		console.log(err, data);
		let res = await myLib.response();
		console.log(data, '=>', res);
		await myLib.send('Send a message');
	});
});
