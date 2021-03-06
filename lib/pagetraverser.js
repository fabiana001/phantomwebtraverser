/**
 * Created by fabiofumarola on 07/10/14.
 */
"use strict";
var phantom = require('phantom');
var phantomjs = require('phantomjs');
var Response = require('./response');
var Error = require('./error');
var path = require('path');
var childProcess = require('child_process');
var process = require('process');
var util = require('util');
var sizeof = require('object-sizeof');

exports.traverseAsync = function (url,  callback) {

    var childArgs = [
        path.join(__dirname, 'phantom-traverse.js'),
        url

    ];

    var options = {maxBuffer: 4000 * 1024};

    var child = childProcess.execFile(phantomjs.path, childArgs, options, function (err, stdout, stderr) {

        function isJson(elem) {
            return elem[0] == "{";
        }

        var lines = stdout.split("\n").filter(isJson);

        if (lines.length == 1) {
            callback(err, lines[0]);
        } else {
            var response = new Response(url, null, null);
            response.setError(new Error('-1', "error in parsing response of childProcess for url " + url));
            callback(err, JSON.stringify(response));
        }

    });

    child.on('exit', function () {
        child.kill();
    });

    child.on('close', function () {
        child.kill();
    });

};
exports.getScreenshot = function (url,  callback){
    var outputFile = "out.png";

    var childArgs = [
        path.join(__dirname, 'phantom-screenshot.js'),
        url,
        outputFile
    ];

    var options = {maxBuffer: 4000*1024};

    childProcess.execFile(phantomjs.path, childArgs, options ,function(err, stdout, stderr) {

        callback(err, outputFile)

    });

};


var args = process.argv.slice(2);

//If you need a main function for testing the class
//if (args.length === 1) {
//    var u = args[0];
//    var start = new Date().getTime();
//    this.traverseAsync(u, function (err, response) {
//        //console.log(JSON.stringify(response));
//        console.log("Memory consuption in byte: " + util.inspect(process.memoryUsage()));
//       // console.log(util.inspect(process.memoryUsage()));
//        console.log("Size response in byte: " + sizeof(response));
//        var end =  new Date().getTime();
//        var total = (end - start)/1000;
//        console.log("Total time in sec = "+ total)
//    });
//
//
//
//} else console.log("error in params'number");

