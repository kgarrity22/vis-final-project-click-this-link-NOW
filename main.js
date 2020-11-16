import CovidVis from './js/CovidVis.js';
import CuisineVis from './js/CuisineVis.js';
import LocationVis from './js/LocationVis.js';
import RatingVis from './js/RatingVis.js';

d3.csv('data/yelp.csv', d => {
    return d3.autoType(d)
}).then(data => {
    console.log("data: ", data)

    const covidChart = CovidVis(".chart1");

    const cuisineChart = CuisineVis(".chart2");

    const locationChart = LocationVis(".chart3");

    const ratingChart = RatingVis(".chart4");




}); // end of csv parsing
