//vis for comparing ratings of restaurants -- what are the best restaurants

export default function barchart(container, yelp) {
    console.log("!!!!!!!!!!!!HERE!!!!!!!!!!!!!!")

    console.log(yelp)

    const margin = ({ top: 50, right: 50, bottom: 50, left: 50 })
    const width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;



    let svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


   
    
    function makeBarChart(data){
        // X axis
        const xAxis = d3.scaleBand()
            .range([ 0, width ])
            .domain(data.map(function(d) { return d.restaurant_name; }))
            .padding(0.2);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxis))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Add Y axis
        const yAxis = d3.scaleLinear()
            .domain([0, 5.0])
            .range([ height, 0]);

        svg.append("g")
            .call(d3.axisLeft(yAxis));

        //tooltip
        const div = d3.select('.chart4').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');

        function mouseover(){
            div.style('display', 'inline');
        }
        
        function mousemove(){
            const d = d3.select(this).data()[0]
            div
                .html(d.restaurant_name + '<hr/>' + d.rating);
                // .style('left', (d3.event.pageX - 34) + 'px')
                // .style('top', (d3.event.pageY - 12) + 'px');
        }
        
        function mouseout(){
            div.style('display', 'none');
        }
        

        // Bars
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function(d) { return xAxis(d.restaurant_name); })
            .attr("y", function(d) { return yAxis(d.rating); })
            .attr("width", xAxis.bandwidth())
            .attr("height", function(d) { return height - yAxis(d.rating); })
            .attr("fill", "#69b3a2")
            .on('mouseover', mouseover)
            .on('mousemove', mousemove)
            .on('mouseout', mouseout);

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width-8)
            .attr("y", height-6)
            .text("Restaurant");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -27)
            .attr("x", 25)
            .attr("dy", ".75em")
            .text("Rating");
    }
    
    return makeBarChart(yelp);

  

}