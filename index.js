const net = require('net');

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

class TS3Query {
  constructor() {
    this.queue = [];
    this.data = '';
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
  }

  attachListener() {
    this.socket.on('data', data => {
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
}

module.exports = function() {
  return new TS3Query();
};
module.exports.TS3Query = TS3Query;

function parseInput(data) {
  data = data.split('\n\r').filter(x => x !== '');
  if (data.length === 1) return { error: parseInputError(data[0]) };
  else
    return { data: parseInputData(data[0]), error: parseInputError(data[1]) };
}
exports.parseInput = parseInput;

function parseInputError(input) {
  const err = /error id=(\d+) msg=((?:\w|\\)+)/.exec(input);

  if (err === null) {
    return {
      id: -1,
      msg: 'Parsing error!'
    };
  }

  return {
    id: +err[1],
    msg: decodeTS3String(err[2])
  };
}

function parseInputData(data) {
  const res = [];
  data = data.split('|');
  data.forEach(chunk => {
    const obj = {};
    const props = chunk.split(' ');
    props
      .map(prop => prop.split('='))
      .forEach(
        ([key, ...rest]) => (obj[key] = decodeTS3String(rest.join('=')))
      );
    res.push(obj);
  });
  return res.length === 1 ? res[0] : res;
}

function encodeTS3String(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\//g, '\\/')
    .replace(/ /g, '\\s')
    .replace(/\|/g, '\\p')
    .replace(/\u0007/g, '\\a')
    .replace(/[\b]/g, '\\b')
    .replace(/\f/g, '\\f')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\v/g, '\\v');
}
exports.encodeTS3String = encodeTS3String;

function decodeTS3String(str) {
  return str
    .replace(/\\\\/g, '\\')
    .replace(/\\\//g, '/')
    .replace(/\\s/g, ' ')
    .replace(/\\p/g, '|')
    .replace(/\\a/g, '\u0007')
    .replace(/\\b/g, '\b')
    .replace(/\\f/g, '\f')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\v/g, '\v');
}
exports.decodeTS3String = decodeTS3String;
