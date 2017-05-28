
'use strict';

var StringBuilder = require('stringbuilder')
StringBuilder.extend('string');
var weather = require('weather-js');
var apiai = require("apiai");
const uuidV1 = require('uuid/v1');
var util = require('util');
var stringify = require('node-stringify');
var async = require("async");


var stringify = require('node-stringify');

var app = apiai("f1dd2ce5218c479d8674a030a26e2865");
let session = uuidV1();

var options = {
    sessionId: session
};

var params = {
    // REQUIRED
    address: "San Francisco, CA",
    unit: "F"
};


module.exports = {
    webhookweather: webhookweather
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

function webhookweather(req, res) {

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
            if(req['body']['result']['action'] == 'weather.temperature') {
                var paramInfo = req['body']['result']['parameters'];
                params.address = getLocationString(paramInfo['address']);
                console.log(params.address)

                weather.find({search: params.address, degreeType: 'F'}, function(err, output) {
                    if(err) console.log(err);
                    //console.log(JSON.stringify(result, null, 2));
                    console.log(output[0].current.temperature +output[0].location.degreetype );
                    console.log(output[0].current.skytext);
                    result = "The temperature is " +output[0].current.temperature +output[0].location.degreetype;
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



