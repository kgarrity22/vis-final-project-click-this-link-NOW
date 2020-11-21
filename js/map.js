// Vis for location data -- where the restaurants are located
export default function map(container) {

    const margin = ({ top: 50, right: 50, bottom: 50, left: 50})
    const width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    let svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




}