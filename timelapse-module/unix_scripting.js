var exec = require('child_process').exec;

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
        exec("./start.sh start", function (error, stdout, stderr) {
          if (error !== null) {
            callback(error,null,null);
              return;
          }
        callback(null,stdout,stderr)
        });

};

var stopcapturing = function(callback)
{
        exec("./start.sh stop", function (error, stdout, stderr) {
          if (error !== null) {
            callback(error,null,null);
              return;
          }
        callback(null,stdout,stderr)
        });

};
