const chai = require('chai');
chai.use(require('chai-arrays'));
chai.should();

const ts3query = require('..');

describe('TS3Query#encodeTS3String', () => {
  const ets = ts3query.encodeTS3String;
  it('Encodes / character properly', () => {
    ets('/').should.be.equal('\\/');
  });
  it('Encodes \\ character properly', () => {
    ets('\\').should.be.equal('\\\\');
  });
  it('Encodes " " character properly', () => {
    ets(' ').should.be.equal('\\s');
  });
  it('Encodes | character properly', () => {
    ets('|').should.be.equal('\\p');
  });
  it('Encodes BELL character properly', () => {
    ets('\u0007').should.be.equal('\\a');
  });
  it('Encodes backspace character properly', () => {
    ets('\b').should.be.equal('\\b');
  });
  it('Encodes formfeed character properly', () => {
    ets('\f').should.be.equal('\\f');
  });
  it('Encodes newline character properly', () => {
    ets('\n').should.be.equal('\\n');
  });
  it('Encodes carridge return character properly', () => {
    ets('\r').should.be.equal('\\r');
  });
  it('Encodes horizontal tab character properly', () => {
    ets('\t').should.be.equal('\\t');
  });
  it('Encodes vertical tab character properly', () => {
    ets('\v').should.be.equal('\\v');
  });
});
