import CovidMap from './CovidMap.js';
import barchart from './barchart.js';
import bubble from './bubble.js';
import closedRestaurant from './closedRestaurant.js';
import bars from './bars.js';
import slopeGraph from './slopegraph.js';
// import line from './js/line.js';
import heatMap from './heatmap.js';

//create heatmap, need to add button functionality to swap with other map
heatMap("heatmap");

d3.json('data/closedRestaurants.json', d3.autoType).then(data=>{ 

    const closedRestaurantsChart = closedRestaurant("closedRestaurantMap", data);

}); 

d3.json('data/slopegraphData.json', d3.autoType).then(data=>{ 

    const slopeGraphChart = slopeGraph(".slopeChart", data);

}); 


d3.csv('data/yelp.csv', d => {
    return d3.autoType(d)
}).then(data => {
    console.log("data: ", data);

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
                    cuisines[j] += 1;
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

    const ratingChart = barchart(".chart2", data);

    const covidChart = CovidMap(".chart4", data);

    // const bars_chart = bars(".chart1", data);
    const bars_chart = bars("#barchart1", data);
    d3.select(".chart1")
        .style("opacity", 0)

    const bars_chart_scroll = bars("#graph", data);

    var oldWidth = 0
    function render() {
        // if (oldWidth == innerWidth) return
        // oldWidth = innerWidth

        // var width = height = d3.select('#graph').node().offsetWidth
        // var r = 40


        // if (innerWidth <= 925) {
        //     width = innerWidth
        //     height = innerHeight * .7
        // }



        
        var gs = d3.graphScroll()
            .container(d3.select('.container-1'))
            .graph(d3.selectAll('container-1 #graph'))
            .eventId('uniqueId1')  // namespace for scroll and resize events
            .sections(d3.selectAll('.container-1 #sections > div'))
            .on('active', function (i) {
                console.log("Seeing what I IS: ", i)
                var circles = d3.selectAll(".points")
                var all_circles = circles._groups[0]

                d3.selectAll(".points")
                    .style("fill", "pink")

                // SELECTING BOSTON REstuarants
                if (i == 1) {
                    for (var j of circles) {
                        if (j.__data__.neighborhood == "Boston") {
                            d3.select(j)
                                .transition().duration(500)
                                .style("fill", "navy")
                        } else {
                            d3.select(j)
                                .style("fill", "pink")
                                .attr("opacity", 0.3)
                        }
                    }

                } else if (i == 2) {
                    for (var j of circles) {
                        if (j.__data__.neighborhood == "Cambridge" || j.__data__.neighborhood == "Brookline") {
                            d3.select(j)
                                .transition().duration(500)
                                .style("fill", "navy")
                        } else {
                            d3.select(j)
                                .style("fill", "pink")
                                .attr("opacity", 0.3)
                        }
                    }
                }
                else if (i == 3) {
                    for (var j of circles) {
                        if (j.__data__.neighborhood == "North End") {
                            d3.select(j)
                                .transition().duration(500)
                                .style("fill", "navy")
                        } else {
                            d3.select(j)
                                .style("fill", "pink")
                                .attr("opacity", 0.3)
                        }
                    }

                }
                else if (i > 3) {
                    d3.select("#graph")
                        .attr("class", "hidden2")
                    
                    d3.select(".visible")
                        .transition().duration(900)
                        .style("opacity", 1)

                    d3.selectAll(".points")
                        
                        .style("fill", "pink")
                    
                    d3.select(".chart1")
                        .transition().duration(2500)
                        .style("opacity", 1)
                    
                        

                }
                d3.selectAll(".points")
                    .style("fill", "pink")

            })
            

        // d3.select('#source')
        //     .style({ 'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px' })
    }
    render()
    d3.select(window).on('resize', render)

    // const lineChart = line(".line-chart", data);

    //const cuisineChart = bubble(".bubble-chart", data, cuisines);

    // const locationChart = map(".chart3", data);

    d3.selectAll("button")

        .on("click", function(e, d){

            d3.selectAll(".bubble-chart")
                .remove()
            
            d3.select(".chart1")
                .append("div")
                .attr("class", "bubble-chart")


            
            console.log("this: ", this.id)
            if (this.id == "Cuisines"){
                var cuisines = {};
                var all2 = [];

                for (var item of data) {
                    //console.log("MADE IT HERE!!")
                    var i = item.restaurant_tag;
                    if (i.includes(",")) {
                        var split = i.split(",");
                        //console.log("split: ", split)
                        for (var j of split) {
                            if (all2.indexOf(j) == -1) {
                                all2.push(j);
                                cuisines[j] = 1;
                            } else {
                                cuisines[j] += 1;
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
                //const cuisineChart = bubble(".bubble-chart", data, cuisines);
                //console.log("cuisine chart is: ", cuisineChart)

            } else if (this.id == "Neighborhood"){
                var neighborhoods = {};
                var all2 = [];
                
                for (var item of data) {
                    var i = item.restaurant_neighborhood;
                    if (i=="Boston"){
                        i = "Downtown Boston";
                    }
                    
                    if (all2.indexOf(i) == -1) {
                        all2.push(i);
                        neighborhoods[i] = 1;
                    } else {
                            neighborhoods[i] += 1;
                    }
                }

                const neighborhoodChart = bubble(".bubble-chart", data, neighborhoods);
            }
        })
    function hideDetail() {
            d3.select("body").style("overflow", "auto");
            $.scrollify.enable()
          
            hideDetailAnimation();
          }
    window.onscroll = function () {
            updateScrollProgress()
          };
          
    function updateScrollProgress() {
            var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrolled = (winScroll / height) * 100;
            document.getElementById("myBar").style.height = scrolled + "%";
          }
    

}); // end of csv parsing

