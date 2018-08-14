const chai = require('chai');
chai.use(require('chai-arrays'));
const should = chai.should();

const ts3query = require('..');

describe('TS3Query#parseInput', () => {
  const pi = ts3query.parseInput;
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
