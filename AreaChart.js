import * as d3 from "https://unpkg.com/d3?module";
const margin = { top: 30, left: 40, bottom: 40, right: 20 };
var width = 700 - margin.left - margin.right,
	height = 150 - margin.top - margin.bottom;

function AreaChart(container) {
	// initialization

	// 	stroke: #646464;
	//   stroke-width: 1px;
	let svg = d3
		.select(container)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	let xScale = d3.scaleTime().rangeRound([0, width]);
	let yScale = d3.scaleLinear().range([height, 0]);

	svg.append("g").attr("class", "axis x-axis");
	svg.append("g").attr("class", "axis y-axis");

	let xAxis = d3.axisBottom().scale(xScale).tickSizeOuter(0);
	let defaultSelection = [
		"2000-01-01T00:00:00.000Z",
		"2010-02-01T00:00:00.000Z",
	];

	let yAxis = d3.axisLeft().scale(yScale).ticks(3);

	function brushed(event) {
		if (event.selection) {
			let selection = event.selection.map(xScale.invert); // or map(d=> xScale.invert(d))
			listeners["brushed"](selection);
		}
	}
	const brush = d3
		.brushX()
		.extent([
			[0, 0],
			[width, height],
		])
		.on("end", brushend)
		.on("brush", brushed);

	function brushend(event) {
		if (!event.selection) {
			// svg.call(brush.move, defaultSelection);
			const beg = new Date(defaultSelection[0]);
			const end = new Date(defaultSelection[1]);

			listeners["brushed"]([beg, end]);
		}
	}

	let path = svg.append("path").attr("class", "area").attr("fill", "#f94932");

	svg.append("g").attr("class", "brush").call(brush);

	const listeners = { brushed: null };

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

		svg.append("g")
			.attr("class", "axis y-axis")
			.attr("transform", `translate(${width}), 0`)
			.call(yAxis);
		path.datum(data).attr("class", container).attr("d", area);
	}
	return {
		update,
		on,
	};
}

export default AreaChart;
