/**
 * Created by fabiana on 2/22/16.
 */
"use strict";
var page = require('webpage').create();
var system = require('system');

page.viewportSize = {width: 1280, height: 1024};

var url = system.args[1];
var output = system.args[2];

page.open(url, function (status) {
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit(1);
    }
});


page.onLoadFinished = function() {
    page.render(output);
    phantom.exit();
};