var express = require('express');
var app = express();
var request = require("request");
var server = require('http').Server(app);
var config = require('./config.js');
var exec = require('child_process').exec;
var io = require('socket.io')(server);
    fs = require('fs'),
    util = require('util'),
    Files = {};
var serial = require('./serial');

server.listen(3200);
app.use(express.static(__dirname + '/public'));

var printpath = function(callback)
{
        exec("pwd", function (error, stdout, stderr) {
          if (error !== null) {
            callback(error,null,null);
              return;
          }
        callback(null,stdout,stderr)
        });

};


printpath(function(error, stdout, stderr){

console.log('stdout: ' + stdout);
console.log('stderr: ' + stderr);
console.log('err: ' + error);
});

var startcapturing = function(callback)
{
        console.log("Inside start capturing method");
        exec("./start.sh start > /dev/null 2>&1 &", function (error, stdout, stderr) {
          if (error !== null) {
            callback(error,null);
              return;
          }
        callback(null,stdout)
        });

};

var stopcapturing = function(callback)
{
        console.log("Inside stop capturing method");
        exec("./start.sh stop > /dev/null 2>&1 &", function (error, stdout, stderr) {
          if (error !== null) {
            callback(error,null);
              return;
          }
        callback(null,stdout)
        });

};

var makevideo = function(callback)
{   
        console.log("Inside Makevideo capturing method");
        exec("./makevideo.sh " + config.video.user + ' ' + config.video.hostname + ' ' + config.video.path + " > /dev/null 2>&1 &" , function (error, stdout, stderr) {
          if (error !== null) {
              return;
          }
        });

};


app.get('/startscript', function(req, res) {
    
      startcapturing(function(err, result)
     {
      if(err!==null)
        {
          res.send("Starting Script" + result);    
        }
          else
          {
          res.send("Error:" + err);
          }
      
        });           
    });


app.get('/stopscript', function(req, res) {
    
      stopcapturing(function(err, result)
     {
      if(err!==null)
        {
          res.send("Stopping Script" + result);    
        }
          else
          {
          res.send("Error:" + err);
          }
        
        });
    console.log("Script stopped");
    makevideo();
    });

/*****************************
*
*Monitoring serial
*******************************/


setInterval(monitoring, 2000);

function monitoring(){
    
    console.log("monitoring");
    
    serial.get_temperature(function(err, data){
        if(err)
            return;
        
        
        var heatbed_temperature_actual = data[1];
        var heatbed_temperature_target = data[2];
        var chamber_temperature_actual = data[3];
        var chamber_temperature_target = data[4]
        
        updateTemperature('heatbed_temperature_actual', heatbed_temperature_actual);
        updateTemperature('heatbed_temperature_target', heatbed_temperature_target);
        updateTemperature('chamber_temperature_actual', chamber_temperature_actual);
        updateTemperature('chamber_temperature_target', chamber_temperature_target);
        
        
        

    });
    
  
    //console.log("monitoring");
};
/*************************************/

function addInstument(){

    var url = "http://" + config.main_server_app.host + ':' + config.main_server_app.port ;
    var path = '/instrument/' + config.main_server_app.id + '/' + 'add';

    request.get({url: url + path, 
                qs: {value: 20}},
                function(error, response, body){
                   console.log(body);
                });

};
addInstument();
function updateTemperature(type, value){
    var url = "http://" + config.main_server_app.host + ':' + config.main_server_app.port ;
    var path = '/instrument/' + config.main_server_app.id + '/' + 'update' + '/' + type;

    request.get({url: url + path, 
                qs: {value: value}},
                function(error, response, body){
                   //console.log(body);
                });

};
/*************************************/
app.get('/get_sd_filelist', function (req, res) {
    
    serial.get_sd_filelist(function(err, data){

        console.log(data);
        console.log(err);
        res.send(data);

    });


});

app.get('/get_print_status', function (req, res) {
    
    serial.get_print_status(function(err, data){

        console.log(data);
        console.log(err);
        res.send(data);

    });


});

app.get('/get_temperature', function (req, res) {
    
    serial.get_temperature(function(err, data){

        console.log(data);
        console.log(err);
        res.send(data);

    });


});



/*****************************
*
*End
*******************************/

io.on('connection', function (socket) {
    var apath = 'public/Data/'; 
    var rpath = 'Data/'; 
  
    /// serial connections /*********************************************************************/
    socket.emit('information', { hello: 'somme message' });
  
    socket.on('command write', function (req) {
        serial.sendRequest(req.command ,function(err, result){
            console.log("err" + err);
            if(!err){
            console.log("data" + JSON.stringify(result));
            io.emit('command read', {status : "recieved", reply : JSON.stringify(result), command : req.command }); 
            }
            else{
            console.log("data" + JSON.stringify(result));
            io.emit('command read', {status : "recieved",  command : req.command, error : err }); 
            }

        
        });
        
  
    });
    
    socket.on('select sdfile', function (req) {
        
        serial.select_file_for_printing(req.file ,function(err, result){
            console.log("err" + err);
            if(!err){
                console.log("data" + JSON.stringify(result));
                io.emit('print onstatus', {status : "recieved", reply : "file selected" , file : req.file }); 
            }
            else
            {
                console.log("data" + JSON.stringify(result));
                io.emit('print onstatus', {status : "recieved", error : err }); 
            }

        
        });
        
  
    });
    
    socket.on('start print', function () {
        serial.start_print(function(err, result){
            console.log("err" + err);
            if(!err){
                console.log("data" + JSON.stringify(result));
                io.emit('print onstatus', {status : "recieved", reply : "Printer started"}); 
            }
            else{
                console.log("data" + JSON.stringify(result));
                io.emit('print onstatus', {status : "recieved",   error : err }); 
            }

        
        });
        
  
    });

    socket.on('pause print', function () {
        serial.pause_print(function(err, result){
            console.log("err" + err);
            if(!err){
            console.log("data" + JSON.stringify(result));
            io.emit('print onstatus', {status : "recieved", reply : "Printer paused" }); 
            }
            else{
            console.log("data" + JSON.stringify(result));
            io.emit('print onstatus', {status : "recieved",  error : err }); 
            }

        
        });
        
  
    }); 
     socket.on('stop print', function () {
        serial.start_print(function(err, result){
            console.log("err" + err);
            if(!err){
            console.log("data" + JSON.stringify(result));
            io.emit('print onstatus', {status : "recieved", reply : "Printer stopped"}); 
            }
            else{
            console.log("data" + JSON.stringify(result));
            io.emit('print onstatus', {status : "recieved",   error : err }); 
            }

        
        });
        
  
    });   
    socket.on('print status', function () {
        serial.pause_print(function(err, result){
            console.log("err" + err);
            if(!err){
            console.log("data" + JSON.stringify(result));
            io.emit('print onstatus', {status : "recieved", reply : JSON.stringify(result) }); 
            }
            else{
            console.log("data" + JSON.stringify(result));
            io.emit('print onstatus', {status : "recieved",   error : err }); 
            }

        
        });
        
  
    });
    
    socket.on('get_sd_filelist', function () {
        console.log("reciveed");
        serial.get_sd_filelist(function(err, result){
            //console.log("err" + err);
            if(!err){
            console.log("data" + JSON.stringify(result));
            io.emit('got_sd_file_list', {status : "recieved", reply : result}); 
            }
            else{
            console.log("data" + JSON.stringify(result));
            io.emit('got_sd_filelist', {status : "recieved",   error : err }); 
            }

        
        });
        
  
    }); 
    // File transfer sockets /*********************************************************************/
    
  	socket.on('Start', function (data) { //data contains the variables that we passed through in the html file
			var Name = data['Name'];
            console.log(data);
			Files[Name] = {  //Create a new Entry in The Files Variable
				FileSize : data['Size'],
				Data	 : "",
				Downloaded : 0
			}
			var Place = 0;
			try{
				var Stat = fs.statSync('Temp/' +  Name);
				if(Stat.isFile())
				{
					Files[Name]['Downloaded'] = Stat.size;
					Place = Stat.size / 524288;
				}
			}
	  		catch(er){} //It's a New File
			fs.open("Temp/" + Name, 'a', 0755, function(err, fd){
				if(err)
				{
					console.log(err);
				}
				else
				{
					Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
					socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
				}
			});
	});

    
    // File transfer sockets /*********************************************************************/
    
  	socket.on('getfilelist', function () { 
        // your directory

        var files = fs.readdirSync(apath);
        console.log(files);
        socket.emit('filelist', { 'files' : files,
                                 'apath' : apath,
                                 'rpath' : rpath
        });
	});
    
    socket.on('delete file', function (data) { 
        console.log("deleting files");
        //var dir = 'public/Data/'; // your directory
        exec("rm -f " + '"' + data.apath + data.file + '"', function(err){
            if(!err)
                socket.emit('file deleted', {'file' : data.file });
            else
                socket.emit('file deleted', {'error' : "failed" });
        });
	});
    
	socket.on('Upload', function (data){
			var Name = data['Name'];
			Files[Name]['Downloaded'] += data['Data'].length;
			Files[Name]['Data'] += data['Data'];
			if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
			{
	
                fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                    var input = fs.createReadStream("Temp/" + Name);
                    var output = fs.createWriteStream(apath + Name);

                    //util.pump(readableStream, writableStream, [callback])
                    //Deprecated: Use readableStream.pipe(writableStream)
                    input.pipe(output);
                    input.on("end", function() {
                        console.log("end");
                        fs.unlink("Temp/" + Name, function ()
                        { //This Deletes The Temporary File
                            //avconv -i touch_issue.mp4  -vframes 1 -ss 00:00:03   -f image2 imgtest.png 
							//exec("avconv -i public/Data/" + Name  + " -ss 00:05 -r 1 -an -vframes 1 -f  image2 public/Data/" + Name  + ".jpg", function(err){
								socket.emit('Done', {'File' : apath + Name});
							//});
                        });
                    });
                });
			}
			else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
				fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
					Files[Name]['Data'] = ""; //Reset The Buffer
					var Place = Files[Name]['Downloaded'] / 524288;
					var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
					socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
				});
			}
			else
			{
				var Place = Files[Name]['Downloaded'] / 524288;
				var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
				socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
			}
		});
    
    //Live Streaming Recording Sockets /***********************************************************/
    
        socket.on('startrecording', function (err,result) { 
            console.log("Raspberry Recording started");
           startcapturing(function(err, result)
             {

                  socket.emit('recording started', {'message' : "success" } );  
         


            }); 
	   });
    
        socket.on('stoprecording', function (err,result) { 
            console.log("Raspberry Recording stopped");
   
           stopcapturing(function(err, result)
            {

                socket.emit('recording stopped', {'message' : "success" } );    

                makevideo();
            
        
        }); 
            
           
	});

    

});
