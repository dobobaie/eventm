// -------------- BEHIND
const mevent = new require('../eventm')();

const myLib = new function()
{
	this.tryEventInSingleParam = (cb) => mevent.create('tryEventInSingleParam', cb);
	setTimeout(() => mevent.getEvent('tryEventInSingleParam').resolve('tryEventInSingleParam function executed'), 1000);

	this.tryEventMultiParams = (cb) => mevent.create('tryEventMultiParams', cb, { disableErrorParameter: false });
	setTimeout(() => mevent.getEvent('tryEventMultiParams').resolve('tryEventMultiParams function executed'), 2000);

	this.tryEventWithPromise = (cb) => mevent.create('tryEventWithPromise', cb, { promise: true });
	setTimeout(() => mevent.getEvent('tryEventWithPromise').resolve('tryEventWithPromise function executed'), 3000);

	this.tryEventKeepSession = (cb) => mevent.create('tryEventKeepSession', cb, { promise: true });
	setTimeout(() => mevent.getEvent('tryEventKeepSession').resolve('tryEventKeepSession function executed'), 4000);

	this.tryEventDontKeepSession = (cb) => mevent.create('tryEventDontKeepSession', cb, { keepSession: false, promise: true });
	setTimeout(() => mevent.getEvent('tryEventDontKeepSession').resolve('tryEventDontKeepSession function executed'), 4000);

	this.tryAnEventInReject = () => {
		mevent.create('tryAnEventInReject', null, { promise: true });
		setTimeout(() => mevent.getEvent('tryAnEventInReject').reject('tryAnEventInReject function executed'), 5000);;
	};
}

// -------------- AHEAD
myLib.tryEventInSingleParam(data => {
	console.log(data);
	myLib.tryEventMultiParams(async (err, data) => {
		console.log(err, data);
		data = await myLib.tryEventWithPromise();
		console.log(data);
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
