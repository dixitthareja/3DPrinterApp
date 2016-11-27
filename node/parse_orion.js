/**
 * Parse module
 *
 * User: sumit
 * Date: 2/9/12
 */
var config = require('./config').orion;
var config_auth = require('./config').orion_auth;
var rest = require("./rest");
var secret = require("./secret");

var getTokenOptions = function()
{
    var options = {
        host: config_auth.host || 'orion.lab.fi-ware.org',
        port: config_auth.port || 443,
        path: config_auth.path || '/token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return options;
}

exports.token = "";
exports.intializeToken = function(username , password)
{
    var options = getTokenOptions();
    var credentianls = {
        'username' : username,
        'password' : password
    
    };
    secret.getAuthToken(options, credentianls ,function(err, token){
        
        if(!err){
            exports.token = token;
        }
    })
}






/**
 * Convenience function to create http options for parse.
 * This sets up the url, port and headers while expecting callers to set path and method
 */
var getParseOptions = function()
{
    var options = {
        host: config.host || 'orion.lab.fi-ware.org',
        port: config.port || 443,
        path:  config.path || '/ngsi10/contextEntities',
        method: 'GET',
        headers: {
            'X-Auth-Token': exports.token,
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        }
    };

    return options;
}

/**
 * Parse Query:  Querys objects of a context id.
 * @param 
 * @param onResults: callback function for results
 */
exports.query = function(id, onResults)
{
    console.log("parse::query");

    var options = getParseOptions();
    //console.log(secret);
    options.path  += '/' + id;

    //console.log(options);
    rest.getJSON(options, onResults);
};

/**
 * Parse Retrieve:  Retrieve an object by id.
 * @param className
 * @param itemId to retrieve
 * @param onResults: callback function for results
 */
exports.retrieve = function(id, attributes, onResults)
{
    console.log("parse::retrieve");

    var options = getParseOptions();
    options.path += '/'+ id +'/attributes/' + attributes;

    //console.log(options);
    rest.getJSON(options, onResults);
};

/**
 * Parse Create:  Creates an object
 * @param className
 * @param item to create
 * @param onResults: callback function for results
 */
exports.create = function(id, item, onResult)
{
    console.log("parse::create");

    var options = getParseOptions();
    options.method = 'POST';
    options.path  += '/' + id;
    options.headers["Content-Length"] = JSON.stringify(item).length;

    console.log(options);
   // console.log('form data:');
    console.log(item);

    //console.log(item);
    rest.postJSON(options, item, onResult);
};

exports.update = function(id,attribute, onResult)
{
    console.log("parse::update");

    var options = getParseOptions();
    options.method = 'POST';
    options.path  += '/' + id + '/' + 'attributes' + '/' + attribute.name;
    options.headers["Content-Length"] = JSON.stringify(attribute.update).length;

    //console.log(options);
    //console.log('form update:');
    //console.log(attribute.update);

    rest.postJSON(options, attribute.update , onResult);
};

