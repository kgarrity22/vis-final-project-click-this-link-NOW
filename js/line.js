export default function lineChart(container, restuarant){
    console.log("IS THE LINE CHART WORKING")

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

        const xScale = d3.scaleBand()
            .domain(months)
            .range([0, width])

        const yScale = d3.scaleLinear()
            .domain(d3.extent(d3.map(just_dates, d => d.reviews)))
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
        //     .call(function (g) {
        //         g.select(".domain").remove();
        //     })
        //     .selectAll(".tick line")
        //     .clone()
        //     .attr("y2", -height)
        //     .attr("stroke-opacity", 0.1)

        svg.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis)
        //     .call(function (g) {
        //         g.select(".domain").remove();
        //     })
        //     .selectAll(".tick line")
        //     .clone()
        //     .attr("x2", width)
        //     .attr("stroke-opacity", 0.1)

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

        // const label = svg.append("g")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", 10)
        //     .selectAll("g")
        //     .data(data)
        //     .join("g")
        //     .attr("transform", d => `translate(${xScale(d.miles)},${yScale(d.gas)})`)
        //     .attr("opacity", 0);


        // label.append("text")
        //     .text(function (d) {
        //         return d.year;
        //     })
        //     .each(position)
        //     .call(halo)
        //     .attr("opacity",);

        // label.transition()
        //     .delay((d, i) => line(data.slice(0, i + 1)).length / (l) * (6000 - 125))
        //     .attr("opacity", 1);



    

}