//Vis for comparing cuisines and how many of each type there are
export default function bubble(container, data, cuisines) {
    console.log("columns are: ", data.columns)
    console.log("example : ", data[0])

    var all_cuisines = []
    
    //console.log("list of cuisines: ", all_cuisines)
    console.log("CUISINES: ", cuisines)
    //console.log("ALL: ", all2)
    
    //console.log(Object.keys(cuisines))
    for (var i of Object.keys(cuisines)){
        if (i !== ""){
            var new_dict = {};
            new_dict["type"] = i;
            new_dict["val"] = cuisines[i];
            all_cuisines.push(new_dict)
        }
        
    }
    console.log("list of cuisines: ", all_cuisines)

    var dataset = {};
    dataset["children"] = all_cuisines
    console.log("SET UP DATASET: ", dataset)

    const margin = ({ top: 50, right: 50, bottom: 50, left: 50 })
    const width = 1000 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;


    let svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let color = d3.scaleOrdinal()
        .range(d3.schemeSet3)

    var diameter = 600;

    var bubble = d3.pack(data)
        .size([600, 600])
        .padding(1.5);
    
    var nodes = d3.hierarchy(dataset)
        .sum(function (d) { 
            // console.log("D: ", d)
            return d.val
        });

    console.log("NODES: ", nodes)

    
    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function (d) {
            return !d.children;
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            //console.log("d! in here!: ", d)
            return "translate(" + d.x*1.5 + "," + d.y*1.5 + ")";
        });

    node.append("circle")
        .attr("r", function (d) {
            //console.log("radius d: ", d)
            return d.r*1.5;
        })
        .style("fill", function (d, i) {
            return color(i);
        });

    node.append("text")
        .attr("dy", 1)
        .style("text-anchor", "middle")
        .text(function (d) {
            return d.data.type;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function (d) {
            return d.r / 4;
        })
        .attr("fill", "black");
    
    node.on("mouseover", function (e, d) {
        //console.log("d: ", d, " e : ", e)
        d3.select('#bubble-tooltip')
            .attr("opacity", 1)
            .attr("display", "block")
            .html(`${d.data.type}<br>${d.data.val}`)
            .style("left", (e.screenX - 100 + "px"))
            .style("font-family", "Gill Sans")
            .style("font-size", "12px")
            .style("background-color", "white")
            .style("opacity", 0.9)
            .style("color", "black")
            .style("top", (e.screenY - 170 + "px"))
        })
        .on("mouseout", function (e, d) {
            d3.select('#bubble-tooltip')
                .html(``)
                .attr("display", "none")
                
        })
        .on("click", function(e, d){
            d3.selectAll(".node")
                .attr("opacity", 0.5)
                .transition()
                .duration(3000)
            d3.select(this)
                .attr("opacity", 1)

                // .remove()
                // .transition()
                // .duration(2000)
                
                // .exit()
        })
        .on("dblclick", function (e, d) {
            d3.selectAll(".node")
                .attr("opacity", 1)
                .transition()
                .duration(3000)
            

            // .remove()
            // .transition()
            // .duration(2000)

            // .exit()
        })

    // function update(_data){
    //     data = _data
    // }
    
    // return {
    //     update,
        
    // }

    
    
    





}