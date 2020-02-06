const dataPath = "data/data.csv";
const cancerCodesPath = "data/ICCC_codes.csv";

function createCheckBoxGroupForPeriodOfDiagnosisFilter(keyValuePairs) {
    let periodOfDiagnosisFieldSet = $("#periodOfDiagnosisFilter");
    let index = 0;
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            if (index == 0)
                periodOfDiagnosisFieldSet.append(`
                    <div class="filter">
                        <input type="checkbox" checked class="period-of-diagnosis-filter" value=${key}>${keyValuePairs[key]}
                    </div>
                `);
            else
                periodOfDiagnosisFieldSet.append(`
                    <div class="filter">
                        <input type="checkbox" class="period-of-diagnosis-filter" value=${key}>${keyValuePairs[key]}
                    </div>
                `);
            index++;
        }
    }
}

function createCheckBoxGroupForSexFilter(keyValuePairs) {
    let sexFieldSet = $("#sexFilter");
    let index = 0;
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            if (index == 0)
                sexFieldSet.append(`
                    <div class="filter">
                        <input type="checkbox" checked class="sex-filter" value=${key}>${keyValuePairs[key]}
                    </div>
                `);
            else
                sexFieldSet.append(`
                        <div class="filter">
                            <input type="checkbox" class="sex-filter" value=${key}>${keyValuePairs[key]}
                        </div>
                    `);
            index++;
        }
    }
}

function createCheckBoxGroupForAgeFilter(keyValuePairs) {
    let ageFieldSet = $("#ageFilter");
    let index = 0;
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            if (index == 0)
                ageFieldSet.append(`
                    <div class="filter">
                        <input type="checkbox" checked class="age-filter" value=${key}>${keyValuePairs[key]}
                    </div>
                `);
            else
                ageFieldSet.append(`
                    <div class="filter">
                        <input type="checkbox" class="age-filter" value=${key}>${keyValuePairs[key]}
                    </div>
                `);
            index++;
        }
    }
}

function populateCancerTypesDropdown(keyValuePairs) {
    let cancerTypeDropDown = $("#cancerTypeFilter");
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
                cancerTypeDropDown.append(`
                    <option value=${key}>${keyValuePairs[key]["EN"]}</option>
                `);
        }
    }
}

function populateMeasureDropdown(keyValuePairs) {
    let measureDropdown = $("#measureFilter");
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            measureDropdown.append(`
                <option value=${key}>${keyValuePairs[key]}</option>
            `);
        }
    }
}

d3.csv(dataPath, function(data) {
    // cancer type filter code
    let cancerTypeFilterMapping = {};
    d3.csv(cancerCodesPath, function(codes) {
        codes.forEach(function(value, i) {
            cancerTypeFilterMapping[value.ID] = {}
            cancerTypeFilterMapping[value.ID]['EN'] = value.NAME_EN;
            cancerTypeFilterMapping[value.ID]['FR'] = value.NAME_FR;
        });
        populateCancerTypesDropdown(cancerTypeFilterMapping);
    });
    
    const defaultPeriodOfDiagnosis = "A";
    const defaultSex = "B";
    const defaultAge = "A";

    let selectedPeriodOfDiagnosisList = [defaultPeriodOfDiagnosis];
    let selectedSexesList = [defaultSex];
    let selectedAgesList = [defaultAge];
    let selectedCancerType = 1;

    const combineCodes = function() {
        let firstLayer = [];
        for (let i=0; i<selectedPeriodOfDiagnosisList.length; i++) {
            firstLayer.push(selectedPeriodOfDiagnosisList[i]);
        }
        
        let secondLayer = [];
        for (let i=0; i<selectedSexesList.length; i++) {
            for (let k=0; k<firstLayer.length; k++) {
                secondLayer.push(firstLayer[k] + selectedSexesList[i]);
            }
        }

        let thirdLayer = [];
        for (let i=0; i<selectedAgesList.length; i++) {
            for (let k=0; k<secondLayer.length; k++) {
                thirdLayer.push(secondLayer[k] + selectedAgesList[i]);
            }
        }

        // adding the cancer codes at the end
        for (let i=0; i<thirdLayer.length; i++) {
            console.log(selectedCancerType)
            thirdLayer[i] += "B" + selectedCancerType.toString();
        }
        console.log("Filter codes: ", thirdLayer);
        return thirdLayer;
    };
    
    let graph = new Graph(data, document.getElementById("graph"));
    const updateLines = function(codes) {
        let lines = graph.lines.slice(0, graph.lines.length);

        // add extras
        for (let i=0; i<codes.length; i++) {
            if (!lines.includes(codes[i])) {
                graph.addLine(codes[i]);
            }
        }
        console.log("Lines in display (after addition):", graph.lines);

        // remove extras
        for (let i=0; i<lines.length;i++) {
            if (!codes.includes(lines[i])) {
                graph.removeLine(lines[i]);
            }
        }
        console.log("Lines in display (after removal):", graph.lines);
        console.log("Lines:", lines);
    };
    updateLines(combineCodes());
    $("#cancerTypeFilter").on("change", function(e) {
        selectedCancerType = this.value;
    });
    
    // measure filter code
    let measureFilterMapping = {
        "A": "Overall survival",
        "B": "Event-free survival",
        "C": "Cumulative incidence of relapse"
    };
    populateMeasureDropdown(measureFilterMapping);
    
    let selectedMeasure = $("#measureFilter").value;
    $('#measureFilter').on("change", function(e) {
        selectedMeasure = this.value;
        console.log("Selected measure: ", selectedMeasure);
    });

    // period of diagnosis filter code
    let periodOfDiagnosisFilterMapping = {
        "A": "All years",
        "E": "2001-2006",
        "M": "2007-2011",
        "L": "2012-2016"
    };
    createCheckBoxGroupForPeriodOfDiagnosisFilter(periodOfDiagnosisFilterMapping);


    $(".period-of-diagnosis-filter").on("change", function(e) {
        let value = this.value;
        if (this.checked) {
            selectedPeriodOfDiagnosisList.push(value);
        } else {
            if (selectedPeriodOfDiagnosisList.length == 1)
                this.checked = true;
            else
                selectedPeriodOfDiagnosisList.splice(selectedPeriodOfDiagnosisList.indexOf(value), 1);
        }
        updateLines(combineCodes());
        console.log("Period of Diagnosis selected: ", selectedPeriodOfDiagnosisList);
    });

    // sex filter code
    let sexFilterMapping = {
        "B": "Both",
        "M": "Male",
        "F": "Female"
    };
    createCheckBoxGroupForSexFilter(sexFilterMapping);
    
    $(".sex-filter").on("change", function(e) {
        let value = this.value;
        if (this.checked) {
            selectedSexesList.push(value);
        } else {
            if (selectedSexesList.length == 1)
                this.checked = true;
            else
                selectedSexesList.splice(selectedSexesList.indexOf(value), 1);
        }
        updateLines(combineCodes());
        console.log("Sexes selected: ", selectedSexesList);
    });

    // age filter code
    let ageFilterMapping = {
        "A": "All Ages",
        "B": "less than 1 year",
        "C": "1 to 4 years",
        "D": "5 to 9 years",
        "E": "10 to 14 years"
    };
    createCheckBoxGroupForAgeFilter(ageFilterMapping);

    $(".age-filter").on("change", function(e) {
        let value = this.value;
        if (this.checked) {
            selectedAgesList.push(value);
        } else {
            if (selectedAgesList.length == 1)
                this.checked = true;
            else
                selectedAgesList.splice(selectedAgesList.indexOf(value), 1);
        }
        updateLines(combineCodes());
        console.log("Ages selected: ", selectedAgesList);
    });

    // unknown codes for the moment...
    let extentOfDiseaseFilterMapping = {
        "B": "Both",
        "": "Metastatic disease",
        "": "Non-metastatic disease",
    };
    let selectedExtentOfDiseasesList = [];

    // unkown codes for the moment...
    let riskGroupFilterMapping = {
        "B": "Both",
        "": "Standard risk",
        "": "High risk"
    };
    let selectedRiskGroupsList = [];
});

class Graph {
    constructor(data, target, height=500, width=700) {
        this.data = data;
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
            if (d["_NAME_"] === "ATRISK")
                return 0;
            return d[filter];
        });
        let maxX = d3.max(this.data, function(d) {
            if (d["_NAME_"] === "ATRISK")
                return 0;
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

        console.log("Max: ", maxX);
        console.log("x of 60:", this.x(60));
    }

    addLine(filter) {
        this.lines.push(filter);
        let this_ = this;
        let lineGenerator = d3.line()
            .x(function(d, i) {
                return this_.x(d["survtime"]); 
            })
            .y(function(d, i) {
                return this_.y(d[filter]); 
            })
            .curve(d3.curveStep);
        
        
        
        let filteredDataForSurvival = this.data.filter(
            function(d){
                return d["_NAME_"] == "SURVIVAL";
            }
        );

        let line = lineGenerator(filteredDataForSurvival);
        

        let lineGroup = this.svg
            .append("g")
            .attr("class", "line")
            .attr("id", filter);
        
        lineGroup.append("path")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke-width", "2px")
            .style("stroke", "#2980b9")
    }

    removeLine(filter) {
        this.lines.splice(this.lines.indexOf(filter), 1);
        this.svg.select("#" + filter)
                .remove();
    }
}