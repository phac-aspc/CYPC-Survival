const dataPath = "data/data.csv";
const cancerCodesPath = "data/ICCC_codes.csv";

function createCheckBoxGroupForPeriodOfDiagnosis(keyValuePairs) {
    let periodOfDiagnosisFieldSet = document.getElementById("periodOfDiagnosisFilter");
    for (let key in keyValuePairs) {
        if (keyValuePairs.hasOwnProperty(key)) {
            let checkBox = document.createElement("input");
            checkBox.setAttribute("type", "checkbox");
            checkBox.setAttribute("value", key);
            periodOfDiagnosisFieldSet.appendChild(checkBox);
        }
    }
}

d3.csv(dataPath, function(data) {
    let periodOfDiagnosisFilterMapping = {
        "A": "All years",
        "E": "2001-2006",
        "M": "2007-2011",
        "L": "2012-2016"
    };
    createCheckBoxGroupForPeriodOfDiagnosis(periodOfDiagnosisFilterMapping);
    let selectedPeriodOfDiagnosisList = [];

    let sexFilterMapping = {
        "B": "Both",
        "M": "Male",
        "F": "Female"
    };
    let selectedSexesList = [];

    let ageFilterMapping = {
        "A": "All Ages",
        "B": "less than 1 year",
        "C": "1 to 4 years",
        "D": "5 to 9 years",
        "E": "10 to 14 years"
    };
    let selectedAgesList = [];

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

    let cancerTypeFilterMapping = {};
    d3.csv(cancerCodesPath, function(codes) {
        codes.forEach(function(value, i) {
            cancerTypeFilterMapping[value.ID] = {}
            cancerTypeFilterMapping[value.ID]['EN'] = value.NAME_EN;
            cancerTypeFilterMapping[value.ID]['FR'] = value.NAME_FR;
        });
    });
    let selectedCancerTypesList = [];

    console.log(data);
});