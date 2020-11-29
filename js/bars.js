export default function bars(container, data) {

    // eliminate the empty / bad data points (no reviews, no location)

    var new_data = data.filter(function (d) {
        if (d.restaurant_neighborhood !== "NA" && d.restaurant_neighborhood !== "San Francisco" &&
            d.restaurant_neighborhood !== "Hudson" && d.restaurant_neighborhood !== "Hudson" &&
            d.restaurant_neighborhood !== "Pembroke" && d.restaurant_neighborhood !== "North Waltham" && d.review_number !== 0) {
            return d;
        }
    })
    console.log("checking new data: ", new_data)

    new_data.forEach(function(d){
        //console.log("looking at addresses: ", d.restaurant_address.slice(-6))
        var zipcode = d.restaurant_address.slice(-6)
        if (zipcode.includes("02215")){
            d.restaurant_neighborhood = "Kenmore"
        } 
        else if (zipcode.includes("02116")) {
            d.restaurant_neighborhood = "Back Bay"
        }
        else if (zipcode.includes("02111")) {
            d.restaurant_neighborhood = "Chinatown"
        }
        else if (zipcode.includes("02218")) {
            d.restaurant_neighborhood = "South End"
        }
        else if (zipcode.includes("02115")) {
            d.restaurant_neighborhood = "Fenway"
        }
        else if (zipcode.includes("02108")) {
            d.restaurant_neighborhood = "Beacon Hill"
        }
        else if (zipcode.includes("02113")) {
            d.restaurant_neighborhood = "North End"
        }
        else if (zipcode.includes("02110")) {
            d.restaurant_neighborhood = "South Boston"
        }
        else if (zipcode.includes("02129")) {
            d.restaurant_neighborhood = "Charlestown"
        }
        else if (zipcode.includes("02228")) {
            d.restaurant_neighborhood = "East Boston"
        }
        else if (zipcode.includes("02128")) {
            d.restaurant_neighborhood = "East Boston"
        }
        else if (zipcode.includes("02127")) {
            d.restaurant_neighborhood = "South Boston"
        }
    })

    // SVG CONVENTIONS
    const margin = ({ top: 50, right: 50, bottom: 80, left: 50 })
    const width = 1000 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var neighborhood_nums = {}
    new_data.forEach(function(d) {
        //console.log("is this working: ", d)
        if(d.restaurant_neighborhood in neighborhood_nums){
            neighborhood_nums[d.restaurant_neighborhood] += 1
        } else {
            neighborhood_nums[d.restaurant_neighborhood] = 1
        }
    });

    console.log("can we see the number of restaurants in each: ", neighborhood_nums)
    var bars_data = [];
    for (var i = 0; i<Object.keys(neighborhood_nums).length; i++){
        //console.log("iii: ", i)
        var new_dict = {}
        new_dict["neighborhood"] = Object.keys(neighborhood_nums)[i]
        new_dict["rest_num"] = Object.values(neighborhood_nums)[i]
        // new_dict[Object.keys(neighborhood_nums)[i]] = Object.values(neighborhood_nums)[i]
        bars_data.push(new_dict)
    }
    console.log("bars data: ", bars_data)

    
    

    let svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    const xAxis = d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) { 
            if (d.restaurant_neighborhood !== "NA" && d.restaurant_neighborhood !== "San Francisco" && d.restaurant_neighborhood !== "Hudson" &&
                d.restaurant_neighborhood !== "Hudson" && d.restaurant_neighborhood !== "Pembroke" && d.restaurant_neighborhood !== "North Waltham") {
                return d.restaurant_neighborhood
            } 
        }))
        .padding(0.2);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xAxis))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

        // Add Y axis
    const yAxis = d3.scaleLinear()
        .domain([0, d3.max(Object.values(neighborhood_nums))])
        .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(yAxis));

        
        console.log("RIGHT BEFORE BARS")


        
        svg.selectAll(".bar")
            .data(bars_data)
            .enter()
            .append("rect")
            .attr("x", function (d, i) { 
                //console.log("figuring out the bar height: ", d)
                return xAxis(d.neighborhood); 
            })
            .attr("y", function (d) { return yAxis(d.rest_num); })
            .attr("width", xAxis.bandwidth())
            .attr("height", function (d) { return height - yAxis(d.rest_num); })
            .attr("fill", "#69b3a2")
            .on('mouseover', function(e, d){
                d3.select('#bar-tooltip')
                    .attr("opacity", 1)
                    .attr("display", "block")
                    .html(`${d.neighborhood}<br>${d.rest_num}`)
                    .style("left", (e.screenX - 100 + "px"))
                    .style("font-family", "Gill Sans")
                    .style("font-size", "12px")
                    .style("background-color", "white")
                    .style("opacity", 0.9)
                    .style("color", "black")
                    .style("top", (e.screenY - 170 + "px"))


        })
        .on("mouseout", function (e, d) {
            d3.select('#bar-tooltip')
                .html(``)
                .attr("display", "none")
            })
            // .on('mousemove', mousemove)
            // .on('mouseout', mouseout);

        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 8)
            .attr("y", height - 6)
            .text("Restaurant");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -27)
            .attr("x", 25)
            .attr("dy", ".75em")
            .text("Rating");

    //tooltip
    const div = d3.select('.chart4').append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');

    function mouseover() {
        div.style('display', 'block');
    }

    function mousemove() {
        const d = d3.select(this).data()[0]
        div
            .html(d.restaurant_name + '<hr/>' + d.rating);
        // .style('left', (d3.event.pageX - 34) + 'px')
        // .style('top', (d3.event.pageY - 12) + 'px');
    }

    function mouseout() {
        div.style('display', 'none');
    }
    


}