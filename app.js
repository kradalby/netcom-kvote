var express = require('express'),
    get = require('http').get,
    cheerio = require('cheerio');

var app = express();

var options = {
  hostname: 'netcom.no',
  port: 80,
  path: '/kvotestatus/redirectpage.html'
};

var getDataAndRenew = function(data) {
}

get(options, function(response) {
    var body = "";
    response.on('data', function(chunk) {
        body += chunk;
    });
    response.on('end', function() {
        $ = cheerio.load(body);
        var section = $('.section')[1];
        var left = section.children[0].data.match(/[0-9]{0,3},[0-9]{0,3}\sGB/)[0];
        var date = section.children[3].children[0].data.match(/[0-9]{2}.[0-9]{2}.[0-9]{4}\s[0-9]{2}.[0-9]{2}/)[0];
        console.log(date);
        console.log(left);
    });
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});


app.get('/', function(req, res) {
    res.send("Hello World");
});

app.listen(3000);
