var express     = require('express'),
    get         = require('http').get,
    nunjucks    = require('nunjucks'),
    moment      = require('moment'),
    path        = require( "path" ),
    cheerio     = require('cheerio');

var app = express();

moment.lang('nb');

nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape  : true,
    express     : app
});

var left = "";
var date = "";
var lastUpdate = "";

var history = new Array();

function updateHistory(date , left) {
    history.unshift([date, left]);

    if (history.length >= 6) {
        history = history.splice(0,7);
    }
}

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
    left = section.children[0].data.match(/[0-9]{0,3},[0-9]{0,3}/)[0];
    date = section.children[3].children[0].data.match(/[0-9]{2}.[0-9]{2}.[0-9]{4}\s[0-9]{2}.[0-9]{2}/)[0];
    lastUpdate = moment().format("DD.MM.YYYY HH:mm:ss");
    console.log(left, date, lastUpdate);    
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
            renew: date + ":00",
            history: history
        });
        updateHistory(lastUpdate, left);
    });
});

app.listen(3000, '127.0.0.1');

