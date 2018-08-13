const chai = require('chai');
chai.use(require('chai-arrays'));
const should = chai.should();

const TS3Query = require('./index');

describe('TS3Query#encodeTS3String', () => {
  const ets = TS3Query.encodeTS3String;
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

describe('TS3Query#decodeTS3String', () => {
  const dts = TS3Query.decodeTS3String;
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

describe('TS3Query#parseInput', () => {
  const pi = TS3Query.parseInput;
  it('Parses input with error and data correclty', () => {
    const dataString = 'key=value foo=bar\n\rerror id=0 msg=ok\n\r';
    const res = pi(dataString);
    should.exist(res);
    res.should.have.property('data');
    res.data.should.have.property('key').which.is.equal('value');
    res.data.should.have.property('foo').which.is.equal('bar');

    res.should.have.property('error');
    res.error.should.have.property('id').which.is.eq(0);
    res.error.should.have.property('msg').which.is.eq('ok');
  });

  it('Parses input with just error properly', () => {
    const dataString = 'error id=0 msg=ok\n\r';
    const res = pi(dataString);
    should.exist(res);
    res.should.not.have.property('data');
    res.should.have.property('error');
    res.error.should.have.property('id').equal(0);
    res.error.should.have.property('msg').equal('ok');
  });

  it('Parses input with array', () => {
    const dataString = 'key=value|key=value\n\rerror id=0 msg=ok\n\r';
    const res = pi(dataString);
    res.should.have.property('data').which.is.array();
    res.should.have.property('error');
    res.error.should.have.property('msg').equal('ok');
    res.error.should.have.property('id').equal(0);
    res.data.should.be.ofSize(2);
    for (let i = 0; i < res.data.length; i++) {
      res.data[i].should.deep.equal({ key: 'value' });
    }
  });
});
