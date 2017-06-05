'use strict';

var StringBuilder = require('stringbuilder')
StringBuilder.extend('string');
var apiai = require("apiai");
const uuidV1 = require('uuid/v1');
var util = require('util');
var stringify = require('node-stringify');
var async = require("async");
var GoogleLocations = require('google-locations');
var locations = new GoogleLocations('AIzaSyCOz13wwpDgZZG1ePVqHwRCTvi7xK7wfik');
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCOz13wwpDgZZG1ePVqHwRCTvi7xK7wfik'
});

var map = require('google_directions');
var place_types = [
    "accounting",
    "airport",
    "amusement_park",
    "aquarium",
    "art_gallery",
    "atm",
    "bakery",
    "bank",
    "bar",
    "beauty_salon",
    "bicycle_store",
    "book_store",
    "bowling_alley",
    "bus_station",
    "cafe",
    "campground",
    "car_dealer",
    "car_rental",
    "car_repair",
    "car_wash",
    "casino",
    "cemetery",
    "church",
    "city_hall",
    "clothing_store",
    "convenience_store",
    "courthouse",
    "dentist",
    "department_store",
    "doctor",
    "electrician",
    "electronics_store",
    "embassy",
    "establishment (deprecated)",
    "finance (deprecated)",
    "fire_station",
    "florist",
    "food (deprecated)",
    "funeral_home",
    "furniture_store",
    "gas_station",
    "general_contractor (deprecated)",
    "grocery_or_supermarket (deprecated)",
    "gym",
    "hair_care",
    "hardware_store",
    "health (deprecated)",
    "hindu_temple",
    "home_goods_store",
    "hospital",
    "insurance_agency",
    "jewelry_store",
    "laundry",
    "lawyer",
    "library",
    "liquor_store",
    "local_government_office",
    "locksmith",
    "lodging",
    "meal_delivery",
    "meal_takeaway",
    "mosque",
    "movie_rental",
    "movie_theater",
    "moving_company",
    "museum",
    "night_club",
    "painter",
    "park",
    "parking",
    "pet_store",
    "pharmacy",
    "physiotherapist",
    "place_of_worship (deprecated)",
    "plumber",
    "police",
    "post_office",
    "real_estate_agency",
    "restaurant",
    "roofing_contractor",
    "rv_park",
    "school",
    "shoe_store",
    "shopping_mall",
    "spa",
    "stadium",
    "storage",
    "store",
    "subway_station",
    "synagogue",
    "taxi_stand",
    "train_station",
    "transit_station",
    "travel_agency",
    "university",
    "veterinary_care",
    "zoo"
];
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

var stringify = require('node-stringify');

var app = apiai("f1dd2ce5218c479d8674a030a26e2865");
let session = uuidV1();

var options = {
    sessionId: session
};

module.exports = {
    webhook: webhook
};

function getLocationString(location) {
    if(typeof location === 'string' || location instanceof String) {
        return location
    }

    return String.format('{0} {1} {2} {3} {4} {5}',
        location['business-name'],
        location['street-address'],
        location['city'],
        location['zip-code'],
        location['country']).trim().replace(" ", "_");
}

function webhook(req, res) {

    if(isEmptyObject(req.body)) {
        console.log("fail");
        res.status(500).send()
        return
    }

    var result = {};
    var array_results = []

    async.series([
        //Load user to get `userId` first
        function(callback) {

            if(req['body']['result']['action'] == 'navigation.directions') {
                var paramInfo = req['body']['result']['parameters'];
                params.origin = getLocationString(paramInfo['from']);
                params.destination = getLocationString(paramInfo['to']);
                console.log("Destination: " + params.destination)
                if(place_types.indexOf(params.destination.toLowerCase()) >= 0) {
                    var place_type = params.destination.toLowerCase()

                    locations.search({
                        location: [1.290842, 103.776356],
                        radius: 1000,
                        language: 'en',
                        rankby: 'prominence',
                        types: [place_type]
                    }, function(err, response) {
                        // console.log("search: ", response.results);

                        array_results = response.results
                        callback();
                    });
                } else {
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

                            output = String.format('{0}Step {1}: {2} ({3}/{4})\n\n',
                                output,
                                stepCounter,
                                instruction,
                                distance,
                                duration);

                            stepCounter++;
                        });
                        result = output;

                        callback();
                    });
                }
            }

            else if(req['body']['result']['action'] == 'navigation.distance')
            {
                var paramInfo = req['body']['result']['parameters'];
                params.origin = getLocationString(paramInfo['from']);
                params.destination = getLocationString(paramInfo['to']);

                console.log(params.origin + ' - ' + params.destination)

                map.getDistance(params, function (err, data) {
                    if (err) {
                        console.log(err);
                        return 1;
                    }
                    console.log("The total distance is "+data);
                    var output = "The total distance is ";
                    result = output +data;

                    callback();
                });
            }

            else
            {
                var paramInfo = req['body']['result']['parameters'];
                params.origin = getLocationString(paramInfo['from']);
                params.destination = getLocationString(paramInfo['to']);
                console.log(params.origin + ' - ' + params.destination)

                map.getDuration(params, function (err, data) {
                    if (err) {
                        console.log(err);
                        return 1;
                    }
                    console.log("It takes "+data +" to reach ");
                    var output = " It takes "+data +" to reach ";
                    result = output;

                    callback();
                });

            }
        }
    ], function(err) {
        if (err) return next(err);
        console.log("finish " + stringify(result))


        if(array_results.length > 0) {
            var response = {
                "messages": [
                    {
                        "type": 1,
                        "platform": "skype",
                        "title": "Where do you want to go ?",
                        "buttons" : [

                        ]
                    }
                ]
            }

            var max_length = array_results.length > 5 ? 5 : array_results.length;
            for(var i = 0; i < max_length; i++) {
                if(!array_results[i]["vicinity"].toLowerCase().includes(params.origin.toLowerCase())) {
                    response["messages"][0]["buttons"].push(
                        {
                            "text": array_results[i]["name"],
                            "postback": "get nearest directions from " + params.origin + " to " + array_results[i]["vicinity"]
                        }
                    )
                }

            }

            res.json(response)
        }
        else {
            console.log("search nearby")
            res.json({
                "messages": [
                    {
                        "type": 0,
                        "speech": result
                    }
                ]
            })
        }
    });
}

function isEmptyObject(obj) {
//   console.log("Length " + Object.keys(obj))
    return Object.keys(obj).length === 0;
}



