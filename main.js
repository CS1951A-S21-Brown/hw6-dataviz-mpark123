// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 60, right: 100, bottom: 40, left: 175};
const NUM_EXAMPLES = 30;

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
// let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_1_width = (MAX_WIDTH) - 10, graph_1_height = 600;
let graph_2_width = (MAX_WIDTH) - 10, graph_2_height = 500;
let graph_3_width = MAX_WIDTH - 10, graph_3_height = MAX_HEIGHT;

let data;
var cur_year;
var yearList = [];
let year_input = document.getElementById("attrInput");

d3.csv("./data/netflix.csv").then(function(d) {
    data = d;
    yearRange(data);
    p1(1);
    p2();
    p3();
});

function setYear() {
    ano = year_input.value;
    if (ano.toLowerCase() === 'all') {
            cur_year = 1;
    }
    if (yearList.includes(ano)) {
        clean = parseInt(ano, 10);
        cur_year = clean;
    }
    updateDashboard();
}

function updateDashboard() {
    p1(cur_year);
}

function yearRange(data) {
    var listYears = data.map(function(d) { return d.release_year});
    yearList = [...new Set(listYears)];
}