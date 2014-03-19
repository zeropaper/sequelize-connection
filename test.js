var expect = require('expect.js');
describe('sequelize-connection', function() {
  var lib;
  it('loads', function() {
    lib = require('./index.js');
    // expect(function() {}).not.to.throwError();
  });

  it('is a function', function() {
    expect(lib).to.be.a('function');
  });

  it('has a URIExp property', function() {
    expect(lib.URIExp).to.be.a(RegExp);
  });

  describe('connection URI expression', function() {
    it('matches mysql://username:password@host:9999/database', function() {
      expect('mysql://username:password@host:9999/database').to.match(lib.URIExp);
    });

    it('only accepts known protocols', function() {
      expect('something://username:password@host:9999/database').not.to.match(lib.URIExp);
    });

    it('supports URI without password', function() {
      expect('mysql://username@host:9999/database').to.match(lib.URIExp);
    });

    it('supports URI without port number', function() {
      expect('mysql://username@host/database').to.match(lib.URIExp);
    });

    it('supports password containing @', function() {
      expect('mysql://username:56@qwss@host/database').to.match(lib.URIExp);
    });

    it('supports password containing :', function() {
      expect('mysql://username:56:qwss@host/database').to.match(lib.URIExp);
    });

    it('supports password containing @ and :', function() {
      expect('mysql://username:56:qw@ss@host/database').to.match(lib.URIExp);
    });
  });
  
  describe('URI parsing tool', function() {
    it('matches mysql://username:password@host:9999/database', function() {
      var parsed = lib.parseURI('mysql://username:password@host:9999/database');
      expect(parsed).to.only.have.keys([
        'protocol',
        'username',
        'password',
        'host',
        'port',
        'database'
      ]);
    });

    it('only accepts known protocols', function() {
      expect(lib.parseURI('something://username:password@host:9999/database')).to.be(false);
    });

    it('supports URI without password', function() {
      var parsed = lib.parseURI('mysql://username@host:9999/database');
      expect(parsed).to.only.have.keys([
        'protocol',
        'username',
        'host',
        'port',
        'database'
      ]);
    });

    it('supports URI without port number', function() {
      var parsed = lib.parseURI('mysql://username@host/database');
      expect(parsed).to.only.have.keys([
        'protocol',
        'username',
        'host',
        'database'
      ]);
    });

    it('supports password containing @', function() {
      var parsed = lib.parseURI('mysql://username:56@qwss@host/database');
      expect(parsed.password).to.be('56@qwss');
    });

    it('supports password containing :', function() {
      var parsed = lib.parseURI('mysql://username:56:qwss@host/database');
      expect(parsed.password).to.be('56:qwss');
    });

    it('supports password containing @ and :', function() {
      var parsed = lib.parseURI('mysql://username:56:qw@ss@host/database');
      expect(parsed.password).to.be('56:qw@ss');
    });
  });
});