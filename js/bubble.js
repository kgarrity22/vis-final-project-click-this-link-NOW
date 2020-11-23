//Vis for comparing cuisines and how many of each type there are
export default function bubble(container, data) {
    console.log("columns are: ", data.columns)
    console.log("example : ", data[0])

    var all_cuisines = []
    var cuisines = {};
    var all2 = [];

    for (var item of data) {
        var i = item.restaurant_tag;
        if (i.includes(",")) {
            var split = i.split(",");
            //console.log("split: ", split)
            for (var j of split) {
                if (all2.indexOf(j) == -1) {
                    all2.push(j);
                    cuisines[j] = 1;
                } else {
                    cuisines[j] +=1;
                }
            }
        } else {
            if (all2.indexOf(i) == -1) {
                all2.push(i);
                cuisines[i] = 1;
            } else {
                cuisines[i] += 1;
            }
        }
        
        
    }
    console.log("list of cuisines: ", all_cuisines)
    console.log("CUISINES: ", cuisines)
    console.log("ALL: ", all2)

    const margin = ({ top: 50, right: 50, bottom: 50, left: 50 })
    const width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;


    let svg = d3.select(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var color = d3.scaleOrdinal(d3.schemeCategory20);

    var diameter = 600;

    var bubble = d3.pack(data)
        .size([diameter, diameter])
        .padding(1.5);
    
    var nodes = d3.hierarchy(data)
        .sum(function (d) { 
            console.log("D: ", d)
            
            return d.Count; 
        });

    var node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function (d) {
            return !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("circle")
        .attr("r", function (d) {
            return d.r;
        })
        .style("fill", function (d, i) {
            return color(i);
        });

    
    
    console.log("bubble: ", bubble)





}