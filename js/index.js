const dataPath = "data/data.csv";

d3.csv(dataPath, function(csv) {
    console.log(csv);
});