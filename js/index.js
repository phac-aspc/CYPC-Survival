const dataPath = "data/data-feb21.csv";
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

function createCheckBoxGroupForExtentOfDisease(keyValuePairs) {
    let extentOfDiseaseFieldSet = $("#extentOfDiseaseFilter");
    let index = 0;

    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            if (index == 0)
                extentOfDiseaseFieldSet.append(`
                    <div class="filter">
                        <input type="checkbox" checked class="extent-of-disease-filter" value=${key}>${keyValuePairs[key]}
                    </div>
                `);
            else
                extentOfDiseaseFieldSet.append(`
                    <div class="filter">
                        <input type="checkbox" class="extent-of-disease-filter" value=${key}>${keyValuePairs[key]}
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

function populateMeasureTypesDropdown(keyValuePairs) {
    let measureDropdown = $("#measureFilter");
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            measureDropdown.append(`
                <option value=${key}>${keyValuePairs[key]}</option>
            `);
        }
    }
}
d3.csv("data/table.csv", function(tableData) {
    d3.csv(dataPath, function(data) {
        // cancer type filter codes
        let cancerTypeFilterMapping = {};
        d3.csv(cancerCodesPath, function(codes) {
            codes.forEach(function(value, i) {
                cancerTypeFilterMapping[value.ID] = {}
                cancerTypeFilterMapping[value.ID]['EN'] = value.NAME_EN;
                cancerTypeFilterMapping[value.ID]['FR'] = value.NAME_FR;
            });
            populateCancerTypesDropdown(cancerTypeFilterMapping);
        });

        const tableTitle = "One, three, and five-year $ and 95% confidence intervals.";
        const graphTitle = "Kaplan-Meier survival estimate and 95% confidence $";

        let measureFilterMapping = {
            "OS": "Overall survival",
            "EFS": "Event-free survival",
            "CIR": "Cumulative incidence of relapse"
        };

        let periodOfDiagnosisFilterMapping = {
            "A": "All years",
            "E": "2001-2006",
            "M": "2007-2011",
            "L": "2012-2016"
        };

        let sexFilterMapping = {
            "B": "Both",
            "M": "Male",
            "F": "Female"
        };

        let ageFilterMapping = {
            "A": "All Ages",
            "B": "less than 1 year",
            "C": "1 to 4 years",
            "D": "5 to 9 years",
            "E": "10 to 14 years"
        };

        let riskGroupFilterMapping = {
            "B": "Both",
            "": "Standard risk",
            "": "High risk"
        };

        let extentOfDiseaseFilterMapping = {
            "B": "Both",
            "M": "Metastatic disease",
            "N": "Non-metastatic disease",
        };

        const defaultCancerType = 1;
        const defaultMeasureType = "OS";
        const defaultPeriodOfDiagnosis = "A";
        const defaultSex = "B";
        const defaultAge = "A";
        const defaultExtentOfDisease = "B";

        let selectedCancerType = defaultCancerType;
        let selectedMeasure = defaultMeasureType;
        let selectedPeriodOfDiagnosisList = [defaultPeriodOfDiagnosis];
        let selectedSexesList = [defaultSex];
        let selectedAgesList = [defaultAge];
        let selectedExtentOfDiseasesList = [defaultExtentOfDisease];
        let selectedRiskGroupsList = [];

        populateMeasureTypesDropdown(measureFilterMapping);
        createCheckBoxGroupForPeriodOfDiagnosisFilter(periodOfDiagnosisFilterMapping);
        createCheckBoxGroupForSexFilter(sexFilterMapping);
        createCheckBoxGroupForAgeFilter(ageFilterMapping);
        createCheckBoxGroupForExtentOfDisease(extentOfDiseaseFilterMapping);
        
        const combineCodes = function() {
            // adding the codes for selected period of diagnosis
            let firstLayer = [];
            for (let i=0; i<selectedPeriodOfDiagnosisList.length; i++) {
                firstLayer.push(selectedPeriodOfDiagnosisList[i]);
            }
            
            // adding the codes for selected sexes
            let secondLayer = [];
            for (let i=0; i<selectedSexesList.length; i++) {
                for (let k=0; k<firstLayer.length; k++) {
                    secondLayer.push(firstLayer[k] + selectedSexesList[i]);
                }
            }

            // adding the codes for selected ages
            let thirdLayer = [];
            for (let i=0; i<selectedAgesList.length; i++) {
                for (let k=0; k<secondLayer.length; k++) {
                    thirdLayer.push(secondLayer[k] + selectedAgesList[i]);
                }
            }

            // adding the codes for extent of disease
            let fourthLayer = [];
            for (let i=0; i<selectedExtentOfDiseasesList.length; i++) {
                for (let k=0; k<thirdLayer.length; k++) {
                    fourthLayer.push(thirdLayer[k] + selectedExtentOfDiseasesList[i]);
                }
            }

            // adding the cancer codes at the end
            for (let i=0; i<fourthLayer.length; i++) {
                fourthLayer[i] += selectedCancerType.toString();
            }

            return fourthLayer;
        };

        let filteredDataByMeasureType = data.filter(function(d) {
            return d["MEASURE"] == selectedMeasure;
        });
        
        let graph = new Graph(filteredDataByMeasureType, document.getElementById("graph"));
        graph.updateLines(combineCodes());
        
        // creating the table
        let table = d3.select("#table")
            .append("table")
            .attr("class", "table");

        let tableHead = table.append("thead")
            .append("tr");
        tableHead.append("th")
            .text("Period of Diagnosis");
        tableHead.append("th")
            .text("Age Group (in years)");
        tableHead.append("th")
            .text("Sex");
        tableHead.append("th")
            .text("Extent of Disease or Risk Category");
        
        tableHead.append("th")
            .text("Time (in years)");
        
        tableHead.append("th")
            .text("OSP");
        tableHead.append("th")
            .text("Lower CI");
        tableHead.append("th")
            .text("Upper CI");

        const updateTable = function() {
            let codes = combineCodes();
            table.select("tbody").remove();
            $("#table-title").text(tableTitle.replace("$", measureFilterMapping[selectedMeasure]));
            let tableBody = table.append("tbody");
            for (let i=0; i<codes.length; i++) {
                let codesArray = codes[i].split("");

                let tableRow = tableBody.append("tr");
                tableRow.append("td").attr("rowspan", "4").text(periodOfDiagnosisFilterMapping[codesArray[0]]);
                tableRow.append("td").attr("rowspan", "4").text(ageFilterMapping[codesArray[2]]);
                tableRow.append("td").attr("rowspan", "4").text(sexFilterMapping[codesArray[1]]);
                tableRow.append("td").attr("rowspan", "4").text("Extent here");

                let filteredTableData = tableData.filter(function(d) {
                    return d.measure === "OS";
                });

                let valueRow1 = tableBody.append("tr");
                let valueRow2 = tableBody.append("tr");
                let valueRow3 = tableBody.append("tr");
                
                let year1FilteredData = filteredTableData.filter(function(d) {
                    return d["year_followup"] == "1";
                });
                valueRow1.append("td").text("1");
                
                valueRow1.append("td").text(year1FilteredData.filter(function(d) {
                    return d["indicatorCode"] == "OSP";
                })[0][codes[i]]);
                
                valueRow1.append("td").text(year1FilteredData.filter(function(d) {
                    return d["indicatorCode"] == "L_C";
                })[0][codes[i]]);
                
                valueRow1.append("td").text(year1FilteredData.filter(function(d) {
                    return d["indicatorCode"] == "U_C";
                })[0][codes[i]]);

                let year3FilteredData = filteredTableData.filter(function(d) {
                    return d["year_followup"] == "3";
                });
                valueRow2.append("td").text("3");
                valueRow2.append("td").text(year3FilteredData.filter(function(d) {
                    return d["indicatorCode"] == "OSP";
                })[0][codes[i]]);
                valueRow2.append("td").text(year3FilteredData.filter(function(d) {
                    return d["indicatorCode"] == "L_C";
                })[0][codes[i]]);
                valueRow2.append("td").text(year1FilteredData.filter(function(d) {
                    return d["indicatorCode"] == "U_C";
                })[0][codes[i]]);

                let year5FilteredData = filteredTableData.filter(function(d) {
                    return d["year_followup"] == "5";
                });
                
                console.log(year5FilteredData);
                valueRow3.append("td").text("5");
                valueRow3.append("td").text(year5FilteredData.filter(function(d) {
                    return d["indicatorCode"] == "OSP";
                })[0][codes[i]]);
                valueRow3.append("td").text(year5FilteredData.filter(function(d) {
                    return d["indicatorCode"] == "L_C";
                })[0][codes[i]]);
                valueRow3.append("td").text(year5FilteredData.filter(function(d) {
                    return d["indicatorCode"] == "U_C";
                })[0][codes[i]]);

                console.log(filteredTableData);
                console.log(codes[i]);
            }
        };
        updateTable();
        $('#measureFilter').on("change", function(e) {
            selectedMeasure = this.value;
            updateTable();
            console.log(selectedMeasure);
            filteredDataByMeasureType = data.filter(function(d) {
                return d["MEASURE"] == selectedMeasure;
            });
            graph.changeMeasure(filteredDataByMeasureType);
            
        });

        $("#cancerTypeFilter").on("change", function(e) {
            selectedCancerType = this.value;
            graph.updateLines(combineCodes());
        });

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
            updateTable();
            graph.updateLines(combineCodes());
        });

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
            updateTable();
            graph.updateLines(combineCodes());
        });

        $(".extent-of-disease-filter").on("change", function(e) {
            let value = this.value;
            if (this.checked) {
                selectedExtentOfDiseasesList.push(value);
            } else {
                if (selectedExtentOfDiseasesList.length == 1)
                    this.checked = true;
                else
                    selectedExtentOfDiseasesList.splice(selectedExtentOfDiseasesList.indexOf(value), 1);
            }
            updateTable();
            graph.updateLines(combineCodes());
        });

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
            updateTable();
            graph.updateLines(combineCodes());
        });

        $("#CIToggle").on("click", function(e) {
            graph.toggleConfidenceIntervals();
            $("#ciON").text(graph.confidenceIntervalsON ? "ON" : "OFF");
        });
    });
});