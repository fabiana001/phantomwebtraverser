/**
 * Created by fabiofumarola on 07/10/14.
 */
var Traverser = require('./lib/pagetraverser');
var WebElement = require('./lib/webelement');
var express = require('express')
var app = express();
var redis = require('redis');
var redisClient = redis.createClient();
var expireTime = 60 * 60 * 2 //60 seconds * 60 minutes * 2 equivalent to 2 hours

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

/**
 * function made to decode coded urls
 * @param url
 * @returns {*}
 */
function decodeUrl(url){
    var uri = url;
    for (var i=0; i<6; i++){
        uri = decodeURIComponent(uri);
    }
    return uri;
}

app.route('/traverse')
    .get(function (req, res, next) {
        var url = req.query.url;

        if (!url) {
            console.log("invalid url " + url);
            res.status(500).send('{}');
        } else {
            console.log('got request from ' + url);
            var uri = decodeUrl(url);
            console.log('decode url is ' + uri);
            console.log('checking on redis instance');

            var getStart = Date.now();
            redisClient.get(uri, function(err,data){
                if (!data){
                    console.log("no data found in redis for " + uri);
                    var start = Date.now();
                    Traverser.traverse(uri, function (err, data) {

                        if (err) {
                            console.log("error " + err.status + " in getting url " + err.url);
                            res.status(err.status).send(err.url);
                        } else {
                            var end = Date.now();
                            //save to redis instance
                            redisClient.set(uri,JSON.stringify(data),redis.print);
                            redisClient.expire(uri,expireTime,redis.print);
                            console.log((end - start).toString() + "ms");
                            res.json(data);
                        }
                    });
                } else {
                    var end = Date.now();
                    console.log((end - getStart).toString() + "ms");
                    res.json(JSON.parse(data));

                }
            });
        }
    });

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('phantomwebtraverser app listening at http://%s:%s', host, port)

});