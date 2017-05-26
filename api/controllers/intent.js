'use strict';

// var apiai = require("apiai");
// const uuidV1 = require('uuid/v1');
// var util = require('util');
// var googleMapsClient = require('@google/maps').createClient({
//   key: 'AIzaSyCOz13wwpDgZZG1ePVqHwRCTvi7xK7wfik'
// });

// var stringify = require('node-stringify');

// var app1 = apiai("f1dd2ce5218c479d8674a030a26e2865");
// let session = uuidV1();

// var options = {
//     sessionId: session
// };

module.exports = {
  getAnswer: getAnswer
};

// function getGeoCode(address, callback) {
//   googleMapsClient.geocode({
//         address: '1600 Amphitheatre Parkway, Mountain View, CA'
//       }, function(err, response) {

//         if (!err) {
//           console.log("asdfasdf1" + stringify(response.json));
//           callback(response.json.results[0].geometry.location);
//         }
//         else {
//           console.log("asdfasdf2" + err);
//         }

//       });
// }

function getAnswer(req, res) {
  // var name = req.swagger.params.question.value || 'stranger';
  // var hello = util.format('Hello, %s!', name);

  // var request = app1.textRequest(name, options);

  // request.on('response', function(response) {
  //     console.log(response);

  //     getGeoCode('1600 Amphitheatre Parkway, Mountain View, CA', function(location) {

  //         googleMapsClient.directions({
  //           origin: location,
  //           destination: [37.4224764,  -122.0842499] 
  //         }, function(err, response) {

  //           if (!err) {

  //             console.log("asdfasdf1" + stringify(response.json));
  //             res.json(hello + "asdfasdf12" +  response.json.results[0].address_components);
  //           }
  //           else {
  //             console.log("asdfasdf2" + err);
  //           }

  //         });
  //     });
      
  // });

  // request.on('error', function(error) {
  //     console.log(error);
  // });

  // request.end();
}




