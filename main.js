import CovidMap from './js/CovidMap.js';
import barchart from './js/barchart.js';
import bubble from './js/bubble.js';
import map from './js/map.js';
import map2 from './js/map2.js';

d3.json('data/closedRestaurants.json', d3.autoType).then(data=>{ 

    const closedRestaurantsChart = map2("closedRestaurantMap", data);

}); // end of JSON parsing

d3.json('data/yelpedited.geojson', d3.autoType).then(data=>{ 

    const ratingRestaurantsChart = map("map", data);

});

d3.csv('data/yelp.csv', d => {
    return d3.autoType(d)
}).then(data => {
    console.log("data: ", data);

    const ratingChart = barchart(".chart2", data);

    const covidChart = CovidMap(".chart4", data);

    const cuisineChart = bubble(".chart1", data);

    // const locationChart = map(".chart3", data);

    


}); // end of csv parsing

