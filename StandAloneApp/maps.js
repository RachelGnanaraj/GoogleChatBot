var map = require('google_directions');

var params = {
    // REQUIRED
    origin: "1600 Amphitheatre Parkway, Mountain View, CA",
    destination: "1500 Charleston Rd, Mountain View, CA 94043, USA",
    key: "AIzaSyCOz13wwpDgZZG1ePVqHwRCTvi7xK7wfik",

    // OPTIONAL
    mode: "",
    avoid: "",
    language: "",
    units: "",
    region: "",
};

// get navigation steps as JSON object
map.getDirectionSteps(params, function (err, steps){
    if (err) {
        console.log(err);
        return 1;
    }

    // parse the JSON object of steps into a string output
    var output="";
    var stepCounter = 1;
    steps.forEach(function(stepObj) {
        var instruction = stepObj.html_instructions;
        instruction = instruction.replace(/<[^>]*>/g, ""); // regex to remove html tags
        var distance = stepObj.distance.text;
        var duration = stepObj.duration.text;
        output += "Step " + stepCounter + ": " + instruction + " ("+ distance +"/"+ duration+")\n";
        stepCounter++;
    });
    console.log(output);
});

//  get total distance as string
map.getDistance(params, function (err, data) {
    if (err) {
        console.log(err);
        return 1;
    }
    console.log("The total distance is "+data);
});

//  get total duration as string
map.getDuration(params, function (err, data) {
    if (err) {
        console.log(err);
        return 1;
    }
    console.log("It takes "+data +" to reach ");
});

