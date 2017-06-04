'use strict';

var StringBuilder = require('stringbuilder')
StringBuilder.extend('string');
var apiai = require("apiai");
const uuidV1 = require('uuid/v1');
var util = require('util');
var stringify = require('node-stringify');
var async = require("async");
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCOz13wwpDgZZG1ePVqHwRCTvi7xK7wfik'
});

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
        location['country']);
}

function webhook(req, res) {

  if(isEmptyObject(req.body)) {
    console.log("fail");
    res.status(500).send()
    return
  }

  var result = {};

  async.series([
        //Load user to get `userId` first
        function(callback) {
            console.log(req['body']['result']['action'])
            if(req['body']['result']['action'] == 'navigation.directions') {
                var paramInfo = req['body']['result']['parameters'];
                params.origin = getLocationString(paramInfo['from']);
                params.destination = getLocationString(paramInfo['to']);
                console.log(params.origin + ' AAAAAAAA ' + params.destination)
                
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
                        result = output;

                        callback();
                    });
            }

            else if(req['body']['result']['action'] == 'navigation.distance')
            {
                var paramInfo = req['body']['result']['parameters'];
                params.origin = getLocationString(paramInfo['from']);
                params.destination = getLocationString(paramInfo['to']);
                var destinationWork = getLocationString(paramInfo['to']['shortcut']);

                if(destinationWork === "work"){
                    params.destination = "25 Heng Mui Keng Terrace,Singapore 119615";
                }
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

        res.json({
              "speech": result,
              "displayText": result,
              "source": "apiai-weather-webhook-sample"
          })
    });
}

function isEmptyObject(obj) {
  console.log("Length " + Object.keys(obj))
  return Object.keys(obj).length === 0;
}



