$('#tab_panel').ready(function () {

 
		var updateInterval = 3000;

		var time = new Date();
    
        var total_time = 1 * 60 * 1000;
        var length_of_x_axis = total_time / updateInterval;
	
	 


		var dataPoints1 = [];
	
       // dataPoints1 = initialize_array(dataPoints1 ,length_of_x_axis);

		var dataPoints2 = [];
     // dataPoints2 = initialize_array(dataPoints2 ,length_of_x_axis);
		
        var dataPoints3 = [];
       //dataPoints3 = initialize_array(dataPoints3 ,length_of_x_axis);
		
        var dataPoints4 = [];
      // dataPoints4 = initialize_array(dataPoints4 ,length_of_x_axis);
		
        var dataPoints5 = [];
		//dataPoints5 = initialize_array(dataPoints5 ,length_of_x_axis);
        var dataPoints6 = [];
    //  dataPoints6 = initialize_array(dataPoints6 ,length_of_x_axis);
	
		 
    
       /*function initialize_array(dataPoints ,length_of_x_axis){
            
            for(i = 0; i < length_of_x_axis ; i++)
            {
                dataPoints.push({
					x:  time.getTime(),
					y: 0
				});
   
            
            }
            return dataPoints;
        
        };*/
    
        
        	var chart = new CanvasJS.Chart("chartContainer",{
			zoomEnabled: true,
			title: {
				text: "Temperature"		
			},
			toolTip: {
				shared: true
				
			},
			legend: {
				verticalAlign: "top",
				horizontalAlign: "center",
                fontSize: 12,
				fontWeight: "bold",
				fontFamily: "calibri",
				fontColor: "dimGrey"
			},
			axisX: {
				title: "Time --> "
			},
			axisY:{
				includeZero: false
			}, 
			data: [{ 
				// dataSeries1
				type: "line",
				xValueType: "time",
				showInLegend: true,
				name: "HB_Actual",
				dataPoints: dataPoints1
			},
			{				
				// dataSeries250
				type: "line",
				xValueType: "dateTime",
				showInLegend: true,
				name: "HB_Target" ,
				dataPoints: dataPoints2
			},
                   { 
				// dataSeries3
				type: "line",
				xValueType: "dateTime",
				showInLegend: true,
				name: "CH_Actual",
				dataPoints: dataPoints3
			},
                   { 
				// dataSeries4
				type: "line",
				xValueType: "dateTime",
				showInLegend: true,
				name: "CH_Target",
				dataPoints: dataPoints4
			},
                   { 
				// dataSeries550
				type: "line",
				xValueType: "dateTime",
				showInLegend: true,
				name: "NOZ_Actual",
				dataPoints: dataPoints5
			},
                   { 
				// dataSeries6
				type: "line",
				xValueType: "dateTime",
				showInLegend: true,
				name: "NOZ_Target",
				dataPoints: dataPoints6
			},
                  ],
            
          legend:{
            cursor:"pointer",
            itemclick : function(e) {
              if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
              }
              else {
                e.dataSeries.visible = true;
              }
              chart.render();
            }
          }
		});

		var x_value1 = dataPoints1.length + 1;
		var x_value2 = dataPoints2.length + 1;
		var x_value3 = dataPoints3.length + 1;
		var x_value4= dataPoints4.length + 1;
		var x_value5 = dataPoints5.length + 1;
		var x_value6 = dataPoints6.length + 1;
		 
		var updateChart = function () {		
			
            
      
		
				
		$.getJSON( "/instrument/1/get", function( data ) {
					parseFloat(data);	
           // console.log(data);
		
        
            document.getElementById("temp1").innerHTML= data.contextElement.attributes[1].value+"°C/"+data.contextElement.attributes[2].value +"°C";
        document.getElementById("temp2").innerHTML= data.contextElement.attributes[3].value +"°C /"+data.contextElement.attributes[4].value +"°C";
        document.getElementById("temp3").innerHTML= data.contextElement.attributes[5].value+"°C /"+data.contextElement.attributes[6].value +"°C";		
		
            var yValue1 = data.contextElement.attributes[1].value;
		var yValue2 = data.contextElement.attributes[2].value;
        var yValue3 = data.contextElement.attributes[3].value;
        var yValue4 = data.contextElement.attributes[4].value;
        var yValue5 = data.contextElement.attributes[5].value;
        var yValue6 = data.contextElement.attributes[6].value;
					 
				
				// add interval duration to time				
				time.setTime(time.getTime()+updateInterval);



				// adding random value and rounding it to two digits. 
				yValue1 = Math.round(yValue1);
				yValue2 = Math.round(yValue2);
                yValue3 = Math.round(yValue3);
                yValue4 = Math.round(yValue4);
                yValue5 = Math.round(yValue5);
                yValue6 = Math.round(yValue6);
				
            
            
				
				// pushing the new values
				dataPoints1.push({
					x: time.getTime() ,
					y: yValue1
				});
                
			 x_value1++;
			if (dataPoints1.length >(length_of_x_axis))
				
			{
				dataPoints1.shift();
			}
 
		
				
			dataPoints2.push({
					x: time.getTime(),
					y: yValue2
				});
			 
               x_value2++;
			if (dataPoints2.length >(length_of_x_axis))
				
			{
				dataPoints2.shift();
			}
          
			 
                dataPoints3.push({
					x: time.getTime(),
					y: yValue3
				});
			
			x_value3++;
			 
              if (dataPoints3.length >(length_of_x_axis))
				
			{
				dataPoints3.shift();
			}
            
			 
                dataPoints4.push({
					x: time.getTime(),
					y: yValue4
				});
			 x_value4++;
               if (dataPoints4.length >(length_of_x_axis))
				
			{
				dataPoints4.shift();
			}
			 
			
                dataPoints5.push({
					x: time.getTime(),
					y: yValue5
				});
			x_value5++;
			 		
              if (dataPoints5.length >(length_of_x_axis))
				
			{
				dataPoints5.shift();
			}
           
			 
                dataPoints6.push({
					x: time.getTime(),
					y: yValue6
				});
			x_value6++;
			 
				if (dataPoints6.length >(length_of_x_axis))
				
			{
				dataPoints6.shift();
			}
			 
			
        }); 
			
                 
 
               chart.render();       

			// updating legend text with  updated with y Value 
			/*chart.options.data[0].legendText = " Actual  " + yValue1;
			chart.options.data[1].legendText = " Target  " + yValue2; */

			//chart.render();

		};
   

		// generates first set of dataPoints 
		updateChart();
		//chart.render();
		 
		// update chart after specified interval 
		setInterval(function(){updateChart();},updateInterval);
    
   
		 
});