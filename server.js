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
var Response = require('./lib/response');
var Error = require('./lib/error');

var redis = require('redis');
var redisClient = redis.createClient(6379, 'redis'); //redis is an /etc/host name ip pair
//var redisClient = redis.createClient();
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
                            logger.error("traverser got error " + JSON.stringify(err) + " for url " + uri);
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

app.route('/traverseAsync').
    get(function (req, res, next) {
        var url = req.query.url;

        if (!url) {
            logger.error("url not set error ");
            res.status(500).json(new Response(url, null, null, 500, "invalid url parameter" + url))
        } else {
            var uri = decodeUrl(url);
            logger.info('getting url ' + uri);

            var startTimeRedis = Date.now();
            redisClient.get(uri, function (err, data) {

                if (!data) {
                    logger.info('no data found on redis traversing from the web');
                    var startTimeWeb = Date.now();
                    Traverser.traverseAsync(url, function (err, response) {
                        var endTimeWeb = Date.now();

                        var parsedResponse = JSON.parse(response);
                        if (!parsedResponse.error)
                            parsedResponse.error = null;

                        //save data to redis
                        redisClient.set(uri, JSON.stringify(parsedResponse), function (err, reply) {
                            if (err)
                                logger.error("Error on saving data for url " + uri + " on redis with error " + err.message);
                            else
                                logger.info("Data for url " + uri + " correctly saved on redis")
                        });
                        redisClient.expire(uri, expireTime);

                        if (err) {
                            var resp = new Response(url, null, null);
                            resp.setError(new Error('-1', err.message));
                            res.status('404').json(resp);
                        } else {
                            res.json(parsedResponse);
                        }
                        logger.info("Web traversing result for " + uri + " returned in " + (endTimeWeb - startTimeWeb) + "ms");
                    });
                } else {
                    var endTimeRedis = Date.now();
                    logger.info("Redis result for " + uri + " returned in " + (endTimeRedis - startTimeRedis) + "ms");
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