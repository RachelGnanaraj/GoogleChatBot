var weather = require('weather-js');

// Options:
// search:     location name or zipcode
// degreeType: F or C

weather.find({search: 'San Francisco, CA', degreeType: 'F'}, function(err, result) {
    if(err) console.log(err);
    //console.log(JSON.stringify(result, null, 2));
    console.log(result[0].current.temperature +result[0].location.degreetype );
    console.log(result[0].current.skytext);
});
