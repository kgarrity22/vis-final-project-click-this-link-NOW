import lineChart from './line.js';
import bars from './bars.js'

export default function bubble(container, data, chart_data) {
    console.log("data entered into bubble: ", data)

    d3.selectAll(container)
        .attr("class", "visible")

    
    
    
    var neighborhoods = [];
    
    for (var i of data){
        if (neighborhoods.indexOf(i.restaurant_neighborhood) == -1) {
            neighborhoods.push(i.restaurant_neighborhood)
        }
    }
    

    const margin = ({ top: 50, right: 40, bottom: 50, left: 20 })
    const width = 1200 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    
    var neighborhood0 = [];
    var neighborhood2 = [];
    data.forEach(function (d) {
        d.r = d.rating**1.5 + 1;
        d.x = width / 2;
        d.y = height / 2;
        var cuisines = d.restaurant_tag.split(",")
        //console.log("cuisines: ", cuisines);
        d.cuisines = cuisines[0]

        if (d.review_number <= 100){
            d.rev_bin = "0-100";
        } else if (d.review_number <= 200){
            d.rev_bin = "101-200"
        } else if (d.review_number <= 300) {
            d.rev_bin = "201-300"
        } else if (d.review_number <= 400) {
            d.rev_bin = "301-400"
        } else if (d.review_number <= 500) {
            d.rev_bin = "401-500"
        } else {
            d.rev_bin = "> 500"
        }

        if (d.price == "$ ") {
            d.price_level = 1;
        } else if (d.price == "$$ "){
            d.price_level = 2
        } else if (d.price == "$$$ ") {
            d.price_level = 3
        } else if (d.price == "$$$$ ") {
            d.price_level = 4;
        } else if (d.price == "NA") {
            d.price_level = 0
        }

    })
    
    
    
    var centerScale = d3.scalePoint().padding(1).range([0, width]);
    var forceStrength = 0.1;

    
    let svg = d3.selectAll(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var color = d3.scaleSequential().domain([0, 3000])
        .interpolator(d3.interpolateYlGnBu);

    var simulation = d3.forceSimulation()
        .force("collide", d3.forceCollide(function (d) {
            return d.r
        }).iterations(16)
        )
        .force("charge", d3.forceManyBody())
        .force("y", d3.forceY().y(height / 2))
        .force("x", d3.forceX().x(width / 2))

    
    var circles = svg.selectAll("circle")
        .data(data, function (d) { return d; })
    
        
    var circlesEnter = circles.enter().append("circle")
        .attr("r", function (d, i) { return d.r })
        .attr("cx", function (d, i) { return 175 + 25 * i + 2 * i ** 2; })
        .attr("cy", function (d, i) { return 250; })
        .style("fill", function (d, i) { return color(d.review_number); })
        .style("stroke", "black")
        .style("stroke-width", 2)
        .style("pointer-events", "all")
        

    circles = circles.merge(circlesEnter)

    circles.on("mouseover", function (e, d) {
        
        d3.select('#bubble-tooltip')
            .attr("opacity", 1)
            .attr("display", "block")
            .html(`Name: <strong>${d.restaurant_name}</strong><br>Rating: <strong>${d.rating}</strong><br>Number of Reviews: <strong>${d.review_number}</strong><br>Cuisine Type: <strong>${d.cuisines}</strong>`)
            .style("font-family", "Gill Sans")
            .style("font-size", "12px")
            .style("background-color", "white")
            .style("opacity", 1)
            .style("color", "black")
            .style("top", ((e.y + 5) + "px"))
            .style("left", ((e.x + 10) + "px"))
            .classed("hidden", false)

        })
        .on("mouseout", function (e, d) {
            d3.select('#bubble-tooltip')
                .html(``)
                .classed("hidden", true)
                
        })


    function ticked() {

        circles
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }

    simulation
        .nodes(data)
        .on("tick", ticked);

 
    function groupBubbles() {
        hideTitles();

        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(w / 2));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    }

    function splitBubbles(byVar) {
        
        if (byVar == "price"){
            data.sort(function(a, b){
                return a.price_level - b.price_level
            })
            centerScale.domain((data.map(function (d) { return d[byVar]; })))

        
        } else if (byVar == "rev_bin") {
            data.sort(function(a, b){
                return a.rev_bin - b.rev_bin;
            })
            centerScale.domain((data.map(function (d) { return d[byVar]; })))
            console.log("DOMAIN: ", centerScale.domain())
            centerScale.domain(centerScale.domain().sort())

        } else if (byVar == "rating"){
            data.sort(function(a, b){
                return a.rating - b.rating
            })
            centerScale.domain((data.map(function (d) { return d[byVar]; })))
        } else {
            centerScale.domain(data.map(function (d) { return d[byVar]; }));
            
            
        }
        // console.log("center scale: ", centerScale)
        console.log("center domain : ", centerScale.domain().sort())

        

        if (byVar == "all") {
            hideTitles()
        } else {
            showTitles(byVar, centerScale);
        }
        

        // @v4 Reset the 'x' force to draw the bubbles to their year centers
        simulation.force('x', d3.forceX().strength(forceStrength).x(function (d) {
            //console.log("X in force is: ", d)
            //console.log("checking order: ", centerScale(d[byVar]))
            return centerScale(d[byVar]);
        }));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(2).restart();
    }

    function hideTitles() {
        svg.selectAll('.title').remove();
    }

    function showTitles(byVar, scale) {
        // Another way to do this would be to create
        // the year texts once and then just hide them.
        //console.log("TITLES: ", scale.domain())

        var titles = svg.selectAll('.title')
            .data(scale.domain());

        titles.enter().append('text')
            .attr('class', 'title')
            .merge(titles)
            .attr('x', function (d, i) { return scale(d)*1.25 - 170})
            .attr('y', 100)
            .attr('text-anchor', 'start')
            .text(function (d) { 
                console.log("the text item: ", d)
                if (typeof(d) == "string"){
                    if (d.includes("00")) {
                        return d + " Reviews";
                    } else if (d.includes("$") || d.includes("NA")) {
                        return "Price Category: " + d;
                    } else if (d == "TRUE") {
                        return "Closed Restaurants"
                    } else if (d == "FALSE") {
                        return "Open Restaurants";
                    }
                }
                 else if (d<10){
                    return "Rating: " + d;
                } else {
                    return d; 
                }
                
            });

        titles.exit().remove()
    }

    function setupButtons() {
        d3.selectAll('.button')
            .on('click', function () {

                // Remove active class from all buttons
                d3.selectAll('.button').classed('active', false);
                // Find the button just clicked
                var button = d3.select(this);

                // Set it as the active button
                button.classed('active', true);

                // Get the id of the button
                var buttonId = button.attr('id');

                console.log(buttonId)
                // Toggle the bubble chart based on
                // the currently clicked button.
                splitBubbles(buttonId);
            });
    }

    setupButtons()

    d3.select("#return-to-chart")
        .on("click", function(d){
            d3.selectAll("svg")
                .remove()
            bars(".chart1", chart_data)
        })

    d3.selectAll("circle")
        .on("click", function(e, d){
            // console.log("Event is: ", e)
            // console.log("data is: ", d)
            d3.select("#returntobubbles")
                .classed("hidden3", false)

            d3.selectAll("svg")
                .attr("class", "hidden")
                .transition()
                .duration(2000)
            d3.selectAll("svg")
                .remove()
            d3.select("#toolbar")
                .classed("hidden3", true)
            d3.select("#bubble-tooltip")
                .classed("hidden", true)
                
            const line_chart = lineChart(".line-chart", d, data, chart_data)

            d3.select("#neighb-name")
                .classed("hidden3", true)

            d3.select("#line-name")
                .append("h2")
                .text(d.restaurant_name + " Reviews")
            d3.select("#line-name")
                .append("h5")
                .attr("class", "text-block")
                .text("The dark line shows the number of reviews from January to August in 2019. The red line shows the number of reviews from January to August 2020. The red line shows that there were fewer reviews in 2020 as a result of the pandemic. Many reviews hit rock bottom in March when stay at home orders were the most strict.")
            
            // var back_bubble_button =  d3.select("#button-holder")
            //     .append("button")
            //     .attr("id", "returntobubbles")
            //     .attr("class", "button active button-outline")
            //     .text("Go Back")

            // console.log("back button: ", back_bubble_button._groups[0])
            // back_bubble_button.on("click", function(d){
            //     console.log("CLICK REGISTERED!")
            // })
            
            


                
        })

    



}