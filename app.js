var express     = require('express'),
    get         = require('http').get,
    nunjucks    = require('nunjucks'),
    cheerio     = require('cheerio');

var app = express();

nunjucks.configure('views', {
    autoescape  : true,
    express     : app
});

var left = "";
var date = "";

var options = {
  hostname: 'netcom.no',
  port: 80,
  path: '/kvotestatus/redirectpage.html'
};

function formatUsageData(err, data) {
    if(err) {
        console.log(err);
        return
    }
    
    $ = cheerio.load(data);
    var section = $('.section')[1];
    left = section.children[0].data.match(/[0-9]{0,3},[0-9]{0,3}/)[0];
    date = section.children[3].children[0].data.match(/[0-9]{2}.[0-9]{2}.[0-9]{4}\s[0-9]{2}.[0-9]{2}/)[0];
    console.log(left, date);    

}

function getUsageData(options, callback) {

    get(options, function(response) {
        var body = "";
        response.setEncoding('utf8');

        response.on('data', function(chunk) {
            body += chunk;
        });

        response.on('end', function() {
            callback(null,body);
        });

    }).on('error', function(e) {
        callback(e,null);
    });
    
}



app.get('/', function(req, res) {
    getUsageData(options, formatUsageData);
    res.render('index.html', {
        title: "Kvotestatus",
        data: left.slice(0,5) + " GB",
        renew: date
    });
});

app.listen(3000);

