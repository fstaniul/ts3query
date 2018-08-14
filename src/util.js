module.exports = exports = {};

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
