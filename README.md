[ DEPRECATED ]
# Event Manager
Eventm help you to manage all evenements in your code. The library store the state, data returned and the callback stack for you.  
Can be used like RabbitMQ in your local project.

## ☁️ Installation

```
$ npm install eventm
```
  
## ⚙️ Examples

``` js  
// -------------- BEHIND
const Eventm = require('eventm');
const mevent = new Eventm();

const myLib = new function()
{
	const eventSucessCb = mevent.create('tryEvenSuccessCallback');
	this.tryEvenSuccessCallback = (cb) => eventSucessCb.push(cb);
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

```
   
## 📝 Usage

### Root level

| Name                                                      | Description         
| ----------------------------------------------------------| ------------
| create(string: name, object: options = {}): `Event Level` | `create` method is used to create a new event
| getEvent(string: name): `Event Level`                     | `getEvent` method is used to retrieve `event level`

### Event level

| Name                                                              | Description         
| ----------------------------------------------------------------- | ------------
| resolve(any: data = undefined): undefined                         | `resolve` method is used to set a success response
| resolveForced(any: data = undefined): undefined                   | `resolveForced` method is used to set a success response in forced mode (it means: if there are already a statement then this forces the system to recall all callbacks with the new paramter). Obviously it doesn't works for promise.
| reject(any: data = undefined): undefined                          | `reject` method is used to set an error response
| push(function: callback): Promise                                 | `push`  method is used to add new callback

## Options

| Name                  | Default | Description  
| --------------------- | ------- | -----------
| keepSession           |  true   | true = If the callback is alreayd executed, `keepSession` keep the session open for the futur callback
| promise               |  true   | true = The callback is called with a single paramter - false = The callback is call with (`err`, `data`) => {} parameters
