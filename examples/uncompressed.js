// -------------- BACK
const eventm = require('../eventm');

const myLib = new function()
{
	const mevent = eventm('myLib');

	this.ready = (cb) => mevent.on('ready', cb, { isUnique: false, onlyData: true, cache: true });
	setTimeout(() => mevent.resolve('ready'), 1000);

	this.listen = (cb) => mevent.on('listen', cb, { cache: true });
	setTimeout(() => mevent.resolve('listen', 'Listen port 4000'), 2000);

	this.response = (cb) => mevent.on('response', cb, { onlyData: true });
	setTimeout(() => mevent.resolve('response', 'Hello World'), 3000);

	this.send = (data) => {
		mevent.on('send', null, { promise: true });
		mevent.reject('send', `You can't send message`);
	};
}

// -------------- FRONT
myLib.ready(async () => {
	console.log('MyLib is ready');
	myLib.listen((err, data) => { // if promise is enable you can just do it : await myLib.listen();
		if (err) return ;
		console.log(err, data);
		myLib.response((res) => {
			console.log(data, '=>', res);
			myLib.send('Send a message').then(data => ...).catch(err => ...);
		});
	});
});
