const chai = require('chai');
chai.use(require('chai-arrays'));
chai.should();

const ts3query = require('..');

describe('TS3Query#decodeTS3String', () => {
  const dts = ts3query.decodeTS3String;
  it('Decodes Backslash character (\\) propertly', () => {
    dts('\\\\').should.be.equal('\\');
  });
  it('Decodes Slash character (/) propertly', () => {
    dts('\\/').should.be.equal('/');
  });
  it('Decodes Whitespace character ( ) propertly', () => {
    dts('\\s').should.be.equal(' ');
  });
  it('Decodes Pipe character (|) propertly', () => {
    dts('\\p').should.be.equal('|');
  });
  it('Decodes Bell character (\\a) propertly', () => {
    dts('\\a').should.be.equal('\u0007');
  });
  it('Decodes Backspace character (\\b) propertly', () => {
    dts('\\b').should.be.equal('\b');
  });
  it('Decodes Formfeed character (\\f) propertly', () => {
    dts('\\f').should.be.equal('\f');
  });
  it('Decodes Newline character (\\n) propertly', () => {
    dts('\\n').should.be.equal('\n');
  });
  it('Decodes Carriage Return character (\\r) propertly', () => {
    dts('\\r').should.be.equal('\r');
  });
  it('Decodes Horizontal Tab character (\\t) propertly', () => {
    dts('\\t').should.be.equal('\t');
  });
  it('Decodes Vertical Tab character (\\v) propertly', () => {
    dts('\\v').should.be.equal('\v');
  });
});
