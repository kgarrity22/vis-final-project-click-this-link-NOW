
export default function slopeGraph(container, data) {


    let resetSlopeGraph = document.querySelector('#slopeGraphReset')
    resetSlopeGraph.addEventListener('click', (event) => {
        //reset map circle colors
        d3.selectAll("#closedRestaurantMap svg circle").classed("default", true);

        //reset option
        document.getElementById('cuisine-category').value="Select A Cuisine";

        //reset slope graph
        svg.selectAll("g.cuisineTitles")  // remove the old lines
            .attr("opacity", 1)
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();

            svg.selectAll("g.cuisinePaths")  // remove the old lines
            .attr("opacity", 1)
            .transition()
            .duration(500)
            .attr("opacity", 0)
            .remove();
    });


    let selectElem = document.querySelector('#cuisine-category');
    selectElem.addEventListener('change', (event) => {
        let category = event.target.value;
        console.log(category);  //debugging
        filterData(category);
    });



    let globalFlag = ""

    function filterData(category) {

        let filteredCuisines = data.filter(function (cuisine) {
            if (category === "Better Closed Restaurants"){
                return cuisine.qualityEliminated === "Better";
            }
            if (category === "Worse Closed Restaurants"){
                return cuisine.qualityEliminated === "Worse";
            }
            if (category === "Top 10 Most Drastic Change"){
                return cuisine.mostDrastic === "Yes";
            }
            else{
                globalFlag = category;
                return cuisine.cuisineName === category;
            }

        });
        renderSlopeGraph(filteredCuisines);
    }



    let margin = ({ top: 40, right: 50, bottom: 10, left: 50 });
    let height = 600,
        width = 600;
    let n = 2;

    let x = d3.scalePoint()
        .domain(d3.range(n))
        .range([margin.left, width - margin.right])
        .padding(0.5)

    let y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])

    let svg = d3.select(container)
        .append("svg")
        .attr("width", 600)
        .attr("height", 600)
        .attr("viewBox", [0, 0, width, height])
        .attr("font-family", "sans-serif")
        .attr("font-size", 10);            


    let keys = ["Average Cuisine Rating of All Restaurants", "Average Cuisine Rating of Closed Restaurants"];
        
    svg.append("g")
    .attr("text-anchor", "middle")
    .selectAll("g")
    .data(keys)
    .join("g")
    .attr("transform", (d, i) => `translate(${x(i)},20)`)
    .call(g => g.append("text").text(d => d))
    .call(g => g.append("line").attr("y1", 3).attr("y2", 9).attr("stroke", "currentColor"));


    function renderSlopeGraph(data){

        console.log("GLOBAL FLAG", globalFlag);

        console.log(data);
            
        const padding = 3
        

        let extent = d3.extent(data.flatMap(d => d.values));

        y.domain([2,5]);


        let line = d3.line()
            .x((d, i) => x(i))
            .y(y)


        console.log("hellooo");

        svg.append("g")
            .attr("fill", "none")
            .attr("class", "cuisinePaths")
            .attr("stroke", "currentColor")
            .selectAll("path")
            .data(data)
            .join("path")
            .attr("d", d => line(d.values));

        let formatNumber = y.tickFormat(300)

        svg.append("g")
            .attr("class", "cuisineTitles")
            .selectAll("g")
            .data(keys)
            .join("g")
            .attr("transform", (d, i) => `translate(${x(i) + (i === 0 ? -padding : i === n - 1 ? padding : 0)},0)`)
            .attr("text-anchor", (d, i) => i === 0 ? "end" : i === n - 1 ? "start" : "middle")
            .selectAll("text")
            .data((d, i) => d3.zip(
                data.map(i === 0 ? d => `${d.cuisineName} ${formatNumber(d.values[i])}`
                    : i === n - 1 ? d => `${formatNumber(d.values[i])} ${d.cuisineName}`
                        : d => `${formatNumber(d.values[i])}`),
                dodge(data.map(d => y(d.values[i])))))
            .join("text")
            .attr("y", ([, y]) => y)
            .attr("dy", "0.35em")
            .text(([text]) => text)
            .call(halo);


        svg.selectAll("path") //show the new ones
            .transition()
            .duration(1000)
            .attr("opacity", 1)


        svg.selectAll("g.cuisineTitles") //show the new ones
            .transition()
            .duration(1000)
            .attr("opacity", 1)




        function dodge(positions, separation = 10, maxiter = 10, maxerror = 1e-1) {
            console.log(positions);
            positions = Array.from(positions);
            let n = positions.length;
            if (!positions.every(isFinite)) throw new Error("invalid position");
            if (!(n > 1)) return positions;
            let index = d3.range(positions.length);
            for (let iter = 0; iter < maxiter; ++iter) {
                index.sort((i, j) => d3.ascending(positions[i], positions[j]));
                let error = 0;
                for (let i = 1; i < n; ++i) {
                    let delta = positions[index[i]] - positions[index[i - 1]];
                    if (delta < separation) {
                        delta = (separation - delta) / 2;
                        error = Math.max(error, delta);
                        positions[index[i - 1]] -= delta;
                        positions[index[i]] += delta;
                    }
                }
                if (error < maxerror) break;
            }
            return positions;
        }


        function halo(text) {
            text.clone(true)
                .each(function () { this.parentNode.insertBefore(this, this.previousSibling); })
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-width", 4)
                .attr("stroke-linejoin", "round");
        }

    }

}