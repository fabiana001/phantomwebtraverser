var expect = require('chai').expect,
    nodewebtraverser = require('..');

describe('nodewebtraverser', function() {
  it('should say hello', function(done) {
    expect(nodewebtraverser()).to.equal('Hello, world');
    done();
  });
});
