/**
 * Created by fabiofumarola on 07/10/14.
 */
var phantom = require('phantom');
var Response = require('./response');
var Error = require('./error');

var path = require('path')
var childProcess = require('child_process')
var phantomjs = require('phantomjs')

exports.traverseAsync = function (url,  callback){

    var childArgs = [
        path.join(__dirname, 'phantom-traverse.js'),
        url
    ];

    var options = {maxBuffer: 4000*1024};

    childProcess.execFile(phantomjs.path, childArgs, options ,function(err, stdout, stderr) {

        function isJson(elem){
            return elem[0] == "{";
        }

        var lines = stdout.split("\n").filter(isJson);

        if (lines.length == 1){
            callback(err,lines[0]);
        } else {
            var response = new Response(url, null,null);
            response.setError(new Error('-1',"error in parsing response of childProcess for url " + url ));
            callback(err,JSON.stringify(response));
        }

    });

};

/**
 *
 * @param url
 * @param callback contains a message with type [Error, Response]
 */
exports.traverse = function (url, callback) {

    phantom.create(function (ph) {

        ph.createPage(function (page) {

            var error = false;
            var redirectUrl = null;

            //check if the url exists
            page.set('onResourceReceived', function (response) {
                if (response.stage == 'end' && response.url == url){
                    if (response.status == '200'){
                        error = false;
                    }else if (response.status == '301' || response.status == '302'){
                        error = false;
                        redirectUrl = response.redirectURL;
                    } else {

                        var code = response.status;
                        if (code == null)
                            code = '404';

                        var err = new Error(code, "got response " + code + " from " + url);
                        var response = new Response(url);
                        response.setError(err);
                        callback(err, response);
                        error = true;
                    }
                }
            });

            //open the page
            page.open(url, function (status) {
                if (!error) {
                    traversePage(page, ph, function(err,result){
                        var response = new Response(url);
                        response.setRedirectUrl(redirectUrl);
                        if (err){
                            response.setError(err);
                        } else {
                            response.setWebElement(result);
                        }
                        callback(err,response);
                    });
                }
            });
        });
    });
};

function traversePage(page, ph, callback) {

    page.evaluate(function () {

        var noCss = "NO-CSS";
        var nextId = 1;

        var body = document.body;
        if (!body){
          return null;
        }

        var webElement = populateTree("html", "html", noCss, body, null);

        function populateTree(parentPath, parentDomCSSPath, parentPathCSSPath, node, parent) {

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

        return webElement;


        //Data Model
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

        function WebElement(id, parentPath, parentDomCSSPath, parentCSSPath, nodeTag, position, size, attributes, text) {
            this.webPageTraverserId = id
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

    }, function (result) {
        if (!result){
            var err = new Error("404", "error parsing html dom");
            callback(err, null);
        } else
            callback(null, result);
        ph.exit();
    });
};


