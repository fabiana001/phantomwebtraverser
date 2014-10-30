/**
 * Created by fabiofumarola on 28/10/14.
 */


"use strict";
var page = require('webpage').create();
var MyResponse = require('./response');
var system = require('system');
var Error = require('./error');

if (system.args.length === 1) {
    var err = new Error('-1', "Usage: phantom-traverse.js <some URL>");
    var resp = new MyResponse(null, null,null);
    resp.setError(err);
    console.log(JSON.stringify(resp));
    phantom.exit();
}

var url = system.args[1];
var redirectUrl;
var time;

/**
 * called when there are error in the requesteded page
 * @param msg
 * @param trace
 */
page.onError = function (msg, trace) {
    var err = new Error('-1', msg);
    var resp = new MyResponse(null, null,null);
    resp.setError(err);
    console.log(JSON.stringify(resp));
    phantom.exit();
};

/**
 * this method is called to check the request
 * @param response
 */
page.onResourceReceived = function (response) {
    //add to check that response is html
    //console.log(response.stage + " " + response.url + "");
    if (response.stage == 'end' && (response.url == url || response.url + "/" == url)) {
        time = response.time;
        if (response.status == '200') {
            //everything is ok
        } else if (response.status == '301' || response.status == '302') {
            redirectUrl = response.redirectURL;
        } else {
            //it is an error
            var err = new Error(response.status, "Cannot open  " + url);
            var resp = new MyResponse(url, redirectUrl,time);
            resp.setError(err);
            console.log(JSON.stringify(resp));
            phantom.exit();
        }
    }
};



var myErrorCode = '-1';

page.open(url, function (status) {

    var resp = new MyResponse(url,redirectUrl,time);

    if (status != 'success') {
        var err = new Error(myErrorCode, "unable to access to the url " + url);
        resp.setError(err);
    } else {

        var result = page.evaluate(function(resp){

            var noCss = "NO-CSS";
            var myErrorCode = '-1';

            var webElement, err = null;

            var body = document.body;
            if (!body){
                err = new Error(myErrorCode, "unable to access to the network for the url" + url);
            } else {
                try {
                    webElement = populateTree("html", "html", noCss, body);
                } catch (ex){
                    err = new Error(myErrorCode, "Got exception " + ex.message + " for the url " + url);
                }
            }
            return {error: err, webElement: webElement};


            //*** START PRIVATE METHODS TO PAGE EVALUATE

            var nextId = 1;

            function populateTree(parentPath, parentDomCSSPath, parentPathCSSPath, node) {

                var rect = node.getBoundingClientRect();
                var position = new Position(rect.top, rect.left, rect.right, rect.bottom);
                var size = new Size(rect.height, rect.width);

                if (size.height == 0 && size.width == 0)
                    return null;

                var attributes = {};

                for (var i = 0; i < node.attributes.length; i++) {
                    attributes[node.attributes[i].name] = node.attributes[i].value;
                }

                var tagName = node.tagName.toLowerCase();

                var webElem = new WebElement(nextId, parentPath, parentDomCSSPath, parentPathCSSPath,
                    tagName, position, size, attributes, node.innerText);

                nextId += 1;

                var children = node.childNodes;
                for (var i = 0; i < children.length; i++) {

                    var child = children.item(i);
                    var childElem = null;

                    try {
                        if (node.className) {
                            var classValue = node.className;
                            childElem = populateTree(parentPath + "/" + tagName, parentDomCSSPath + "/" + tagName + ":" + classValue,
                                    parentPathCSSPath + "/" + classValue, child)

                        } else {
                            childElem = populateTree(parentPath + "/" + tagName, parentDomCSSPath + "/" + tagName,
                                    parentPathCSSPath + "/" + noCss, child);
                        }
                        if (childElem)
                            webElem.children.push(childElem);
                    } catch (ex) {

                    }
                }

                return webElem;
            }

            function Position(top, left, right, bottom) {
                this.top = top;
                this.left = left;
                this.right = right;
                this.bottom = bottom;
            }

            function Size(height, width) {
                this.height = height;
                this.width = width;
            }

            function WebElement(parentPath, parentDomCSSPath,
                                parentCSSPath, nodeTag, position, size, attributes,
                                text) {
                this.webPageTraverserId = nextId++;
                this.attributes = attributes;
                this.children = [];
                this.nodeTag = nodeTag;
                this.parentPath = parentPath;
                this.parentDomCSSPath = parentDomCSSPath;
                this.parentCSSPath = parentCSSPath;
                this.position = position;
                this.size = size;
                this.text = text;
            }

            function Error(code, message) {
                if (!code)
                    this.code = '-1';
                else
                    this.code = code;

                this.message = "Error " + message + " with error code " + this.code;
            }
        });

        resp.setError(result.error);
        resp.setWebElement(result.webElement);
    }
    console.log(JSON.stringify(resp));
    phantom.exit();

});
