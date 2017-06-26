var http = require('http');

var options = {
  host: 'localhost',
  port: 3500,
  path: '/emision',
  method: 'GET'
};

http.request(options, function(res) {
  // console.log('STATUS: ' + res.statusCode);
  // console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log(chunk);
  });
}).end();
