/**
 * Created by fabiofumarola on 27/10/14.
 */


function Error(code, message) {
    if (!code)
        this.code = '-1';
    else
        this.code = code;

    this.message = "Error " + JSON.stringify(message) + " with error code " + this.code;
}

module.exports = Error;