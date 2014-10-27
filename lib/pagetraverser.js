/**
 * Created by fabiofumarola on 07/10/14.
 */
var phantom = require('phantom');

exports.traverse = function (url, callback) {

    phantom.create(function (ph) {

        ph.createPage(function (page) {

            var error = false;
            var urlToVisit = url;

            //check if the url exists
            page.set('onResourceReceived', function (response) {
                if (response.stage === 'end' && response.url == url) {
                    if (response.status == '200') {
                        error = false;
                    } else if (response.status == '301') {
                        error = false;
                        urlToVisit = response.redirectURL;
                        page.url
                    }
//                    else if (response.status == '302') {
//                        error = false;
//                        urlToVisit = response.redirectURL;
//                    }
                    else {
                        var message = {status: response.status, "url": url};
                        callback(message, null);
                        error = true;
                    }
                }
            });

            //open the page
            page.open(urlToVisit, function (status) {
                if (!error) {
                    console.log(status);
                    traversePage(page, ph, callback);
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

            //elem.children.push(node.childNodes.item(6));
            //elem.children.push(node.childNodes.length);

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
            var message = {status: "no html", "url": url};
            callback(message, null);
        } else
            callback(null, result);

        ph.exit();
    });
};


