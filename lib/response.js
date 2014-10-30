/**
 * Created by fabiofumarola on 27/10/14.
 */

"use strict";
/**
 *
 * @constructor
 */
function Response(url, redirectUrl, time) {
    this.url = url;
    this.redirectUrl = redirectUrl;
    this.time = time;
    this.webElement = null;
    this.error = null;
}

Response.prototype.setRedirectUrl = function (redirectUrl) {
    this.redirectUrl = redirectUrl
};

Response.prototype.setWebElement = function (webElement) {
    this.webElement = webElement;
};

Response.prototype.setError = function (err) {
    this.error = err;
};

Response.prototype.setTime = function (time) {
    this.time = time;
};

module.exports = Response;