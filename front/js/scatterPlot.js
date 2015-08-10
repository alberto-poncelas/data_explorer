
/*
Input json:
{
  'x':[5, 12, 15, 20],
  'y':[3, 17, 5, 2]
}
*/
function scatter(json){

  var xdata=json['x']
  var ydata=json['y']

  // x and y scales, I've used linear here but there are other options
  // the scales translate data values to pixel values for you
  var x = d3.scale.linear()
            .domain([0, d3.max(xdata)])  // the range of the values to plot
            .range([ 0, width ]);        // the pixel range of the x-axis

  var y = d3.scale.linear()
            .domain([0, d3.max(ydata)])
            .range([ height, 0 ]);

  // the chart object, includes all margins
  var svg = d3.select('body')
  .append('svg:svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'chart')

  svg.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'main')   

  /*
  *
  * DRAW X AXIS
  * 
  */
  var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

  svg.append('g')
  .attr('transform', 'translate('+ margin.left +',' + height + ')')
  .attr('class', 'X axis')
  .call(xAxis);

  
  /*
  *
  * DRAW Y AXIS
  * 
  */
  var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left');

  svg.append('g')
  .attr('transform', 'translate('+ margin.left +',0)')
  .attr('class', 'Y axis')
  .call(yAxis);



  /*
  *
  * DRAW THE GRAPH
  * 
  */
  var g = svg.append("svg:g"); 

  g.selectAll("scatter-dots")
    .data(ydata)  // using the values in the ydata array
    .enter().append("svg:circle")  // new circle for each value
        .attr('transform', 'translate('+ margin.left +',0)')
        .attr("cy", function (d) { return y(d); } ) // translate y value
        .attr("cx", function (d,i) { return x(xdata[i]); } ) // translate x value
        .attr("r", 5) // radius 
        .style("opacity", 0.8); // opacity 

}