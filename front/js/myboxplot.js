

function createBoxplot(json,options){

	//options
	var jsonOptions=options || {}
	var title=jsonOptions.title || ''
	var xAxisName=jsonOptions.xAxisName  || ''
	var yAxisName=jsonOptions.yAxisName || ''

	//json (with data)
	var minBoxplot = json.min
	var quart1 = json.q1
	var median = json.median
	var quart3 = json.q3
	var maxBoxplot = json.max

	//scale (y axis)
	var max=maxBoxplot+maxBoxplot*0.1
	var min=minBoxplot-Math.abs(minBoxplot)*0.5

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("class", "box")    
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");




	/*
	*
	*	DRAW X AXIS
	*	
	*/
	var x = d3.scale.ordinal()	   
		.rangeRoundBands([0 , width], 0.7, 0.3); 

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height  + margin.top + 10) + ")")
      .call(xAxis)
	  .append("text")             // text label for the x axis
        .attr("x", (width / 2) )
        .attr("y",  10 )
		.attr("dy", ".71em")
        .style("text-anchor", "middle")
		.style("font-size", "16px") 
        .text(xAxisName); 



	/*
	*
	*	DRAW Y AXIS
	*	
	*/

	var yScale = d3.scale.linear()
		.domain([min, max]) //position in graph
		.range([height + margin.top, 0 + margin.top]); //position in screen

	var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");


	svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
		.append("text") // and text1
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .style("font-size", "16px") 
		  .text(yAxisName);	



	/*
	*
	*	DRAW BOXPLOT
	*	
	*/
	var xpos = width/2
	var boxWidth= 50


	var boxHeight=Math.abs( yScale(quart1)-yScale(quart3) )

	//draw box
	var rectangle = svg.append("rect")
		.attr("x", xpos-boxWidth/2)
		.attr("y", yScale(quart3) )
		.attr("width", boxWidth)
		.attr("height", boxHeight );

	//draw vertical line
	var line = svg.append("line")
		.attr("x1", xpos )
		.attr("y1", yScale(minBoxplot) )
		.attr("x2", xpos )
		.attr("y2", yScale(maxBoxplot) );


	//draw median line
	var minLine = svg.append("line")
		.attr("x1", xpos-boxWidth/2 )
		.attr("y1", yScale(median) )
		.attr("x2", xpos+boxWidth/2 )
		.attr("y2", yScale(median) );



	//draw min line
	var minLine = svg.append("line")
		.attr("x1", xpos-boxWidth/2 )
		.attr("y1", yScale(minBoxplot) )
		.attr("x2", xpos+boxWidth/2 )
		.attr("y2", yScale(minBoxplot) );


	//draw max line
	var minLine = svg.append("line")
		.attr("x1", xpos-boxWidth/2 )
		.attr("y1", yScale(maxBoxplot) )
		.attr("x2", xpos+boxWidth/2 )
		.attr("y2", yScale(maxBoxplot) );




	addTitle(svg,title);


}

function addTitle(theSVG,title){
		// add a title
	theSVG.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 + (margin.top / 2))
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        //.style("text-decoration", "underline")  
        .text(title);
}

