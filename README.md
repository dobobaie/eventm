# Event Manager
Eventm help you to manage all evenements in your code. The library store the state and the callback stack for you.

## ☁️ Installation

```
$ npm install eventm
```
  
## ⚙️ Examples

``` js  
// -------------- BEHIND LIBRARY SIDE
const Eventm = require('eventm');
const mevent = new Eventm();

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

```
   
## 📝 Usage

### Root level

| Name                                                                  | Description         
| --------------------------------------------------------------------- | ------------
| create(string: name, function: callback = null, object: options = {}) | `create` method is used to create a new event and/or push a new callback
| getEvent(string: name)                                                | `getEvent` method is used to retrieve `event level`

### Event level

| Name                                                              | Description         
| ----------------------------------------------------------------- | ------------
| resolve(any: data = undefined)                                    | `resolve` method is used to set a success response
| resolveForced(any: data = undefined)                              | `resolveForced` method is used to set a success response in forced mode (it means: if there are already a statement then this forces the system to recall all callbacks with the new paramter). Obviously it doesn't works for promise.
| reject(any: data = undefined)                                     | `reject` method is used to set an error response
| push(function: callback = null)                                   | `push`  method is used to add new callback

## Options

| Name                  | Default | Description  
| --------------------- | ------- | -----------
| disableErrorParameter |  true  | true = When the callback is executing, only `data` parameter is accessible
| keepSession           |  true   | true = If the callback is alreayd executed, `keepSession` keep the session open for the futur callback
| promise               |  false  | true = Enable Promise and `create` method return a Promise
