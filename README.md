# Event Manager
Manage all events in your app

## Install

``` bash
npm install --save eventm

``` 

## Usage
``` js
// -------------- BEHIND
const eventm = require('eventm')();

setTimeout(() => eventm.resolve('ready', 'BEHIND is ready'), 2000);

const behind = {
 ready: (cb) => eventm.on('ready', cb, { onlyData: true }),
};


// -------------- AHEAD
behind.ready((data) => console.log(data));

```

[More examples](https://github.com/dobobaie/eventm/tree/master/examples)

## Functions 

| Name                                                              | Description         
| ----------------------------------------------------------------- | ------------
| on(string: name, function: callback = null, object: options = {}) | `on` listen the `name` evenement and take callback or Promise for the response. `callback` have as default parameters `(err, data)` 
| resolve(any: data = undefined)                                    | `resolve` function is used to set a success response
| reject(any: data = undefined)                                     | `reject` function is used to set an error response

## `On` options

| Name          | Default | Description  
| ------------- | ------- | -----------
| isUnique      |  true   | true = After the response the event is removed
| onlyData      |  false  | true = Only `data` is return during the callback, `err` is ignored
| promise       |  false  | true = Enable Promise and `on` function return a Promise
| cache         |  false  | true = Keep data in cache for a futur call with a callback
| removeCache   |  false  | true = After the response all options and data are reset

## Multi-channel
``` js
// -------------- BEHIND
const event = require('eventm')();
const eventChild = require('eventm')('child');
const eventParent = require('eventm')('parent');

setTimeout(() => event.resolve('ready', 'process is ready'), 1000);
setTimeout(() => eventChild.resolve('ready', 'child is ready'), 1500);
setTimeout(() => eventParent.resolve('ready', 'parent is ready'), 2000);

const behind = {
 ready: (cb) => event.on('ready', cb, { onlyData: true }),
 ready2: (cb) => eventChild.on('ready', cb, { onlyData: true }),
 ready3: (cb) => eventParent.on('ready', cb, { onlyData: true }),
};


// -------------- AHEAD
behind.ready((data) => console.log(data));
behind.ready2((data) => console.log(data));
behind.ready3((data) => console.log(data));

```