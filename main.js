import CovidMap from './js/CovidMap.js';
import barchart from './js/barchart.js';
import bubble from './js/bubble.js';
import map from './js/map.js';

d3.csv('data/yelp.csv', d => {
    return d3.autoType(d)
}).then(data => {
    console.log("data: ", data)

    const covidChart = CovidMap(".chart1");

    const cuisineChart = bubble(".chart2");

    const locationChart = map(".chart3");

    const ratingChart = barchart(".chart4");




}); // end of csv parsing
