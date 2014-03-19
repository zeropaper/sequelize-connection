var _connections = {};
var _ = require('underscore');

var URIExp = /(postgres|mysql|mariadb|sqlite):\/\/([^:]+)(|:(.+))(@([^:]+))(\/|:(\d+)\/)(.+)/;

function parseURI(uri) {
  var parsed = uri.match(URIExp);
  if (!parsed) {
    return false;
  }

  // _.each(parsed, function(val, i) {
  //   if (i) console.info(i, val);
  // });

  var obj = {
    protocol: parsed[1],
    username: parsed[2],

    host:     parsed[6],
    database: parsed[9],
  };
  if (parsed[4]) {
    obj.password = parsed[4];
  }
  if (parsed[8]) {
    obj.port = parseInt(parsed[8], 10);
  }
  return obj;
}

var connection = module.exports = function(options) {
  var database, username, password, Sequelize;

  if (_.isString(options)) {
    var parsed = parseURI(options);
    if (arguments[1] && arguments[1].Utils) {
      Sequelize = arguments[1];
      options = {};
    }
    else {
      options = arguments[1] || {};
    }
    _.extend(options, parsed);
  }

  options = _.clone(options || {});

  Sequelize = Sequelize || options.Sequelize || require('sequelize');

  // if (process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
  //   // the application is executed on Heroku ... use the postgres database
  //   var match = process.env.HEROKU_POSTGRESQL_BRONZE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  //   database = match[5];
  //   username = match[1];
  //   password = match[2];

  //   options = {
  //     dialect:  'postgres',
  //     protocol: 'postgres',
  //     port:     match[4],
  //     host:     match[3],
  //     logging:  true //false
  //   };

  // }
  // else {
    database = options.database;
    delete options.database;

    username = options.username;
    delete options.username;

    password = options.password;
    delete options.password;
  // }

  var cacheId = username +'@'+ options.host + (options.port ? ':'+ options.port : '') +'/'+ database;

  _connections[cacheId] = _connections[cacheId] || new Sequelize(database, username, password, options);
  // console.info('_connections['+cacheId+']', [[_.methods(_connections[cacheId])]]);
  return _connections[cacheId];
};

connection.URIExp = URIExp;

connection.parseURI = parseURI;
