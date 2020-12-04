import CovidMap from '../js/CovidMap.js';
import barchart from '../js/barchart.js';
import bubble from '../js/bubble.js';
import map from './js/map.js';
import closedRestaurant from '../js/closedRestaurant.js';
import bars from '../js/bars.js';
import slopeGraph from '../js/slopegraph.js';
import line from '../js/line.js';
import heatMap from '../js/heatmap.js';

//create heatmap, need to add button functionality to swap with other map
heatMap("heatmap");

d3.json('data/closedRestaurants.json', d3.autoType).then(data=>{ 

    const closedRestaurantsChart = closedRestaurant("closedRestaurantMap", data);

}); 

d3.json('data/slopegraphData.json', d3.autoType).then(data=>{ 

    const slopeGraphChart = slopeGraph(".slopeChart", data);

}); 


d3.json('data/yelpedited.geojson', d3.autoType).then(data=>{ 

    const ratingRestaurantsChart = map("map", data);

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

    const bars_chart = bars(".chart1", data);

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

    


}); // end of csv parsing

