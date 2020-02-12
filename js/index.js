const dataPath = "data/data-feb10.csv";
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
    const defaultExtentOfDisease = "B";

    let selectedPeriodOfDiagnosisList = [defaultPeriodOfDiagnosis];
    let selectedSexesList = [defaultSex];
    let selectedAgesList = [defaultAge];
    let selectedExtentOfDiseasesList = [defaultExtentOfDisease];
    let selectedCancerType = 1;

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
            console.log(selectedCancerType)
            fourthLayer[i] += selectedCancerType.toString();
        }

        console.log("Filter codes: ", thirdLayer);
        return fourthLayer;
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

        // remove extras
        for (let i=0; i<lines.length;i++) {
            if (!codes.includes(lines[i])) {
                graph.removeLine(lines[i]);
            }
        }
        
        console.log("Lines on the display:", graph.lines);
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
    });

    let extentOfDiseaseFilterMapping = {
        "B": "Both",
        "M": "Metastatic disease",
        "N": "Non-metastatic disease",
    };
    createCheckBoxGroupForExtentOfDisease(extentOfDiseaseFilterMapping);

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

        updateLines(combineCodes());
    });

    // unkown codes for the moment...
    let riskGroupFilterMapping = {
        "B": "Both",
        "": "Standard risk",
        "": "High risk"
    };
    let selectedRiskGroupsList = [];
});