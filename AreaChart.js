// import * as d3 from "https://unpkg.com/d3?module";
const margin = { top: 30, left: 40, bottom: 40, right: 20 };
var width = 700 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
let colors = d3.schemeTableau10;

function AreaChart(container) {
	const listeners = { brushed: null };

	// initialization
	let svg = d3
		.select(container)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// const tooltip = svg.append("text").text("");

	let xScale = d3.scaleTime().rangeRound([0, width]);

	let yScale = d3.scaleLinear().range([height, 0]);

	function brushed(event) {
		if (event.selection) {
			let selection = event.selection.map(xScale.invert); // or map(d=> xScale.invert(d))
		}
	}

	function end(event) {
		if (event.selection) {
			let selection = event.selection.map(xScale.invert); // or map(d=> xScale.invert(d))
		}
	}

	let xAxis = d3.axisBottom().scale(xScale);
	let yAxis = d3.axisLeft().scale(yScale);

	const brush = d3
		.brushX()
		.extent([
			[0, 0],
			[width, height],
		])
		.on("end", end)
		.on("brush", brushed);

	svg.append("g").attr("class", "brush").call(brush);

	let path = svg.append("path");

	svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", `translate(0, ${height})`);

	svg.append("g").attr("class", "axis y-axis");

	svg.select("text.axis-title").remove();

	svg.append("text")
		.attr("class", "axis-title")
		.attr("x", 10)
		.attr("y", -15)
		.attr("dy", ".1em")
		.style("text-anchor", "end");

	function on(event, listener) {
		listeners[event] = listener;
	}

	function update(data) {
		let totals = d3.extent(data, function (i) {
			return i.total;
		});
		totals = [0, totals[1]];

		xScale.domain(d3.extent(data, (d) => d.date));
		yScale.domain(totals);

		let area = d3
			.area()
			.x(function (d) {
				return xScale(d.date);
			})
			.y0(function (d) {
				return yScale(0);
			})
			.y1(function (d) {
				return yScale(d.total);
			});
		svg.append("g")
			.attr("class", "axis x-axis")
			.attr("transform", `translate(0, ${height})`)
			.call(xAxis);

		svg.append("g").attr("class", "axis y-axis").call(yAxis);
		path.datum(data).attr("class", container).attr("d", area);
	}
	return {
		update,
		on,
	};
}

export default AreaChart;
