/**
 * Created by fabiofumarola on 07/10/14.
 */

var nextId = 1;


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

WebElement.prototype.getNextId = function(){
    return nextId;
};

WebElement.prototype.resetNextId = function() {
    nextId = 1;
};

WebElement.prototype.getChildren = function(){
    return this.children;
};

WebElement.prototype.toString = function(){
    return JSON.stringify(this);
};

module.exports = WebElement;