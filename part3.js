let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left + 50}, ${margin.top})`);

let countRef2 = svg3.append("g");

function p3() {
    var cleanedData3 = organizeData(data);
    cleanedData3 = cleanedData3.slice(0, NUM_EXAMPLES);
    // console.log(cleanedData3)
    var pairs = cleanedData3.map(function(d) { return d[0]});
    // console.log(pairs);
    pairs.forEach(x => x[1] = " " + x[1])
    let counts = cleanedData3.map(function(d) { return d[1]});

    let x = d3.scaleLinear()
        .domain([0, d3.max(counts)])
        .range([0, graph_3_width - margin.left - margin.right]);

    let y = d3.scaleBand()
        .domain(pairs)
        .range([0, graph_3_height - margin.top - margin.bottom + 30])
        .padding(0.1);

    svg3.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(20));

    let barss = svg3.selectAll("rect").data(cleanedData3);

    let color = d3.scaleOrdinal()
        .domain(pairs)
        .range(d3.quantize(d3.interpolateHcl("#D17B0F", "#B7F0AD"), pairs.length));
    
    barss.enter()
        .append("rect")
        .merge(barss)
        .transition()
        .duration(1000)
        .style("margin-top", "10px")
        .attr("fill", function(d) { return color(d[0]) }) 
        .attr("x", x(0))
        .attr("y", function(d) { return y(d[0])})               
        .attr("width", function(d) { return x(d[1])})
        .attr("height",  10); 

    let counts3 = countRef2.selectAll("text").data(cleanedData3);

    counts3.enter()
        .append("text")
        .merge(counts3)
        .attr("x", function(d) { return x(d[1]) + 10})       
        .attr("y", function(d) { return y(d[0]) + 10})       
        .style("text-anchor", "start")
        .text(function (d) { return d[1];});

    svg3.append("text")
        .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2},
        ${(graph_3_height - margin.top - margin.bottom) + 40})`)     
        .style("text-anchor", "middle")
        .style("font-size", 14)
        .text("Count");

    svg3.append("text")
        .attr("transform", `translate(-210, ${(graph_3_height - margin.top - margin.bottom) / 2})rotate(-90)`)
        .style("text-anchor", "middle")
        .style("font-size", 14)
        .text("Director and Actor Pair (Director, Actor)");
 

    svg3.append("text")
        .attr("transform", `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${-20})`)
        .style("text-anchor", "middle")
        .style("font-size", 18)
        .text("Most Movies by Pair of Director and Actor");

    barss.exit().remove();
    counts3.exit().remove();
}

function organizeData(data) {
    let intermediate = [];
    let preResult = [];
    let output = [];

    var directorData = data.flatMap(function(d) { if ((d.director !== "") && (d.type === "Movie")) { return d; }})
    directorData = directorData.filter(function(x) { return x !== undefined});
    var pairsData = directorData.map(x => splitData(x));
    // console.log(pairsData)
    pairsData.flatMap(x => intermediate = intermediate.concat(splitDirector(x)));
    intermediate.forEach(x => preResult = preResult.concat(processPairs(x)));
    var uniquePairs = Array.from(new Set(preResult.map(JSON.stringify)), JSON.parse)
    uniquePairs.forEach(x => output.push([x, countPairs(x, preResult)]));
    output = orderData(output);
    // console.log(output)
    return output
}


function splitData(d) {
    let direct = d.director;
    let cap = d.cast;

    let castList = cap.split(",");
    castList = castList.map(x => x.trim());
    
    let result = [direct, castList];
    return result;
}

function splitDirector(d) {
    let directors = d[0]
    let casttt = d[1];
    let dList = directors.split(",");
    dList = dList.map(x => x.trim());

    let result = [];

    dList.forEach(x => result.push([x, casttt]));
    return result;
}

function processPairs(d) {
    let result = [];
    let direct = d[0];
    let clist = d[1];
    clist.forEach(x => result.push([direct, x]));
    return result;
}

function countPairs(pair, data) {
    var p = data.filter(x => x[0] === pair[0] && x[1] === pair[1]);
    return p.length;
}

function orderData(data) {
    var result = data.sort(function(a, b) { return b[1] - a[1]});
    return result;
}
