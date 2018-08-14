const TS3Query = require('./ts3query');
const {
  encodeTS3String,
  decodeTS3String,
  parseInput,
  parseInputData,
  parseInputError
} = require('./util');

module.exports = exports = function() {
  return new TS3Query();
};

exports.TS3Query = TS3Query;
exports.encodeTS3String = encodeTS3String;
exports.decodeTS3String = decodeTS3String;
exports.parseInput = parseInput;
exports.parseInputData = parseInputData;
exports.parseInputError = parseInputError;
