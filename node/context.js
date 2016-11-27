/**
 * REST Service
 *
 * User: sumit
 *
 */


var parse = require('./parse_orion.js');
// Fetch the computer's mac address 
var getmac = require('getmac');
 
// Validate that an address is a mac address 
var mac_address;
getmac.getMac(function(err,macAddress){
    if (err)  throw err
   // console.log(macAddress)
    mac_address = macAddress;
})


/**
 * Get Query Instrument
 *
 * @param   req: the http server request object
 * @param   res: the http server response object
 */
exports.intiailize = function(username, password)
{
    console.log('\ncontext::intiailize');
    parse.intializeToken(username , password );
};
/**
 * Get Query Instrument
 *
 * @param   req: the http server request object
 * @param   res: the http server response object
 */
exports.queryInstrument = function(req, res)
{
    console.log('\ncontext::queryInstrument');
    parse.query(mac_address,
        function(statusCode, result)
        {
            // The service will need the full objects for processing in the service
           // console.log(result);
            res.statusCode = statusCode;
            res.send(result);
        });
};

/**
 * addInstrument
 *
 * @param   req: the http server request object
 * @param   res: the http server response object
 */

exports.addInstrument = function(req, res)
{
    console.log('\ncontext::addInstrument');
    var item = {
              'attributes' : [
                {
                  'name' : 'printer_' + req.params.id,
                  'type' : 'printer',
                  'value' : mac_address
                },
                {
                  'name' : 'heatbed_temperature_actual_'  + req.params.id ,
                  'type' : 'float',
                  'value' : '0.0'
                },
                   {
                  'name' : 'heatbed_temperature_target_'  + req.params.id ,
                  'type' : 'float',
                  'value' : '0.0'
                },
                   {
                  'name' : 'nozzle_temperature_actual_'  + req.params.id ,
                  'type' : 'float',
                  'value' : '0.0'
                },
                   {
                  'name' : 'nozzle_temperature_target_'  + req.params.id ,
                  'type' : 'float',
                  'value' : '0.0'
                },
                   {
                  'name' : 'chamber_temperature_actual_'  + req.params.id ,
                  'type' : 'float',
                  'value' : '0.0'
                },
                  {
                  'name' : 'chamber_temperature_target_'  + req.params.id ,
                  'type' : 'float',
                  'value' : '0.0'
                }
              ]
    };
    console.log(mac_address);
    parse.create( mac_address +'_'+ req.params.id , item, function(statusCode, result){       
                 
        // The service will need the full objects for processing in the service
        //console.log(result);
        res.statusCode = statusCode;
        res.send(result);
    });
    
};

exports.getInstrumentAtributeValue = function(req, res)
{
    console.log('\ncontext::getInstrumentAtributeValue');
    parse.retrieve(mac_address +'_'+ req.params.id , req.params.attribute + '_' + req.params.id, function(statusCode, result){       
                 
        // The service will need the full objects for processing in the service
        //console.log(result);
        res.statusCode = statusCode;
        res.send(result);
    });
    
};

exports.getInstrumentDataById = function(req, res)
{
    console.log('\ncontext::getInstrumentDataById');
    parse.query(mac_address +'_'+req.params.id,
        function(statusCode, result)
        {
            // The service will need the full objects for processing in the service
           // console.log(result);
            res.statusCode = statusCode;
            res.send(result);
        });
    
};



exports.updateInstrumentAtributeValue = function(req, res)
{
    console.log('\ncontext::updateInstrumentAtributeValue');

    var attribute = {
        
                  'name' : req.params.attribute + '_'  + req.params.id ,
                  'type' : 'float',
                  'update' : {'value' : req.query.value}
    };

    parse.update( mac_address +'_'+ req.params.id , attribute, function(statusCode, result){       
                 
        // The service will need the full objects for processing in the service
        //console.log(result);
        res.statusCode = statusCode;
        res.send(result);
    });
    
};

exports.getInstrumentMacAddress = function(req, res)
{
    console.log('\ncontext::getInstrumentMacAddress');
    res.send(mac_address);

}
