//vis for comparing ratings of restaurants -- what are the best restaurants

export default function RatingVis(container) {

    d3.csv('yelp.csv', d3.autoType)
    .then(data=>{
        yelp = data;
        console.log(yelp)

        const margin = ({ top: 50, right: 50, bottom: 50, left: 50 })
        const width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


        let svg = d3.select(container).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const xScale = d3.scaleLinear()
            .domain(d3.extent(yelp, d => d.restaurant_name)).nice()
            .range([margin.left, width - margin.right])
        
        const yScale = d3.scaleLinear()
            .domain(d3.extent(yelp, d => d.rating)).nice()
            .range([height - margin.bottom, margin.top])


        const xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(10)

        const yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(10, ",f")
            
        // Draw the axis
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis)
            // .call(g => g.select(".domain").remove())
            // .selectAll(".tick line")
            // .clone()
            // .attr("y2", -height)
            // .attr("stroke-opacity", 0.1); // make it transparent

        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(35, 20)`)
            .call(yAxis)
            // .call(g => g.select(".domain").remove())
            // .selectAll(".tick line")
            // .clone()
            // .attr("x2", width)
            // .attr("stroke-opacity", 0.1); // make it transparent ;


        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width-15)
            .attr("y", height-6)
            .text("Restaurant");

        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 25)
            .attr("x", 145)
            .attr("dy", ".75em")
            .text("Rating");

    

        svg.append("g")
            .attr("fill", "#48C9B0")
            .selectAll("bar")
            .data(uelp)
            .join("bar")
            .attr("cx", d => xScale(d.restaurant_name))
            .attr("cy", d => yScale(d.rating));

    })





}