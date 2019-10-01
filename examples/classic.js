// -------------- BEHIND
const mevent = new require('../eventm')();

const myLib = new function()
{
	this.tryEvenSuccessCallback = (cb) => mevent.create('tryEvenSuccessCallback').push(cb);
	setTimeout(() => mevent.getEvent('tryEvenSuccessCallback').resolve('tryEvenSuccessCallback function executed'), 1000);

	this.tryEventMultiParams = (cb) => mevent.create('tryEventMultiParams', { promise: false }).push(cb);
	setTimeout(() => mevent.getEvent('tryEventMultiParams').resolve('tryEventMultiParams function executed'), 2000);

	this.tryEventKeepSession = (cb) => mevent.create('tryEventKeepSession').push(cb);
	setTimeout(() => mevent.getEvent('tryEventKeepSession').resolve('tryEventKeepSession function executed'), 3000);

	this.tryEventDontKeepSession = (cb) => mevent.create('tryEventDontKeepSession', { keepSession: false }).push(cb);
	setTimeout(() => mevent.getEvent('tryEventDontKeepSession').resolve('tryEventDontKeepSession function executed'), 4000);

	this.tryAnEventInReject = () => mevent.create('tryAnEventInReject').getPromise();
	setTimeout(() => mevent.getEvent('tryAnEventInReject').reject('tryAnEventInReject function executed'), 7000);
}

// -------------- AHEAD
myLib.tryEvenSuccessCallback(data => {
	console.log(data);
	myLib.tryEventMultiParams(async (err, data) => {
		console.log(err, data);
		data = await myLib.tryEventKeepSession();
		console.log(data);
		data = await myLib.tryEventKeepSession();
		console.log(data);
		data = await myLib.tryEventDontKeepSession();
		console.log(data);
		myLib.tryEventDontKeepSession(() => {
			console.log('tryEventDontKeepSession 2');
		});
		await myLib.tryAnEventInReject();
	});
});
