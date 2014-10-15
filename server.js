/**
 * Created by fabiofumarola on 07/10/14.
 */
var Traverser = require('./lib/pagetraverser');
var WebElement = require('./lib/webelement');
var express = require('express')
var app = express();

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.route('/traverse')
    .get(function (req, res, next) {
        var url = req.query.url;

        if (!url) {
            res.status(500).send('{}');
        } else {

            var start = Date.now();
            Traverser.traverse('http://www.baritoday.it/cronaca/', function (err, data) {

                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(data);
                    var end = Date.now();
                    console.log((end - start).toString() + "ms");
                }
            });
        }
    });

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)

})