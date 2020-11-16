import CovidVis from './CovidVis.js';
import CuisineVis from './CuisineVis.js';
import LocationVis from './LocationVis.js';
import RatingVis from './RatingVis.js';

d3.csv('yelp.csv', d => {
    return d3.autoType(d)
}).then(data => {
    console.log("data: ", data)

    const covidChart = CovidVis(".chart1");

    const cuisineChart = CuisineVis(".chart2");

    const locationChart = LocationVis(".chart3");

    const ratingChart = RatingVis(".chart4");




}); // end of csv parsing
