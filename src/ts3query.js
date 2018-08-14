const net = require('net');
const events = require('events');
const Deferred = require('./deferred');
const { encodeTS3String, parseInput, parseInputData } = require('./util');

class TS3Query {
  constructor() {
    this.queue = [];
    this.data = '';
    this.eventEmitter = new events.EventEmitter();
  }

  connect(port, host, options) {
    host = host || 'localhost';

    this.close();
    this.socket = new net.Socket(options);

    const def = new Deferred();
    this.socket.connect(
      port,
      host
    );
    this.socket.once('data', data => this.isTS3Server(def, data));
    def.promise.then(() => this.attachListener(), () => this.close());

    return def.promise;
  }

  close(err) {
    if (this.socket) {
      if (err) this.socket.destroy(err);
      else this.socket.end();
    }

    this.queue.forEach(el =>
      el.reject(new Error('Connection closed before receiving data!'))
    );
    this.queue = [];
    this.data = '';
  }

  waitAndClose() {
    const promises = this.queue.map(e => e.promise);
    return Promise.all(promises).then(() => this.close());
  }

  attachListener() {
    this.socket.on('data', data => {
      data = data.toString('utf8');

      // if this is event message send by teamspeak 3 query then handle event and leave rest.
      if (/notify/.test(data)) return this.handleEvent(data);

      this.data += data;

      if (!/error id=\d+ msg=.*?\n\r$/.test(data)) return;

      const def = this.queue.shift();
      const result = parseInput(this.data);
      this.data = '';

      if (result.error.id === 0 && result.error.msg === 'ok')
        def.resolve(result);
      else def.reject(result);
    });
  }

  handleEvent(stringData) {
    const splitStringData = stringData.split(' ');
    const event = splitStringData[0];
    const data = parseInputData(splitStringData.slice(1).join(' '));

    if (event === 'notifycliententerview' || event === 'notifyclientleftview')
      this.eventEmitter.emit('server', { event, data });

    if (event === 'notifytextmessage')
      this.eventEmitter.emit('text', { event, data });

    if (event === 'notifyclientmoved')
      this.eventEmitter.emit('channel', { event, data });
  }

  isTS3Server(def, data) {
    if (data instanceof Buffer) data = data.toString('utf8');
    if (/^TS3/.test(data)) def.resolve();
    else def.reject();
  }

  /**
   * Send command to teamspeak 3 query, ends message with `\n\r`.
   *
   * All properties passed are assigned to command as: `key=value`. If value is a boolean then `--key`.
   * That is because teamspeak 3 query sometimes required not `prop=1` but `--prop`.
   *
   * When appending value is encoded so client does not have to do it themselves.
   *
   * You can skip passing parameters and do it by yourself just passing raw command.
   *
   * Command parameter is send as is.
   * @param {string} command - Command to be send to teamspeak 3 query.
   * @param {object} props - Represents properties to be attached to command.
   */
  send(command, props) {
    if (typeof props !== 'object' && typeof object !== 'string') props = {};

    Object.keys(props).forEach(key => {
      let value = props[key];
      if (typeof value === 'boolean') command += ` --${key}`;
      if (typeof value !== 'string') value += '';
      command += ` ${key}=${encodeTS3String(value)}`;
    });

    const def = new Deferred();

    this.socket.write(command + '\n\r', 'utf8', () => {
      this.queue.push(def);
    });

    return def.promise;
  }

  on(event, cb) {
    this.eventEmitter.on(event, cb);
  }

  once(event, cb) {
    this.eventEmitter.once(event, cb);
  }

  removeListener(event, cb) {
    this.eventEmitter.removeListener(event, cb);
  }

  removeAllListeners() {
    this.eventEmitter.removeAllListeners();
  }
}

module.exports = TS3Query;
