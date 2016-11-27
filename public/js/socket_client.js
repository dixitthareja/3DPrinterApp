(function(){
    
       
			var host = ipaddress;
			var port = raspberryport;
            var url = 'http://' + host + ':' + port;
            var SelectedFile;
			var FReader;
			var Name;
            
            var create_filelist_area = function (dom)
            {
                html = '<div class="row">\
                            <div class="col-sm-4">\
                                <div class="panel panel-info ts-file-panel" id="UploadBox">\
                                    <div class="panel-heading"> \
                                        <h3 class="panel-title">File List</h3>\
                                    </div>\
                                    <div class="panel-body" id="FileListAres">\
                                        <table id="uplaoded-filelist" class="table table-striped"><thead></thead><tbody></tbody></table>\
                                     </div> \
                                </div>  \
                            </div>\
                        </div> <!--Bootstrap Panel Markup :end --> ';
                $(dom).append(html); 
            };
            var create_upload_html = function (dom)
            {
                html = '<div class="row">\
                            <div class="col-sm-12">\
                                <div id="UploadBox">\
                                    <div> \
                                    </div>\
                                    <div  id="UploadArea">\
                                     </div> \
                                </div>  \
                            </div>\
                        </div> <!--Bootstrap Panel Markup :end --> ';
                $(dom).append(html);
            
            
            };
    
            
           
            var create_upload_area = function ()
            {
                var html = '<input type="file" id="FileBox" placeholder="Browse File.">\
                        <input type="text" id="NameBox">\
                        <button type="button"  id="UploadButton" class="btn btn-info">Upload</button>';
               
                
                if(window.File && window.FileReader){ //These are the necessary HTML5 objects the we are going to use 
                    $("#UploadArea").html(html);                    
                    $("#UploadButton").click(function(e){
                        //e.preventDefault();
                        StartUpload();
                    });
                    
                    $("#FileBox").change(function(e){
                        
                        SelectedFile = this.files[0];
                        $('#NameBox').val(SelectedFile.name);
                        //e.preventDefault();
                        //FileChosen(e);
                    });
                    
                
                    //document.getElementById('UploadButton').addEventListener('click', StartUpload);  
                    //document.getElementById('FileBox').addEventListener('change', FileChosen);
                }
                else
                {
                    $('#UploadArea').html( "Your Browser Doesn't Support The File API Please Update Your Browser");
                }
                
    
            
            
            };
            
            create_upload_html("#raspberryupload");
            create_upload_area();
            //create_filelist_area("#raspberryupload");
    
            $("#print").click(function(e){
            //e.preventDefault();
                var filename = $('form input[name=checkbox-sdfilelist-data]:checked').val();
                if(filename !== undefined)
                {
                    console.log($('form input[name=checkbox-sdfilelist-data]:checked').val());
                    startrecording();
                    socket.emit('start print');
                    $(this).attr("disabled", "disabled");
                    
                }
                else{
                    alert('no file selected');
                }
                
                //
            });
    
            
            $("#cancel").click(function(e){
                //e.preventDefault();
                stoprecording();
            });
            
    
            var socket = io.connect( url );
               
   
            //**************Socket start recording**********************************//
            $('#snapshotimage').hide();
            setInterval(function(){
                
                $('#snapshotimage').html('<img src="' + url + '/snapshot/snapshot.jpg?v=' +  new Date().getTime() +'">');

            },5000);
    
            function startrecording(){
                stop();
                $('#remote-video').hide();
                 $('#snapshotimage').html("");
                $('#snapshotimage').show();
                socket.emit('startrecording');

            }
            
           function stoprecording(){
               
            socket.emit('stoprecording');
               $('#snapshotimage').html("");
            }
            
            
            
            
            socket.on('recording started',function(){
                console.log("Recording started");
                show_alert($("#Uploadmessage"), "Recording started" , "success");
            });
    
            socket.on('recording stopped',function(){
                console.log("Recording stopped");
                show_alert($("#Uploadmessage"), "Recording stopped. Saving vedio. It will take some time. Please be patient." , "success");
                start();
                $('#remote-video').show();
                 $('#snapshotimage').html("");
                $('#snapshotimage').hide();
            });
    
            socket.on("connect", function(){
                socket.emit("getfilelist");
            
            });

            function StartUpload(){
				if(document.getElementById('FileBox').value != ""){
					FReader = new FileReader();
                    
                    Name = document.getElementById('NameBox').value;
                    var progress_html = '<div class="progress">\
                                          <div id="upload-progress-bar" class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" >\
                                            100% Complete (success)\
                                          </div>\
                                        </div>';
                     //progress_html += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
                     progress_html +="<span id='NameArea'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
					
					//var Content = "<span id='NameArea'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
					//Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">50%</span>';
					//Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
					document.getElementById('UploadArea').innerHTML = progress_html;
					FReader.onload = function(evnt){
						socket.emit('Upload', { 'Name' : Name, Data : evnt.target.result });
					}
					socket.emit('Start', { 'Name' : Name, 'Size' : SelectedFile.size });
				}
				else
				{
					alert("Please Select A File");
				}
			}
    
        			socket.on('MoreData', function (data){
                //console.log(data);
				UpdateBar(data['Percent']);
				var Place = data['Place'] * 524288; //The Next Blocks Starting Position
				var NewFile; //The Variable that will hold the new Block of Data
				if(SelectedFile.slice) 
					NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
				else
					NewFile = SelectedFile.mozSlice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
				FReader.readAsBinaryString(NewFile);
			});
    
			socket.on('filelist', function (data){
                console.log(data);
                create_filelist(data, "uplaoded-filelist");
                
			});
    
            socket.on('Done', function (data){
				//var Content = "Video Successfully Uploaded !!"
                create_upload_area();
                show_alert($("#Uploadmessage"), "Successfully Uploaded!" , "success");
                socket.emit("getfilelist");
                

			});
    
            socket.on('file deleted', function (data) { 
                console.log(data);
                 socket.emit("getfilelist");
    
            });

			function UpdateBar(percent){
                //console.log(percent);
                percent = (Math.round(percent*100)/100);
                $('#upload-progress-bar').css('width', percent +'%').attr('aria-valuenow', percent).text(percent +'%');
   
			}
    
            
            var create_filelist = function (e, id)
            {
                $("#" + id + " thead").html('');
                $("#" + id + " tbody").html('');
                console.log(e.files.length);
                
                if (e === 0 || e.files.length === 0) {
                    //alert('no data found');
                    //message("#responseCell_callibration", LANG.messages.error.three, 1);

                } else {
                    //preparing head fot the table				
                    var thead = '<tr >';
                    thead = thead +  '<td ><input id = "checkbox-files-data" name = "checkbox-filelist-data"   type="checkbox"></td >';
                    thead = thead +  '<th >Filename</th >';
                    thead = thead + '</tr >';

                    //$("#uplaoded-filelist thead").html(thead);
                    var tbody = '';
                    var apath = e.apath;
                    var rpath = e.rpath;
                    $.each(e.files, function (index0, value0) {


                        tbody =  '<tr >';
    
                                //tbody += '<td ><input class = "check-list" name = "checkbox-filelist-data" id="' + value0 + '" type="checkbox" value="' + value0 + '"></td >';
                        tbody +=   '<td >' + value0 + '</td >';
                        tbody += '<td ><button class="btn btn-info filelist-delete"  id="' + value0 + '" type="button" value="' + value0 + '">Delete</button></td >';
                        tbody += '<td ><a href="' + url + '/' + rpath + value0 +'" download><button class="btn btn-info filelist"  id="' + value0 + '" type="button" value="' + value0 + '">Download</button></a></td >';
                        tbody += '</tr >';
                        $("#" + id + " tbody").append(tbody);

                    });
                    
                    
                    $(".filelist-delete").click(function(e){
                        e.preventDefault();
                        console.log($(this).val());
                        socket.emit("delete file", {'file' : $(this).val(), 'apath' : apath });
                    
                    });
                    
                    
                }
                
            };
			
             var create_sdfilelist = function (e, id)
            {
                
                $("#" + id + " thead").html('');
                $("#" + id + " tbody").html('');
                //console.log(e.files.length);
                
                if (e === 0 || e.reply.length === 0) {
                    //alert('no data found');
                    //message("#responseCell_callibration", LANG.messages.error.three, 1);

                } else {
                    //preparing head fot the table				
                    var thead = '<tr >';
                    thead = thead +  '<th ><input id = "checkbox-files-data" name = "checkbox-filelist-data"   type="checkbox"></th >';
                    thead = thead +  '<th >Filename</th >';
                    thead = thead + '</tr >';

                    //$("#uplaoded-filelist thead").html(thead);
                    var tbody = '';
                    //var apath = e.apath;
                    //var rpath = e.rpath;
                    $.each(e.reply, function (index0, value0) {
                        console.log(value0);
                        
                        if(value0.indexOf("GCO") !== -1){


                            tbody =  '<tr >';

                                    //tbody += '<td ><input class = "check-list" name = "checkbox-filelist-data" id="' + value0 + '" type="checkbox" value="' + value0 + '"></td >';
                            tbody +=  '<td><input id = "checkbox-files-data" name = "checkbox-sdfilelist-data"  class = "checkbox-sdfilelist-data" value ="'+ value0 +'" type="radio"></td>';
                            tbody +=   '<td >' + value0 + '</td >';
                            //tbody += '<td ><button class="btn btn-info filelist-delete"  id="' + value0 + '" type="button" value="' + value0 + '">Delete</button></td >';
                            //tbody += '<td ><a href="' + url + '/' + rpath + value0 +'" download><button class="btn btn-info filelist"  id="' + value0 + '" type="button" value="' + value0 + '">Download</button></a></td >';
                            tbody += '</tr >';
                            $("#" + id + " tbody").append(tbody);
                        }
                        

            

                    });
                          $('.checkbox-sdfilelist-data').click(function(){
                              if($(this).val()){
                                  socket.emit("select sdfile", {'file' : $(this).val()});
                                  alert($(this).val() + "is selected for printing");
                              }
            
                         });
                    
                    
                    $(".filelist-delete").click(function(e){
                        e.preventDefault();
                        console.log($(this).val());
                        socket.emit("delete file", {'file' : $(this).val(), 'apath' : apath });
                    
                    });
                    
                    
                }
                
            };               
    
    
            var show_alert = function(alert_box, message, type) {
            var html = '<div id="message"><div class="alert alert-' + type + ' alert-dismissible" role="alert">\
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                            <p id="p-response"> ' + message + '</p>\
                        </div></div>';
            alert_box.html(html);
            alert_box.fadeIn('slow').delay(5000).fadeOut("slow");

                


            };
    
    /************************
    
    $('body').append(create_console_box());
    var message_box = $("#" + "div-console-box");
    var alert_box = $("#" + "div-alert");
    var send_command = $("#" + 'btn-send-command');
    var input_command = $("#" + 'input-command');
    
    
    
     
    
    socket.on('global', function (data) {
        send_command.removeClass("disabled");
        console.log(data);
    });
    
    socket.on('disconnect', function (error) {
         send_command.addClass("disabled");
        show_alert(alert_box, "Disconneted!", "danger");
        //socket.close();
    });
    socket.on('connect', function (error) {
         send_command.removeClass("disabled");
        show_alert(alert_box, "Connected!" , "success");
        //socket.close();
    });   
    socket.on('command read', function (data) {
        console.log(data);
         send_command.removeClass("disabled");
        input_command.val('');
        if(!data.error){
            message_append( message_box, data.command, data.reply);
            show_alert(alert_box, "Answer recieved!" , "success");
        }
        else{
           show_alert(alert_box, data.error , "danger");
        }
    });

    
    send_command.click(function(e){
        
        e.preventDefault();
        var command = input_command.val();
         if(command.length > 0){
             send_command.addClass("disabled");
            show_alert(alert_box, "Waiting for answer " + command + "..." , "info"); 
            socket.emit("command write", { command : command});
             input_command.val('');
        }
        
        
    
    });
    
    input_command.keypress(function( e ) {
        if ( event.which == 13 ) {
            e.preventDefault();
            
            var command = input_command.val();
            if(command.length > 0){
                send_command.addClass("disabled");
                show_alert(alert_box, "Waiting for answer " + command + "..." , "info"); 
                socket.emit("command write", { command : command});
                input_command.val('');
            }
            
            
        }
        
    });
    
    
    
    ***************/
    $("#sd_filelist_tab").click(function(){
        console.log("#sd_filelist_tab clicked");
        socket.emit("get_sd_filelist");
    
    
    });
    socket.on('got_sd_file_list', function (data) { 
        console.log(data);
        create_sdfilelist(data, 'uplaoded-sdfilelist');


    });
    
    socket.on('print onstatus', function (data) { 
        console.log(data);
        if(!data.error)
        {
            show_alert($("#Uploadmessage"),  data.reply , "success");
        }
        else
        {
           show_alert($("#Uploadmessage"), data.error , "danger");
        }

    });


})();