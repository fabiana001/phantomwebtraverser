/**
 * Created by fabiofumarola on 07/10/14.
 */

"use strict";
var express = require('express')
var app = express();

var log4js = require("log4js");
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: 'log/service.log', category: 'traverser' }
    ]
});
var logger = log4js.getLogger('traverser');
logger.setLevel("DEBUG");

var Traverser = require('./lib/pagetraverser');
var Response = require('./lib/response')

var redis = require('redis');
var redisClient = redis.createClient();
var expireTime = 60 * 60 * 48 //60 seconds * 60 minutes * 2 equivalent to 48 hours

app.use(function (err, req, res, next) {
    logger.error(err);
    res.status(500).send('Something broke!');
});

app.route('/traverse')
    .get(function (req, res, next) {
        var url = req.query.url;

        if (!url) {
            console.log("invalid url " + url);
            res.status(500).json(new Response(url, null, null, 500, "invalid url parameter" + url))
        } else {

            logger.info('processing request for ' + url);
            var uri = decodeUrl(url);

            var startTime = Date.now();
            redisClient.get(uri, function (err, data) {
                if (!data) {
                    logger.info("no data found in redis for " + uri);
                    var start = Date.now();

                    Traverser.traverse(uri, function (err, response) {
                        var end = Date.now();
                        //save to redis instance
                        redisClient.set(uri, JSON.stringify(response), redis.print);
                        redisClient.expire(uri, expireTime, redis.print);
                        logger.info(uri + " processed in " + (end - start).toString() + "ms");

                        if (err) {
                            logger.error("traverser got error " + err.toString() + " for url " + uri);
                            res.status(err.code).json(response);
                        } else {
                            res.json(response);
                        }

                    });
                } else {
                    var end = Date.now();
                    logger.info(uri + " processed from redis in " + (end - startTime).toString() + "ms")
                    console.log((end - startTime).toString() + "ms");
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

/**
 * function made to decode coded urls
 * @param url
 * @returns {*}
 */
function decodeUrl(url) {
    var uri = url;
    for (var i = 0; i < 6; i++) {
        uri = decodeURIComponent(uri);
    }
    return uri;
}