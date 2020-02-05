const dataPath = "data/data.csv";
const cancerCodesPath = "data/ICCC_codes.csv";

function createCheckBoxGroupForPeriodOfDiagnosisFilter(keyValuePairs) {
    let periodOfDiagnosisFieldSet = $("#periodOfDiagnosisFilter");
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            periodOfDiagnosisFieldSet.append(`
                <div class="filter">
                    <input type="checkbox" class="period-of-diagnosis-filter" value=${key}>${keyValuePairs[key]}
                </div>
            `);
        }
    }
}

function createCheckBoxGroupForSexFilter(keyValuePairs) {
    let sexFieldSet = $("#sexFilter");
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            sexFieldSet.append(`
                <div class="filter">
                    <input type="checkbox" class="sex-filter" value=${key}>${keyValuePairs[key]}
                </div>
            `);
        }
    }
}

function createCheckBoxGroupForAgeFilter(keyValuePairs) {
    let ageFieldSet = $("#ageFilter");
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            ageFieldSet.append(`
                <div class="filter">
                    <input type="checkbox" class="age-filter" value=${key}>${keyValuePairs[key]}
                </div>
            `);
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
    
    let selectedCancerType = $("#cancerTypeFilter").value;
    $("#cancerTypeFilter").on("change", function(e) {
        selectedCancerType = this.value;
        console.log("Selected cancer type: ", selectedCancerType);
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
    
    let selectedPeriodOfDiagnosisList = [];
    $(".period-of-diagnosis-filter").on("change", function(e) {
        let value = this.value;
        if (this.checked) {
            selectedPeriodOfDiagnosisList.push(value);
        } else {
            selectedPeriodOfDiagnosisList.splice(selectedPeriodOfDiagnosisList.indexOf(value), 1);
        }
        console.log("Period of Diagnosis selected: ", selectedPeriodOfDiagnosisList);
    });

    // sex filter code
    let sexFilterMapping = {
        "B": "Both",
        "M": "Male",
        "F": "Female"
    };
    createCheckBoxGroupForSexFilter(sexFilterMapping);
    
    let selectedSexesList = [];
    $(".sex-filter").on("change", function(e) {
        let value = this.value;
        if (this.checked) {
            selectedSexesList.push(value);
        } else {
            selectedSexesList.splice(selectedSexesList.indexOf(value), 1);
        }
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

    let selectedAgesList = [];
    $(".age-filter").on("change", function(e) {
        let value = this.value;
        if (this.checked) {
            selectedAgesList.push(value);
        } else {
            selectedAgesList.splice(selectedAgesList.indexOf(value), 1);
        }
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
    
    let exampleFilter = "ABAB1";
    let graph = new Graph(data, document.getElementById("graph"));
    
    graph.addLine(exampleFilter);

});

class Graph {
    constructor(data, target, height=500, width=700) {
        this.data = data;
        this.confidenceIntervalsON = true;
        this.margin = { top: 25, right: 35, bottom: 60, left: 35 };
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;

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
        this.svg.remove("#" + filter);
    }
}