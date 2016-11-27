function Device (serial) {
    console.log("class created");
    this._serial = serial;
    this._queue = queue;
    this._busy = false;
    this._current = null;
    this._reply = '';
    var device = this;
    serial.on('data', function (data) {
        console.log(data);
        if(!data)
            return;
        
        if(data.indexOf("ok") === -1){
            this._reply += data + ";|";
        }
        else{
            this._reply += data + ";|";
            
           if (!device._current) return;
            
            device._current[1](null, this._reply );
            this._reply = '';
            this._busy = false;
            device.processQueue();
        }
            

    });
}

Device.prototype.send = function (data, callback) {
    //console.log("send");
    this._queue.push([data, callback]);
    if (this._busy) return;
    this._busy = true;
    this.processQueue();
};

Device.prototype.processQueue = function () {
    //console.log("processQueue");
    var next = this._queue.shift();

    if (!next) {
        this._busy = false;
        return;
    }
    //console.log("processQueue writing");
    this._current = next;
    //console.log(this._serial);
    this._reply = '';
    this._serial.write(next[0]);
};

var serialport = require("serialport"); 
var SerialPort = serialport.SerialPort; 
//var port = "/dev/serial/by-id/usb-RRD__www.ru_RUMBA_-_ATmega_2560_co_953343234303517180A1-if00";
//var port = "/dev/serial/by-id/usb-Arduino__www.arduino.cc__0042_5533033363035191D160-if00";
//var port = "/dev/serial/by-id/usb-RRD__www.ta_TAURINO_-_ATmega_2560_8523535313735161E171-if00";
var port = "/dev/serial/by-id/usb-Arduino__www.arduino.cc__0042_5533033363035191D160-if00";
var queue = [];

var serialPort = new SerialPort(port, {
    baudrate: 115200,
    databits : 8,
    stopbits : 1,
    parser: serialport.parsers.readline("\n")
});


var device = new Device(serialPort);
serialPort.on("open", function(err){

    console.log("open");


});

serialPort.on("error", function(err){

    console.log("error");


});
//Applying Queing
var sendRequest = function(command , callback){
    if(serialPort.isOpen){
        device.send(command + "\n", function(err, data){
         callback(err, data);
    });
    }

};

var get_temperature = function(callback){

    sendRequest("M105", function(err, data){
        if(!err){
            var tempRegexp = /T\d?:(\d+.\d+)\s+\/(\d+.\d+)\s+B:(\d+.\d+)\s+\/(\d+.\d+)\s+T\d?:(\d+.\d+)\s+\/(\d+.\d+)/g;
            var temp = tempRegexp.exec(data);
            console.log(temp);
            if(!temp){
                callback('cannot extract temperature', null);
                return;
            }
            if(temp.length > 6){
                callback(null, temp);
                return;
            }
            else{
                callback('cannot extract temperature', null);
                return;
            
            }

        }        
    });
    

};

var get_sd_filelist = function(callback){
        sendRequest("M20", function(err, data){
            if(!err){
                var listRegexp = /Begin file list;\|(.*);\|End file list/g;
                var list = listRegexp.exec(data);
                
                if(list === null){
                     callback('some error occured', null);
                    return;
                }
                
                if(list.length > 0){
                    var sd_list = list[1].split(";|");
                    callback(null, sd_list);
                    return;
                }
                else{
                    callback('no list found', null);
                    return;

                }

            }        
        });
    };

var get_print_status = function(callback){
        sendRequest("M27",function(err, data){
            if(!err){
                var regexp = /(\d+)\/(\d+)/g;
                var result = regexp.exec(data);
                if(result === null){
                     callback('some error occured', null);
                    return;
                }

                if(result.length > 2){
                    var n = result[1];
                    var d = result[2];
                    callback(null, { 'progress' : n, 'total' : d});
                    return;
                }
                else{
                    callback('no status found', null);
                    return;

                }

            }        
        });
    };

var start_print = function(callback){
        sendRequest("M24",function(err, data){
            if(!err){
                    callback(null, data);
                    return;
            }
            else{
                callback(err, null);
                return;

            }

                    
        });
    };

var pause_print = function(callback){
        sendRequest("M25",function(err, data){
            if(!err){
                    callback(null, data);
                    return;
            }
            else{
                callback(err, null);
                return;

            }

                    
        });
    };
var printer_on_status = function(callback){
        sendRequest("M31", function(err, data){
            if(!err){
                    callback(null, data);
                    return;
            }
            else{
                callback(err, null);
                return;

            }

                    
        });
    };
var select_file_for_printing = function(file, callback){
    
    if(!file){
        callback("not a valid file", null);
        return;
    }
        sendRequest("M23 " + file, function(err, data){
            if(!err){
                    callback(null, data);
                    return;
            }
            else{
                callback(err, null);
                return;

            }

                    
        });
    };

var stop_writing_to_file = function(file, callback){
    
    if(!file){
        callback("not a valid file", null);
        return;
    }
        sendRequest("M29 " + file, function(err, data){
            if(!err){
                    callback(null, data);
                    return;
            }
            else{
                callback(err, null);
                return;

            }

                    
        });
    };
var delete_file_from_sd = function(file, callback){
    
    if(!file){
        callback("not a valid file", null);
        return;
    }
        sendRequest("M30 " + file, function(err, data){
            if(!err){
                    callback(null, data);
                    return;
            }
            else{
                callback(err, null);
                return;

            }

                    
        });
    };
var stop_printing = function(callback){
    
        sendRequest("M0" , function(err, data){
            if(!err){
                    callback(null, data);
                    return;
            }
            else{
                callback(err, null);
                return;

            }

                    
        });
    };
var sleep_printing = function(callback){
    
        sendRequest("M1" , function(err, data){
            if(!err){
                    callback(null, data);
                    return;
            }
            else{
                callback(err, null);
                return;

            }

                    
        });
    };
var initialize_card = function(callback){
    
        sendRequest("M21" , function(err, data){
            if(!err){
                    callback(null, data);
                    return;
            }
            else{
                callback(err, null);
                return;

            }

                    
        });
    };

exports.sendRequest = sendRequest;
exports.get_sd_filelist = get_sd_filelist;
exports.get_temperature = get_temperature;
exports.get_print_status = get_print_status;
exports.delete_file_from_sd = delete_file_from_sd;
exports.select_file_for_printing = select_file_for_printing;
exports.initialize_card = initialize_card;
exports.pause_print = pause_print;
exports.start_print = start_print;








