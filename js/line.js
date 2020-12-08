import bubble from './bubble.js';

export default function lineChart(container, restuarant, bubble_data, chart_data){
    console.log("IS THE LINE CHART WORKING")
    console.log("REStauratns: ", restuarant)

    const margin = ({ top: 20, right: 20, bottom: 20, left: 40 })
    const width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    let svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];

    console.log("d is: ", restuarant)
    let just_dates = []
    // need a list of the months
    // need the month, year, number of reviews

    let line2019 = [];
    let line2020 = [];

    for (var i =0; i< Object.keys(restuarant).length; i++){
        if (Object.keys(restuarant)[i].includes("reviews_")){
            var new_dict = {}
            // new_dict[Object.keys(restuarant)[i]] = Object.keys(restuarant)[i]
            var month = Object.keys(restuarant)[i].slice(8).substring(0,3)
            var year = Object.keys(restuarant)[i].slice(8).substring(4, 6)
            var reviews = Object.values(restuarant)[i]
           
            new_dict["month"] = month
            new_dict["year"] = year
            new_dict["reviews"] = reviews
            just_dates.push(new_dict)
        }
    }

    console.log("just dates: ", just_dates)
    for (var i of just_dates){
        if (i.year == "19"){
            line2019.push(i)
        } else {
            line2020.push(i)
        }
    }
    console.log("2019 DATA: ", line2019)
    console.log("2020 DATA: ", line2020)

        const xScale = d3.scaleBand()
            .domain(months)
            .range([0, width])
        
        var ys = d3.extent(just_dates, function(d){
            return d.reviews
        })
        console.log("test of y domain: ", ys)

        const yScale = d3.scaleLinear()
            .domain(ys)
            .range([height, 0])

        console.log("YDOMAIN: ", yScale.domain())

        let xAxis = d3.axisBottom()
            .scale(xScale)
            // .ticks(5, ",f");

        let yAxis = d3.axisLeft()
            .scale(yScale)
            // .ticks(null, "$.2f");

        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
        

        svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)
        
        svg.append("text")
            .attr("class", "y-label")
            .attr('x', 10)
            .attr('y', -5)
            .attr("class", "yax")
            .text("Number of Reviews");

        svg.append("text")
            .attr('x', width - 140)
            .attr('y', height - 30)
            .text("Month")

        const line1 = d3.line()
            .curve(d3.curveCatmullRom)
            .x(function (d) {
                //console.log("xscale: ", xScale(d.month))
                return xScale(d.month);
            })
            .y(function (d) {
                //console.log("yscale: ", yScale(d.reviews))
                return yScale(d.reviews);
            });

        const l1 = line1(line2019).length;

        svg.append("path")
            .datum(line2019)
            .attr("stroke", function(d){
                //console.log("MAdE iT HERE1")
                return "black"
            })
            .attr("stroke-width", 3)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-dasharray", `0,${l1}`)
            .attr("fill", "none")
            .attr("d", line1)
            .transition()
            .duration(6500)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l1},${l1}`);


        svg.append("g")
            .selectAll("circle")
            .data(line2019)
            .join("circle")
            .attr("cx", function (d) {
                return xScale(d.month);
            })
            .attr("cy", function (d) {
                return yScale(d.reviews);
            })
            .attr("r", 4)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

    const line2 = d3.line()
        .curve(d3.curveCatmullRom)
        .x(function (d) {
            //console.log("xscale: ", xScale(d.month))
            return xScale(d.month);
        })
        .y(function (d) {
            //console.log("yscale: ", yScale(d.reviews))
            return yScale(d.reviews);
        });

    const l2 = line2(line2020).length;

    svg.append("path")
        .datum(line2020)
        .attr("stroke", function (d) {
            //console.log("MAdE iT HERE1")
            return "red"
        })
        .attr("stroke-width", 3)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", `0,${l2}`)
        .attr("fill", "none")
        .attr("d", line2)
        .transition()
        .duration(6500)
        .ease(d3.easeLinear)
        .attr("stroke-dasharray", `${l2},${l2}`);


    svg.append("g")
        .selectAll("circle")
        .data(line2020)
        .join("circle")
        .attr("cx", function (d) {
            return xScale(d.month);
        })
        .attr("cy", function (d) {
            return yScale(d.reviews);
        })
        .attr("r", 4)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

        

    

    var back_bubble_button = d3.select("#button-holder")
        .append("button")
        .attr("id", "returntobubbles")
        .attr("class", "button active button-outline")
        .text("Go Back")

   
    back_bubble_button.on("click", function (d) {
        console.log("CLICK REGISTERED!")
        d3.selectAll("svg")
            .attr("class", "hidden3")
            .transition()
            .duration(2000)
        d3.selectAll("svg")
            .remove()
        // d3.select("#toolbar")
        //     .remove()
        // d3.select("#bubble-tooltip")
        //     .classed("hidden", true)

        d3.select("#line-name")
            .classed("hidden3", true)
        
        d3.select("#chart-tip")
            .classed("hidden3", true)

        d3.select("#neighb-name")
            .classed("hidden3", false)
        d3.select("#neighb-name")
            .classed("hidden3", false)

        d3.select("#toolbar")
            .classed("hidden3", false)

        const neighborhoodChart = bubble("#bubble-chart", bubble_data, chart_data)
    })


    

}