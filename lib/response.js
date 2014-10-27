/**
 * Created by fabiofumarola on 27/10/14.
 */

"use strict";

var Error = require('./error');
/**
 *
 * @constructor
 */
function Response(url) {
    this.url = url;
    this.redirectUrl = null;
    this.webElement = null;
    this.error = null;
}

Response.prototype.setRedirectUrl = function(redirectUrl){
    this.redirectUrl = redirectUrl
};

Response.prototype.setWebElement = function(webElement){
    this.webElement = webElement;
};

Response.prototype.setError = function(errorCode,errorMessage){
  this.error = new Error(errorCode,errorMessage);
};

Response.prototype.setError = function(err){
    this.error = err;
}

module.exports = Response;