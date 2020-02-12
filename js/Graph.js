class Graph {
    constructor(data, target, height=500, width=700) {
        this.data = data.filter(function(d) {
            return d["_NAME_"] == "SURVIVAL";
        });

        this.confidenceIntervalsON = true;
        this.margin = { top: 25, right: 35, bottom: 60, left: 35 };
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;
        this.lines = [];
        this.svg = d3.select(target)
                     .append("svg")
                     .attr("height", height + this.margin.top + this.margin.bottom)
                     .attr("width", width + this.margin.left + this.margin.right)
                     .append('g')
                     .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');
        
        this.svg.append('g')
                .attr("class", "y-axis");
        this.svg.append('g')
                .attr("class", "x-axis")
                .attr('transform', `translate(0, ${this.height})`);
        
        this.x = null;
        this.y = null;

        // default filter sequence
        this.changeScales("ABAB1");
    }
    
    turnOffConfidenceIntervals() {
        this.confidenceIntervalsON = false;
        d3.select(".interval")
            .style("display", "hidden");
    }

    turnOnConfidenceIntervals() {
        this.confidenceIntervalsON = false;
        d3.select(".interval")
            .style("display", "block");
    }

    changeScales(filter) {
        let maxY = d3.max(this.data, function(d) {
            return d[filter];
        });

        let maxX = d3.max(this.data, function(d) {
            return +d["survtime"] || 0;
        });

        this.y = d3.scaleLinear()
                   .domain([0, maxY])
                   .range([this.height, 0]);
        this.x = d3.scaleLinear()
                    .domain([0, maxX])
                    .range([0, this.width]);
        
        let xAxis = d3.axisBottom(this.x)
                    .ticks(5)
                    .tickSize(5)
                    .tickPadding(10);
        
        let yAxis = d3.axisLeft(this.y)
                    .ticks(5);

        this.svg.select(".y-axis")
                .transition()
                .duration(500)
                .call(yAxis);

        this.svg.select(".x-axis")
                .transition()
                .duration(500)
                .call(xAxis);
    }

    addLine(filter) {
        this.lines.push(filter);
        let this_ = this;
        let lineGenerator = d3.line()
            .defined(function(d) {
                return d[filter] != "" && !isNaN(d[filter]);
            })
            .x(function(d, i) {
                return this_.x(d["survtime"]); 
            })
            .y(function(d, i) {
                return this_.y(d[filter]); 
            })
            .curve(d3.curveStep);

        let filteredData = this.data.filter(lineGenerator.defined());
        let lineGroup = this.svg
            .append("g")
            .attr("class", "line")
            .attr("id", filter);
        
        lineGroup.append("path")
            .attr("d", lineGenerator(filteredData))
            .style("fill", "none")
            .style("stroke-width", "2px")
            .style("stroke", "#2980b9");
    }

    removeLine(filter) {
        this.lines.splice(this.lines.indexOf(filter), 1);
        this.svg.select("#" + filter)
                .remove();
    }
}