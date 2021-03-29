let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]); 

let y = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom + 30])
    .padding(0.1);

let countRef = svg.append("g");

let y_axis_label = svg.append("g");

svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2},
    ${(graph_1_height - margin.top - margin.bottom) + 30})`)
    .style("text-anchor", "middle")
    .style("font-size", 14)
    .text("Count");

let y_axis_text = svg.append("text")
    .attr("transform", `translate(-150, ${(graph_1_height - margin.top - margin.bottom) / 2})rotate(-90)`)       // HINT: Place this at the center left edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 14)
    .text("Genres");

let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width - margin.left - margin.right) / 2}, -20)`)       // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 18);

function p1(year) {
    var cleanedData1 = cleanGenre(data, year) 
    var keys = cleanedData1.map(function(d) { return d[0]});
    // console.log(keys);
    var values = cleanedData1.map(function(d) { return d[1]});

    x.domain([0, d3.max(values)]);
    y.domain(keys);
    
    y_axis_label.call(d3.axisLeft(y).tickSize(0).tickPadding(20));

    let bars = svg.selectAll("rect").data(cleanedData1);

    let color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.quantize(d3.interpolateHcl("#00008B", "#00FFFF"), keys.length));

    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(1000)
        .style("margin-top", "10px")
        .attr("fill", function(d) { return color(d[0])})
        .attr("x", x(0))
        .attr("y", function(d) {return y(d[0])})
        .attr("width", function(d) { return x(d[1])})
        .attr("height", y.bandwidth());

    let counts = countRef.selectAll("text").data(cleanedData1);

    counts.enter()
        .append("text")
        .merge(counts)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(d[1]) + 5})
        .attr("y", function(d) { return y(d[0]) + 10})
        .style("text-anchor", "start")
        .text(function(d) { return d[1]});

    let str;
    if (year == 1) {
        str = "from 2010 - 2020";
    } else {
        str = "in " + String(year);
    }

    title.text("Number of Titles of each Genre " + str);
    bars.exit().remove();
    counts.exit().remove();
}

function cleanGenre(date, year) {
    let result = [];
    if (year == 1) {
        var filteredData = date.map(function(d) { return d.listed_in})
    } else {
        
        var filteredData = date.flatMap(function(d) { if (d.release_year == year) {return d.listed_in} });
        filteredData = filteredData.filter(function(x) { return x !== undefined});
    }
    
    var genreList = filteredData.flatMap(function(d) {return d.split(',')});
    genreList = genreList.map(x => x.trim());
    var uniqueGenre = [...new Set(genreList)];

    uniqueGenre.forEach(x => result.push([x, genreCount(genreList, x)]));

    result = cleanData(result);

    return result;
}

function genreCount(gList, genre) {
    var g = gList.filter(y => y == genre);
    return g.length;
}

function cleanData(data) {
    var result = data.sort(function(a, b) { return b[1] - a[1]});
    return result;
}