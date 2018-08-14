# Teamspeak 3 Query (ts3query)

A Teamspeak3 Query interface in Node.js.

## Usage

### Installation

```
$ npm i teamspeak3query
```

### How to use

```
cosnt TS3Query = require('teamspeak3query').TS3Query;
const ts = new TS3Query();
```

Package exports a factory function so you can write it less verbously:

```
const ts = require('teamspeak3query')();
// or
const ts3query = require('teamspeak3query');
const ts = ts3query();
```

#### Connecting to teamspeak 3 query

```
const connectionPromise = ts.connect(port, host);
connectionPromise.then(...);
```

`connect` method returns promise that is resolved after successful connection to teamspeak 3 query and receiving welcome message from teamspeak 3 server. Rejected in case of any error, be it connection or server did not respond as a teamspeak 3 query.

#### Sending commands to teamspeak 3 query

```
ts.send(command, params);

// Example:
ts.send(clientinfo, {clid: 109}).then(client => ...)
```

`send` method accepts 2 parameters 1st is command which must be a string, and 2nd is object containing parameters for the command to be send. Parameters are object which every key value must be a string. Parameters are appended to the command as `key=value` or if value is a boolean and equal true - `-key`. You can ofcourse pass the parameters along with a command like: `clientinfo clid=109`.

For information about all available commands head to [TeamSpeak3 Query Manual](http://media.teamspeak.com/ts3_literature/TeamSpeak%203%20Server%20Query%20Manual.pdf);

#### Closing connection

```
ts.close()
```

It is important to note that you need to close connection by yourself by calling `close` method on `TS3Query` object.

NOTE: Note that all pending messages to teamspeak 3 server will end in promise rejection with error saying that connection was closed before getting a response, so i most of the cases you would like to wait untill all of the messages are received and then close connection.

If you want to wait for all of the messages to complete and then close use `waitAndClose` method. It will wait for all pending messages at the moment of method call, all commands send after call of this method wont be waiting upon and could end in not receiving response.

#### Handling teamspeak 3 query events

To handle teamspeak 3 events you can register event handlers with `on` and `once` methods. Available events are: `server` and `channel` and `text`.
Then you will need to register event with teamspeak 3 server by calling `servernotifyregister` (check teamspeak 3 query manual).

NOTE: Note that teamspeak 3 query can listen for events only on one channel, it is limitation on teamspeak 3 server.

Callback will be called with object containg 2 keys `event` and `data` where event describes event send by teamspeak 3 server (`notifytextmessage`, `notifycliententerview`, `notifyclientleftview`) and data is object with all of the data send by teamspeak 3 query.

### Node version

Tested with node version: v10.7.0. I cannot asure it will work with other versions of node.

### License

MIT
