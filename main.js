import * as d3 from "https://unpkg.com/d3?module";
import AreaChart from "./AreaChart.js";
import StackedAreaChart from "./StackedAreaChart.js";

let totalU = 0;
const margin = { top: 10, left: 20, bottom: 10, right: 20 };

d3.csv("unemployment.csv", d3.autoType).then((data) => {
	data.map((d) => {
		for (const [key, value] of Object.entries(d)) {
			if (key != "date") totalU += value;
		}
		d.total = totalU;
		totalU = 0;
	});
	const areaChart = AreaChart(".chart2");

	areaChart.on("brushed", (range) => {
		stackedAreaChart.filterByDate(range); // coordinating with stackedAreaChart
	});

	const stackedAreaChart = StackedAreaChart(".chart1");

	stackedAreaChart.update(data);
	areaChart.update(data);
});
