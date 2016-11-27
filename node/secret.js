/**
 * Secret keys
 *
 * User: sumit
 * 
 */

//var config = require("./config").auth;
var rest = require("./rest");

var token = '';
/**
 * Convenience function to create http options for parse.
 * This sets up the url, port and headers while expecting callers to set path and method
 */

/**
 * Parse Query:  Querys objects of a context id.
 * @param 
 * @param onResults: callback function for results
 */
var getAuthToken = function(options, credentials, callback)
{
    console.log("Secret::intializeToken");
    
    //console.log(options);
    rest.postJSON(options, credentials, function(statusCode, result) {
        // The service will need the full objects for processing in the service
            console.log('\nsecret::getAccessToken');
           
            
            //res.send(result);
            if(statusCode == 200)
            {
                module.exports.token = result;
                callback(null, result);
            }
            else 
            {
               //console.log(statusCode);
                 module.exports.token = '';
                 callback({ 'message' : 'cannot get token' }, result);
                
                 
            }
    });
};

module.exports.token = token;
module.exports.getAuthToken = getAuthToken;