const dataPath = "data/data.csv";

d3.csv(dataPath, function(csv) {
    let periodOfDiagnosisFilterMapping = {
        "All years": "",
        "2001-2006": "",
        "2007-2011": "",
        "2012-2016": ""
    };

    let sexFilterMapping = {
        "Both": "",
        "Male": "",
        "Female": ""
    };

    let ageFilterMapping = {
        "AllAges": "",
        "less than 1 year": "",
        "1 to 4 years": "",
        "5 to 9 years": "",
        "10 to 14 years": ""
    };

    let extentOfDiseaseFilterMapping = {
        "Both": "",
        "Metastatic disease": "",
        "Non-metastatic disease": "",
    };

    let riskGroupFilterMapping = {
        "Both": "",
        "Standard risk": "",
        "High risk": ""
    };

    console.log(csv);
});