let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);



function p2() {
    var cleanedData2 = cleanYear(data);
    // console.log(cleanedData2);
    cleanedData2 = cleanedData2.filter(function(d) { if (d[0] !== undefined) {return d; }});
    // console.log(cleanedData2);

    var years = cleanedData2.map(function(d) { return d[0]});
    years = years.filter(function(x) { return x !== undefined});
    var minutes = cleanedData2.map(function(d) { return d[1]});
    minutes = minutes.filter(function(x) { return x !== undefined});

    let x = d3.scaleTime()
        .domain([d3.min(years), d3.max(years)])
        .range([0, graph_2_width - margin.left - margin.right]);

    svg2.append("g")
        .attr("transform", "translate(0," + graph_2_height + ")")
        .call(d3.axisBottom(x));
    
    let y = d3.scaleLinear()
        .domain([d3.min(minutes) - 10, d3.max(minutes) + 10])
        .range([graph_2_height - margin.top - margin.bottom, 0]);

    svg2.append("g")
        .call(d3.axisLeft(y).tickSize(5));

    svg2.append("path")
        .datum(cleanedData2)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d[0])})
            .y(function(d) { return y(d[1])})
        );

    let color = d3.scaleOrdinal()
        .domain(years)
        .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#ff5c7a"), years.length));

    let tooltip = d3.select("#graph2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    let dots = svg2.selectAll("dot").data(cleanedData2);
    
    dots.enter()
        .append("circle")
        .attr("cx", function(d) { return x(d[0]); })
        .attr("cy", function(d) { return y(d[1]); })
        .attr("r", 5)
        .style("fill", function(d) { return color(d[1]); })
        .on("mouseover", function(d) {	
            let html = `Year: ${d[0]}<br/>
                        Average Runtime: ${d[1]}`;
            tooltip.html(html)
                .style("left", `${(d3.event.pageX)}px`)
                .style("top", `${(d3.event.pageY)}px`)
                .transition()		
                .duration(200)		
                .style("opacity", 0.9);	
            })
        .on("mouseout", function(d) {		
            tooltip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

    svg2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2},
                                    ${(graph_2_height - margin.top - margin.bottom) + 30})`)
        .style("text-anchor", "middle")
        .style("font-size", 14)
        .text("Year");

    svg2.append("text")
        .attr("transform", `translate(-100, ${(graph_2_height - margin.top - margin.bottom) / 2})rotate(-90)`)
        .style("text-anchor", "middle")
        .style("font-size", 14)
        .text("Average Runtime (Minutes)");
        
    svg2.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left - margin.right) / 2}, -20)`)
        .style("text-anchor", "middle")
        .style("font-size", 18)
        .text("Average Runtime of Movies by Release Year");
}

function cleanYear(date) {
    let result = [];

    var movieData = date.flatMap(function(d) { if (d.type === "Movie") {return d; }})
    movieData = movieData.filter(function(x) { return x !== undefined});
    var yearData = date.flatMap(function(d) { if (d.type === "Movie") {return parseInt(d.release_year); }})
    var uniqueYear = [...new Set(yearData)];
    uniqueYear = orderYear(uniqueYear);

    // console.log(movieData);

    uniqueYear.forEach(x => result.push([x, averageYear(movieData, x)]));
    // console.log(result)
    return result;
}

function averageYear(data, year) {
    var avenue = [];
    data.flatMap(function(d) { if (parseInt(d.release_year) == year) { avenue.push(parseInt(d.duration)); }})

    if (avenue.length != 0) {
        let sun = (arrow) => arrow.reduce((a, b) => a + b);
        let average = sun(avenue) / avenue.length;
        return average;
    }
}

function orderYear(arrow) {
    var result = arrow.sort(function(a, b) { return b - a; })
    return result;
}