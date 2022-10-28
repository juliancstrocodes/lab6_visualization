import * as d3 from "https://unpkg.com/d3?module";
const margin = { top: 30, left: 40, bottom: 40, right: 20 };
var width = 700 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
let colors = d3.schemeTableau10;

function StackedAreaChart(container) {
	var xDomain, data;
	var selected = null,
		xDomain,
		data;

	// initialization
	let svg = d3
		.select(container)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	const tooltip = svg.append("text").text("");

	let timeScale = d3.scaleTime().range([0, width]);

	let yScale = d3.scaleLinear().range([height, 0]);

	svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", `translate(0, ${height})`);

	svg.append("g").attr("class", "axis y-axis");

	function update(_data) {
		data = _data; // -- (2)
		const keys = selected ? [selected] : data.columns.slice(1);
		let dates = data.map((d) => d.date);
		let timeDomain = [dates[0], dates[dates.length - 1]];
		timeScale.domain(xDomain ? xDomain : timeDomain); // -- (5)

		let stack = d3
			.stack()
			.keys(keys)
			.order(d3.stackOrderNone)
			.offset(d3.stackOffsetNone);

		let colorScale = d3.scaleOrdinal(keys, colors);
		let totals = d3.extent(data, function (i) {
			return i.total;
		});

		totals = [0, totals[1]];

		let area = d3
			.area()
			.x(function (d) {
				return timeScale(d.data.date);
			})
			.y0(function (d) {
				return yScale(d[0]);
			})
			.y1(function (d) {
				return yScale(d[1]);
			});

		let series = stack(data); // Define scales

		colorScale.domain(keys);
		yScale.domain(totals);

		const areas = svg
			.selectAll(".area")
			.data(series, (d) => d.key)
			.join("path")
			.attr("fill", ({ index }) => colorScale(index))
			.attr("d", area)
			.append("title")
			.text(({ index }) => keys[index]);

		svg.selectAll("path")
			.on("mouseover", (event, d, i) => tooltip.text(d.key))
			.on("mouseout", (event, d, i) => tooltip.text(""))
			.on("click", (event, d) => {
				// toggle selected based on d.key
				if (selected === d.key) {
					selected = null;
				} else {
					selected = d.key;
				}
				update(data); // simply update the chart again
			});

		let xAxis = d3
			.axisBottom(timeScale)
			.ticks(width / 80)
			.tickSizeOuter(0);

		let yAxis = d3.axisLeft().scale(yScale);

		svg.select(".axis.x-axis")
			.attr("transform", `translate(0, ${height})`)
			.call(xAxis);

		svg.select(".axis.y-axis").call(yAxis);
		areas.exit().remove();
	}

	function filterByDate(range) {
		xDomain = range; // -- (3)
		update(data); // -- (4)
	}
	return {
		update,
		filterByDate,
	};
}

export default StackedAreaChart;
