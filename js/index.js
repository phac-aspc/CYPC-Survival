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
    populateMeasureDropdown(measureFilterMapping)
    
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
    console.log(data);
});