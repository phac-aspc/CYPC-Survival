class Graph {
    constructor(data, target, height=500, width=700) {
        this.data = data.filter(function(d) {
            return d["_NAME_"] == "SURVIVAL";
        });

        this.colorBank = [
            d3.rgb(57, 106, 177),
            d3.rgb(218, 124, 48),
            d3.rgb(62, 150, 81),
            d3.rgb(204, 37, 41),
            d3.rgb(83, 81, 84),
            d3.rgb(107, 76, 154),
            d3.rgb(146, 36, 40),
            d3.rgb(148, 139, 61)
        ];

        this.colorMapping = {};

        this.upperLimitData = data.filter(function(d) {
            return d["_NAME_"] == "EP_UCL";
        });

        this.lowerLimitData = data.filter(function(d) {
            return d["_NAME_"] == "EP_LCL";
        });

        this.confidenceIntervalsON = true;
        this.margin = { top: 25, right: 35, bottom: 60, left: 35 };
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;
        this.lines = [];
        this.svg = d3.select(target)
                     .append("svg")
                     .attr("id", "svg")
                     .attr("height", height + this.margin.top + this.margin.bottom)
                     .attr("width", width + this.margin.left + this.margin.right)
                     .append('g')
                     .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')');        
        this.svg.append('g')
                .attr("class", "y-axis");
        this.svg.append('g')
                .attr("class", "x-axis")
                .attr('transform', `translate(0, ${this.height})`);
        
        this.svg.append('g')
                .attr('class', 'lines');

        this.svg.append('g')
                .attr('class', 'intervals');

        this.x = null;
        this.y = null;

        // default filter sequence
        this.changeScales("ABAB1");
    }

    toggleConfidenceIntervals() {
        this.confidenceIntervalsON = !this.confidenceIntervalsON;
        d3.selectAll(".interval")
            .style("opacity", this.confidenceIntervalsON ? 0.2 : 0);
    }

    changeScales(filter) {
        let maxY = d3.max(this.data, function(d) {
            return d[filter];
        });

        let minY = 0;
        let maxX = d3.max(this.data, function(d) {
            return +d["survtime"] || 0;
        });

        this.y = d3.scaleLinear()
                   .domain([minY, maxY])
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

    addConfidenceInterval(filter) {
        let intervalsGroup = d3.select(".intervals");
        let areaValues = [];
        let this_ = this;

        for (let i=0; i<this.upperLimitData.length; i++) {
            areaValues.push({
                'x': +this.lowerLimitData[i]["survtime"],
                'lower': +this.lowerLimitData[i][filter], 
                'upper': +this.upperLimitData[i][filter]
            });
        }

        let areaGenerator = d3.area()
                              .x(function(d) {
                                  return this_.x(d["x"]);
                              })
                              .y0(function(d) {
                                  return this_.y(d["lower"]);
                              })
                              .y1(function(d) {
                                  return this_.y(d["upper"]);
                              })
                              .curve(d3.curveStep);

        let filteredData = areaValues.filter(function(d) {
            return !isNaN(d["x"]) && d["lower"] != "" && d["upper"] != "";
        });

        intervalsGroup.append("path")
                 .attr("class", "interval " + filter)
                 .attr("d", areaGenerator(filteredData))
                 .style("fill", this.colorMapping[filter])
                 .style("opacity", this.confidenceIntervalsON ? 0.2 : 0)
                 .style("stroke-width", "2px");
    }

    updateLines(codes) {
        // add extras
        for (let i=0; i<codes.length; i++) {
            if (!this.lines.includes(codes[i])) {
                this.addLine(codes[i]);
            }
        }

        // remove extras
        for (let i=0; i<this.lines.length;i++) {
            if (!codes.includes(this.lines[i])) {
                this.removeLine(this.lines[i]);
            }
        }
    }

    addLine(filter) {
        let this_ = this;
        
        this_.lines.push(filter);
        this_.colorMapping[filter] = this.colorBank.pop();

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
        
        this.svg.select(".lines")
            .append("path")
            .attr("d", lineGenerator(filteredData))
            .style("fill", "none")
            .attr("class", "line-path " + filter)
            .style("stroke-width", "2px")
            .style("stroke", this.colorMapping[filter]);

        this.addConfidenceInterval(filter);
    }

    removeLine(filter) {
        this.lines.splice(this.lines.indexOf(filter), 1);
        this.svg.selectAll("." + filter).remove();
        
        this.colorBank.push(this.colorMapping[filter]);
        delete this.colorMapping[filter];
    }

    changeMeasure(newData) {
        let this_ = this;

        this_.data = newData.filter(function(d) {
            return d["_NAME_"] == "SURVIVAL";
        });

        this_.upperLimitData = newData.filter(function(d) {
            return d["_NAME_"] == "EP_UCL";
        });

        this_.lowerLimitData = newData.filter(function(d) {
            return d["_NAME_"] == "EP_LCL";
        });

        for (let lineName of this.lines) {
            this_.changeScales(lineName);
            let lineGenerator = d3.line()
                                .defined(function(d) {
                                    return d[lineName] != "" && !isNaN(d[lineName]);
                                })
                                .x(function(d, i) {
                                    return this_.x(d["survtime"]); 
                                })
                                .y(function(d, i) {
                                    return this_.y(d[lineName]); 
                                })
                                .curve(d3.curveStep);
            let filteredData = this_.data.filter(lineGenerator.defined());
            
            let areaValues = [];
            for (let i=0; i<this_.upperLimitData.length; i++) {
                areaValues.push({
                    'x': +this_.lowerLimitData[i]["survtime"],
                    'lower': +this_.lowerLimitData[i][lineName], 
                    'upper': +this_.upperLimitData[i][lineName]
                });
            }
    
            let areaGenerator = d3.area()
                                  .x(function(d) {
                                      return this_.x(d["x"]);
                                  })
                                  .y0(function(d) {
                                      return this_.y(d["lower"]);
                                  })
                                  .y1(function(d) {
                                      return this_.y(d["upper"]);
                                  })
                                  .curve(d3.curveStep);
            
            let filteredAreaValues = areaValues.filter(function(d) {
                return !isNaN(d["x"]) && d["lower"] != "" && d["upper"] != "";
            });

            d3.select(".lines")
              .select("." + lineName)
              .transition()
              .duration(500)
              .attr("d", lineGenerator(filteredData));
            
            d3.select(".intervals")
                .select("." + lineName)
                .transition()
                .duration(500)
                .attr("d", areaGenerator(filteredAreaValues));
        }
    }
}