var express     = require('express'),
    get         = require('http').get,
    nunjucks    = require('nunjucks'),
    moment      = require('moment'),
    cheerio     = require('cheerio');

var app = express();

moment.lang('nb');

nunjucks.configure('views', {
    autoescape  : true,
    express     : app
});

var left = "";
var date = "";
var lastUpdate = "";


var options = {
  hostname: 'netcom.no',
  port: 80,
  path: '/kvotestatus/redirectpage.html'
};

function formatUsageData(err, data, callback2) {
    if(err) {
        console.log(err);
        return
    }
    
    $ = cheerio.load(data);
    var section = $('.section')[1];
    //left = section.children[0].data.match(/[0-9]{0,3},[0-9]{0,3}/)[0];
    //date = section.children[3].children[0].data.match(/[0-9]{2}.[0-9]{2}.[0-9]{4}\s[0-9]{2}.[0-9]{2}/)[0];
    left = "199,555";
    date = "2345iasdf";
    lastUpdate = moment().format("DD/MM/YYYY HH:mm:ss");
    console.log(left, date, lastUpdate, moment.lang());    
    callback2();

}

function getUsageData(options, callback, callback2) {

    get(options, function(response) {
        var body = "";
        response.setEncoding('utf8');

        response.on('data', function(chunk) {
            body += chunk;
        });

        response.on('end', function() {
            callback(null,body, callback2);
        });

    }).on('error', function(e) {
        callback(e,null, callback2);
    });
    
}



app.get('/', function(req, res) {
    getUsageData(options, formatUsageData, function() {
        res.render('index.html', {
            title: "Kvotestatus",
            data: left.slice(0,5) + " GB",
            lastUpdate: lastUpdate,
            renew: date
        });
    });
});

app.listen(3000);

