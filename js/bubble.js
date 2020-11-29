
export default function bubble(container, data) {
    console.log("data entered into bubble: ", data)

    d3.selectAll(container)
        .attr("class", "visible")
    
    
    var neighborhoods = [];
    
    for (var i of data){
        if (neighborhoods.indexOf(i.restaurant_neighborhood) == -1) {
            neighborhoods.push(i.restaurant_neighborhood)
        }
    }
    

    

    

    const margin = ({ top: 50, right: 50, bottom: 50, left: 50 })
    const width = 1000 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    
    var neighborhood0 = [];
    var neighborhood2 = [];
    data.forEach(function (d) {
        d.r = d.rating**1.5 + 1;
        d.x = width / 2;
        d.y = height / 2;

        
    })
    
    
    

    
    var centerScale = d3.scalePoint().padding(1).range([0, width]);
    var forceStrength = 0.1;

    

    
    let svg = d3.selectAll(container).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var color = d3.scaleSequential().domain([0, 3000])
        .interpolator(d3.interpolateYlOrRd);

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
        // .call(d3.drag()
        //     .on("start", dragstarted)
        //     .on("drag", dragged)
        //     .on("end", dragended));

    circles = circles.merge(circlesEnter)

    circles.on("mouseover", function (e, d) {
        //console.log("d: ", d, " e : ", e)
        d3.select('#bubble-tooltip')
            .attr("opacity", 1)
            .attr("display", "block")
            .html(`Name: ${d.restaurant_name}<br>Rating: ${d.rating}<br>Number of Reviews: ${d.review_number}<br>Cuisin Type: ${d.restaurant_tag}`)
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


    function ticked() {
        //console.log("tick")
        //console.log(data.map(function(d){ return d.x; }));
        circles
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; });
    }

    simulation
        .nodes(data)
        .on("tick", ticked);

    // function dragstarted(d, i) {
    //     //console.log("dragstarted " + i)
    //     if (!d3.event.active) simulation.alpha(1).restart();
    //     d.fx = d.x;
    //     d.fy = d.y;
    // }

    // function dragged(d, i) {
    //     //console.log("dragged " + i)
    //     d.fx = d3.event.x;
    //     d.fy = d3.event.y;
    // }

    // function dragended(d, i) {
    //     //console.log("dragended " + i)
    //     if (!d3.event.active) simulation.alphaTarget(0);
    //     d.fx = null;
    //     d.fy = null;
    //     var me = d3.select(this)
    //     console.log(me.classed("selected"))
    //     me.classed("selected", !me.classed("selected"))

    //     d3.selectAll("circle")
    //         .style("fill", function (d, i) { return color(d.restaurant_neighborhood); })

    //     d3.selectAll("circle.selected")
    //         .style("fill", "none")

    // }

    function groupBubbles() {
        hideTitles();

        // @v4 Reset the 'x' force to draw the bubbles to the center.
        simulation.force('x', d3.forceX().strength(forceStrength).x(w / 2));

        // @v4 We can reset the alpha value and restart the simulation
        simulation.alpha(1).restart();
    }

    function splitBubbles(byVar) {

        centerScale.domain(data.map(function (d) { return d[byVar]; }));

        if (byVar == "all") {
            hideTitles()
        } else {
            showTitles(byVar, centerScale);
        }

        // @v4 Reset the 'x' force to draw the bubbles to their year centers
        simulation.force('x', d3.forceX().strength(forceStrength).x(function (d) {
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
        var titles = svg.selectAll('.title')
            .data(scale.domain());

        titles.enter().append('text')
            .attr('class', 'title')
            .merge(titles)
            .attr('x', function (d) { return scale(d); })
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text(function (d) { return byVar + ' ' + d; });

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


    


    //console.log("NODES: ", nodes)
    //console.log("bubble nodes: ", bubble(nodes))
    // console.log("force: ", d3.forceSimulation(nodes))

    

    // const simulation = d3.forceSimulation(bubble(nodes).descendants())
    //     .velocityDecay(0.2)
        
        

    //     .force("collide", d3.forceCollide().radius(function (d) {
    //             console.log("d in collide: ", d.r)
    //             return d.r
    //         })
    //         .strength(-0.01))
            
        
    //     .force("x", d3.forceX().x(function(d){
    //         //console.log("d in tick: ", d.x)
    //         return d.x
    //     })
    //         .strength(5))
    //     .force("y", d3.forceY().y(function(d){
    //         return d.y*1.5
    //     })
    //         .strength(-0.005))
        
        
        // .alpha(0.1)
        // .alphaDecay(0)
        
        
   

    // var node = svg.selectAll(".node")
    //     .data(bubble(nodes).descendants())
    //     .enter()
    //     .filter(function (d) {
    //         return !d.children;
    //     })
    //     .append("g")
    //     .attr("class", "node")
    //     .attr("transform", function (d) {
    //         //console.log("d! in here!: ", d)
    //         return "translate(" + d.x * 1.5 + "," + d.y * 1.5 + ")";
    //     });

    
    // //console.log("COMPARING : ", bubble(nodes).descendants(), "AND: ", nodes)

    // node.append("circle")
    //     .attr("r", function (d) {
    //         //console.log("radius d: ", d)
    //         return d.r*1.5;
    //     })
    //     .style("fill", function (d, i) {
    //         return color(i);
    //     })
    //     .attr("transform", function(d){
    //         //console.log("d in circle loc: ", d)
    //         return "translate(" + d.x + "," + d.y + ")";
    //     })
    
    

    // node.append("text")
    //     .attr("dy", 1)
    //     .style("text-anchor", "middle")
    //     .text(function (d) {
    //         return d.data.type;
    //     })
    //     .attr("font-family", "sans-serif")
    //     .attr("font-size", function (d) {
    //         return d.r / 4;
    //     })
    //     .attr("fill", "black");
    
    // node.on("mouseover", function (e, d) {
    //     //console.log("d: ", d, " e : ", e)
    //     d3.select('#bubble-tooltip')
    //         .attr("opacity", 1)
    //         .attr("display", "block")
    //         .html(`${d.data.type}<br>${d.data.val}`)
    //         .style("left", (e.screenX - 100 + "px"))
    //         .style("font-family", "Gill Sans")
    //         .style("font-size", "12px")
    //         .style("background-color", "white")
    //         .style("opacity", 0.9)
    //         .style("color", "black")
    //         .style("top", (e.screenY - 170 + "px"))

            
    //     })
    //     .on("mouseout", function (e, d) {
    //         d3.select('#bubble-tooltip')
    //             .html(``)
    //             .attr("display", "none")
                
    //     })
    //     .on("click", function(e, d){
    //         d3.selectAll(".node")
    //             .attr("opacity", 0.5)
    //             .transition()
    //             .duration(3000)
    //         d3.select(this)
    //             .attr("opacity", 1)

    //             // .remove()
    //             // .transition()
    //             // .duration(2000)
                
    //             // .exit()
    //     })
    //     .on("dblclick", function (e, d) {
    //         d3.selectAll(".node")
    //             .attr("opacity", 1)
    //             .transition()
    //             .duration(3000)
            

    //         // .remove()
    //         // .transition()
    //         // .duration(2000)

    //         // .exit()
    //     })
    
    // simulation.on("tick", () => {
        



    //     node
            
    //         .attr("transform", function (d) {
    //         //console.log("d! in here!: ", d)
    //         return "translate(" + d.x * 1.5 + "," + d.y * 1.5 + ")";
    //     });


    // });

    // function update(_data){
    //     data = _data
    // }
    
    // return {
    //     update,
        
    // }

    
    
    





}