//how do covid trends relate to restaurants
export default function CovidMap(container){

    // chart code goes here

    const margin = ({ top: 50, right: 50, bottom: 50, left: 50 })
    const width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    let svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



    // dummy code outline for creating chart with time as one axis
    
    let xScale = d3.scaleTime()
        .domain([0, 2000])
        .range([0, width])
    
    let yScale = d3.scaleLinear()
        .domain([0, 300])
        .range([height, 0])

    let xAxis = d3.axisBottom()
        .scale(xScale)

    let yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10)

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${height})`);

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("height")





}