import bubble from './bubble.js';

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
    var rate = {}

    new_data.forEach(function(d) {
        //console.log("is this working: ", d)
        if(d.restaurant_neighborhood in neighborhood_nums){
            neighborhood_nums[d.restaurant_neighborhood] += 1;
            rate[d.restaurant_neighborhood] += d.rating;
        } else {
            neighborhood_nums[d.restaurant_neighborhood] = 1
            rate[d.restaurant_neighborhood] = d.rating;
        }
    });

    //console.log("can we see the number of restaurants in each: ", neighborhood_nums)
    var bars_data = [];
    for (var i = 0; i<Object.keys(neighborhood_nums).length; i++){
        //console.log("iii: ", i)
        var new_dict = {}
        new_dict["neighborhood"] = Object.keys(neighborhood_nums)[i]
        new_dict["rest_num"] = Object.values(neighborhood_nums)[i]
        new_dict["avg_rating"] = Object.values(rate)[i]/Object.values(neighborhood_nums)[i]
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
        .domain((bars_data.map(function(d){
            return d.neighborhood
        })).sort())
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

        
        //console.log("RIGHT BEFORE BARS")

    const circles = svg.selectAll('.bars')
        .data(bars_data)

    

    circles.exit()
        .remove()


    circles.enter()
        .append("circle")
        .attr("cx", function (d,i) { return xAxis(d.neighborhood); } )
        .attr("cy", function (d,i) { return yAxis(d.rest_num); } )
        .attr("r", function (d,i) { 
            if (d.avg_rating >3.75){
                return 20;
            }
            else if (d.avg_rating > 3.5){
                  return 10;
            }
            else{
                  return 3;
            }
        })
        //   .attr("r", 5)
        .style("fill", "pink")
        .style("opacity", "0.7")
        .attr("stroke", "black")
        
        
            
        d3.selectAll("circle").on('mouseover', function(e, d){
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
                    .classed("hidden", false)

        })
        .on("mouseout", function (e, d) {
            d3.select('#bar-tooltip')
                .html(``)
                .classed("hidden", true)
            })
        .on("click", function (e, d) {
            console.log("checking if this click works: ", e, " ", d)
            d3.select("svg")
                .attr("class", "hidden")
                .transition()
                .duration(2000)
            d3.select("svg")
                .remove()
            
            
            var bubble_data = new_data.filter(function(b){
                if (b.restaurant_neighborhood == d.neighborhood) {
                    //console.log(b.restaurant_neighborhood)
                    //console.log(d.neighborhood)
                    return b
                }
            })
            console.log("checking on the data being passed into the bubble function: ", bubble_data)
            const neighborhoodChart = bubble("#bubble-chart", bubble_data);
            
    })
            

        svg.append("div")
            .attr("class", "x label")
            .append("text")
            .attr("text-anchor", "end")
            .attr("x", width - 8)
            .attr("y", height - 6)
            .text("Restaurant");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -37)
            .attr("x", 125)
            .attr("dy", ".75em")
            .text("Number of Restaurants");

    

    
    


}