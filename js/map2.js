export default function map2(HTMLcontainer, data) {

        let changeColor = document.querySelector('#cuisine-category');

        console.log(data);
    
        let closedRestaurants = data.Restaurants;
        console.log(closedRestaurants);
        console.log(closedRestaurants.length);
    
        
        mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuZGljb2NjbyIsImEiOiJja2hzNWphaHIwZ2Q2MnpveXFzN3d6bzVhIn0.VLZWCuu4-J9qRLci__GVfA';
        var map = new mapboxgl.Map({
            container: HTMLcontainer,
            style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
            center: [-71.0604080381767, 42.36031994227539], // starting position [lng, lat]
            zoom: 13 // starting zoom
        });
    
        let mapContainer = map.getCanvasContainer();
    
        let svg = d3.select(mapContainer)
                        .append("svg")
                        .attr("width", "100%")
                        .attr("height", "500")
                        .style("position", "absolute")
                        .style("z-index", 2);
    
    
        //create datapoints
        let dots = svg.selectAll("circle")
                        .data(closedRestaurants)
                        .enter()
                        .append("circle")
                        .attr("class", "default")
                        .attr("r", 8)
                        .attr("stroke-width", 0.5)
                        .attr("stroke", "black")                
                        .attr("fill-opacity", 0.8)
                        .on("mouseenter", (event, d) => {
                            // show the tooltip
                            const pos = d3.pointer(event, window);
                
                            d3.select("#closedRestaurantMapTooltip")
                                .style("left", pos[0]+20+"px")
                                .style("top", pos[1]-20+"px")
                               // .select("#value")
                                .html("<p>Restaurant Name: " + d.name + "<br/>" +
                                    "Yelp Rating: " + d.rating + "<br/>" + 
                                    "Price: " + d.price + "<br/>" +
                                    "Cuisine: " + d.cuisine + "</p>"
                                )
                
                            d3.select("#closedRestaurantMapTooltip").classed("hidden", false);
                            
                
                        })
                        .on("mouseleave", (event, d) => {
                            // hide the tooltip
                            d3.select("#closedRestaurantMapTooltip").classed("hidden", true);
                        });
    

        console.log("closed restaurants:", project(closedRestaurants[0]));
    
        map.on("viewreset", render);
        map.on("move", render);
        map.on("moveend", render);
        render(); // Call once to render
        
    
        function project(d) {
            return map.project(new mapboxgl.LngLat(d.long, d.lat));
            }
    
        function render() {
            dots
                .attr("cx", function(d) {
                return project(d).x;
                })
                .attr("cy", function(d) {
                return project(d).y;
                });
            }     
            
            
        changeColor.addEventListener('change', (event) => {
            let category = event.target.value;
    
            d3.selectAll("#closedRestaurantMap svg circle").classed("default", false);
    
    
            console.log("CHANGE COLOR: ", category);  //debugging
            dots.attr('fill', function(d){
                if (category === "Select A Cuisine" || category === "Better Closed Restaurants" || category === "Worse Closed Restaurants"){
                    return "#ff0000"
                }
                if(category === "Bars"){ // special case for bars
                    if (d.cuisine.includes(category) && !d.cuisine.includes("Whiskey Bars") && 
                       !d.cuisine.includes("Wine Bars") && !d.cuisine.includes("Sports Bars") &&
                       !d.cuisine.includes("Dive Bars") && !d.cuisine.includes("Cocktail Bars")){  
                        return "#E626AD";
                    } else {
                        return "#323233";
                    }
                }
                else{
                    if (d.cuisine.includes(category)){
                        return "#E626AD";
                    } else {
                        return "#323233";
                    }
                }
            })
        });
        

    
    };    


