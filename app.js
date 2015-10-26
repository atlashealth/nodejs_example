var winston = require('winston')

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.File({ filename: '/app/log/production.log' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: '/app/log/exceptions.log' })
  ]
});

var express = require('express'),
    app     = express(),
    pg      = require('pg');

var connectionString = process.env.DATABASE_URL_WEB;

app.get('/', function (req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      logger.warn(err.message);
      res.send(500, 'Problem with database connection. See error log.');
    }
    client.query('SELECT NOW() AS "theTime"', function(err, result) {
      done();

      if(err) {
        logger.warn(err.message);
        res.send('Problem. See error log.');
      } else {
        res.send('Hello, World! Database connection is good.');
      }
    });
  });
});

app.listen(3000, '0.0.0.0');
logger.info('App started');
