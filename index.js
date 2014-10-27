//module.exports = function () {
//  return 'Hello, world';
//};
//
//var Position = require('./lib/position');
//
//var position = new Position(1,2,3,4);
//
//console.log(JSON.stringify(position));
//
//var WebElement = require('./lib/webelement');
//
//var element = new WebElement("body", "body",
//    "body", "body", position, "position", {att: 1},
//    "prova", null);
//
//console.log(element.toString())

//var Traverser = require('./lib/pagetraverser');
//var WebElement = require('./lib/webelement');
//
//var start = Date.now();
//Traverser.traverse('http://www.baritoday.it/cronaca/', function(err,data){
//    console.log(WebElement.prototype.toString.call(data));
//    var end = Date.now();
//    console.log((end - start).toString() + "ms");
//});

//var url = require('url');
//console.log( url.parse(
//    'http://www.di.uniba.it/%25257Ebianchi/shortcv_ita.htm', true
//));

//console.log(decodeURIComponent(decodeURIComponent(decodeURIComponent(decodeURIComponent('http://www.di.uniba.it/%25257Ebianchi/shortcv_ita.htm')))));


var phantom = require('phantom');

phantom.create(function (ph) {
    ph.createPage(function (page) {
        page.open("http://www.google.com", function (status) {
            console.log("opened google? ", status);
            var result = page.evaluate(function () { return this.location; }, function (result) {
                ph.exit();
                console.log(result);
                return result;
            });
            console.log(result);
        });
    });
});