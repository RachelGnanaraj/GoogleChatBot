'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var customFormats = module.exports = function(zSchema) {
  // Placeholder file for all custom-formats in known to swagger.json
  // as found on
  // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

  var decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;

  /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
  zSchema.registerFormat('double', function(val) {
    return !decimalPattern.test(val.toString());
  });

  /** Validates value is a 32bit integer */
  zSchema.registerFormat('int32', function(val) {
    // the 32bit shift (>>) truncates any bits beyond max of 32
    return Number.isInteger(val) && ((val >> 0) === val);
  });

  zSchema.registerFormat('int64', function(val) {
    return Number.isInteger(val);
  });

  zSchema.registerFormat('float', function(val) {
    // better parsing for custom "float" format
    if (Number.parseFloat(val)) {
      return true;
    } else {
      return false;
    }
  });

  zSchema.registerFormat('date', function(val) {
    // should parse a a date
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('dateTime', function(val) {
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('password', function(val) {
    // should parse as a string
    return typeof val === 'string';
  });
};

customFormats(ZSchema);

var validator = new ZSchema({});
var supertest = require('supertest');
var api = supertest('http://localhost:10010'); // supertest init;
var expect = chai.expect;

describe('/webhook', function() {
  describe('post', function() {

    it('should respond with default Error', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "message"
        ],
        "properties": {
          "message": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.post('/webhook')
      .set('Content-Type', 'application/json')
      .send({
        
      })
      .expect({
        "message": "Response validation failed: invalid content type (text/plain).  These are valid: application/json",
        "failedValidation": true
      })
      .end(function(err, res) {
        if (err) return done(err);

        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });
    });

    it('should return directions with string from and to points', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "speech",
          "displayText",
          "source"
        ],
        "properties": {
          "speech": {
            "type": "string"
          },
          "displayText": {
            "type": "string"
          },
          "source": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.post('/webhook')
      .set('Content-Type', 'application/json')
      .send({
          "id": "222a8b96-374d-4ecd-b8a3-3b754b691d8b",
          "timestamp": "2017-05-20T13:35:06.006Z",
          "lang": "en",
          "result": {
              "source": "agent",
              "resolvedQuery": "Show me weather in Chennai",
              "speech": "",
              "action": "navigation.directions",
              "actionIncomplete": false,
              "parameters": {
                "from": "1600 Amphitheatre Parkway, Mountain View, CA",
                "to": "1500 Charleston Rd, Mountain View, CA 94043, USA"
              },
              "contexts": [],
              "metadata": {
                "intentId": "f59f4d20-6d45-4123-830f-72e801a85468",
                "webhookUsed": "true",
                "webhookForSlotFillingUsed": "false",
                "intentName": "Weather Intent"
              },
              "fulfillment": {
                "speech": "",
                "messages": [
                    {
                      "type": 0,
                      "speech": ""
                    }
                ]
              },
              "score": 1
          },
          "status": {
              "code": 200,
              "errorType": "success"
          },
          "sessionId": "688d71f5-f512-404e-a7f9-1e05d44a97a1"
        })
      .expect({
        "displayText": "Step 1: Head east on Amphitheatre Pkwy toward Bill Graham Pkwy (0.4 mi/1 min)\nStep 2: Turn right onto N Shoreline Blvd (0.2 mi/1 min)\nStep 3: Turn right at the 1st cross street onto Charleston RdDestination will be on the right (0.2 mi/1 min)\n",
        "source": "apiai-weather-webhook-sample",
        "speech": "Step 1: Head east on Amphitheatre Pkwy toward Bill Graham Pkwy (0.4 mi/1 min)\nStep 2: Turn right onto N Shoreline Blvd (0.2 mi/1 min)\nStep 3: Turn right at the 1st cross street onto Charleston RdDestination will be on the right (0.2 mi/1 min)\n"
      })
      .end(function(err, res) {
        if (err) return done(err);
        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });

      setTimeout(done, 2000);
    });


    it('should return directions with object from and to points', function(done) {
      /*eslint-disable*/
      var schema = {
        "required": [
          "speech",
          "displayText",
          "source"
        ],
        "properties": {
          "speech": {
            "type": "string"
          },
          "displayText": {
            "type": "string"
          },
          "source": {
            "type": "string"
          }
        }
      };

      /*eslint-enable*/
      api.post('/webhook')
      .set('Content-Type', 'application/json')
      .send({
            "id": "222a8b96-374d-4ecd-b8a3-3b754b691d8b",
          "timestamp": "2017-05-20T13:35:06.006Z",
          "lang": "en",
          "result": {
              "source": "agent",
              "resolvedQuery": "Show me weather in Chennai",
              "speech": "",
              "action": "navigation.directions",
              "actionIncomplete": false,
              "parameters": {
                "from": {"country":"United States of America",
                  "admin-area":"New York",
                  "business-name":"Baxter Building",
                  "city":"New York",
                  "street-address":"42nd St",
                  "zip-code":"10036"
                },
                "to": "245 Park Ave, New York, NY 10167, USA"
              },
              "contexts": [],
              "metadata": {
                "intentId": "f59f4d20-6d45-4123-830f-72e801a85468",
                "webhookUsed": "true",
                "webhookForSlotFillingUsed": "false",
                "intentName": "Weather Intent"
              },
              "fulfillment": {
                "speech": "",
                "messages": [
                    {
                      "type": 0,
                      "speech": ""
                    }
                ]
              },
              "score": 1
          },
          "status": {
              "code": 200,
              "errorType": "success"
          },
          "sessionId": "688d71f5-f512-404e-a7f9-1e05d44a97a1"
          })
      .expect({
        "displayText": "Step 1: Head northeast on Madison Ave toward E 43rd St (0.3 mi/2 mins)\nStep 2: Turn right onto E 48th St (0.2 mi/2 mins)\nStep 3: Turn right at the 2nd cross street onto Lexington Ave (266 ft/1 min)\nStep 4: Turn right at the 1st cross street onto E 47th StDestination will be on the left (177 ft/1 min)\n",
        "source": "apiai-weather-webhook-sample",
        "speech": "Step 1: Head northeast on Madison Ave toward E 43rd St (0.3 mi/2 mins)\nStep 2: Turn right onto E 48th St (0.2 mi/2 mins)\nStep 3: Turn right at the 2nd cross street onto Lexington Ave (266 ft/1 min)\nStep 4: Turn right at the 1st cross street onto E 47th StDestination will be on the left (177 ft/1 min)\n"
      })
      .end(function(err, res) {
        if (err) return done(err);
        expect(validator.validate(res.body, schema)).to.be.true;
        done();
      });

      setTimeout(done, 2000);
    });

      it('should return total distance between the origin and destination', function(done) {
          /*eslint-disable*/
          var schema = {
              "required": [
                  "speech",
                  "displayText",
                  "source"
              ],
              "properties": {
                  "speech": {
                      "type": "string"
                  },
                  "displayText": {
                      "type": "string"
                  },
                  "source": {
                      "type": "string"
                  }
              }
          };

          /*eslint-enable*/
          api.post('/webhook')
              .set('Content-Type', 'application/json')
              .send({
                  "id": "222a8b96-374d-4ecd-b8a3-3b754b691d8b",
                  "timestamp": "2017-05-20T13:35:06.006Z",
                  "lang": "en",
                  "result": {
                      "source": "agent",
                      "speech": "",
                      "action": "navigation.distance",
                      "actionIncomplete": false,
                      "parameters": {
                          "from": "1600 Amphitheatre Parkway, Mountain View, CA",
                          "to": "1500 Charleston Rd, Mountain View, CA 94043, USA"
                      },
                      "contexts": [],
                      "metadata": {
                          "intentId": "f59f4d20-6d45-4123-830f-72e801a85468",
                          "webhookUsed": "true",
                          "webhookForSlotFillingUsed": "false",
                          "intentName": "Navigation"
                      },
                      "fulfillment": {
                          "speech": "",
                          "messages": [
                              {
                                  "type": 0,
                                  "speech": ""
                              }
                          ]
                      },
                      "score": 1
                  },
                  "status": {
                      "code": 200,
                      "errorType": "success"
                  },
                  "sessionId": "688d71f5-f512-404e-a7f9-1e05d44a97a1"
              })
              .expect({
                  "displayText": "The total distance is 0.8 mi",
                  "source": "apiai-weather-webhook-sample",
                  "speech": "The total distance is 0.8 mi"
              })
              .end(function(err, res) {
                  if (err) return done(err);
                  expect(validator.validate(res.body, schema)).to.be.true;
                  done();
              });

          setTimeout(done, 2000);
      });

      it('should return the time taken between the origin and destination', function(done) {
          /*eslint-disable*/
          var schema = {
              "required": [
                  "speech",
                  "displayText",
                  "source"
              ],
              "properties": {
                  "speech": {
                      "type": "string"
                  },
                  "displayText": {
                      "type": "string"
                  },
                  "source": {
                      "type": "string"
                  }
              }
          };

          /*eslint-enable*/
          api.post('/webhook')
              .set('Content-Type', 'application/json')
              .send({
                  "id": "222a8b96-374d-4ecd-b8a3-3b754b691d8b",
                  "timestamp": "2017-05-20T13:35:06.006Z",
                  "lang": "en",
                  "result": {
                      "source": "agent",
                      "speech": "",
                      "action": "navigation.time",
                      "actionIncomplete": false,
                      "parameters": {
                          "from": "1600 Amphitheatre Parkway, Mountain View, CA",
                          "to": "1500 Charleston Rd, Mountain View, CA 94043, USA"
                      },
                      "contexts": [],
                      "metadata": {
                          "intentId": "f59f4d20-6d45-4123-830f-72e801a85468",
                          "webhookUsed": "true",
                          "webhookForSlotFillingUsed": "false",
                          "intentName": "Navigation"
                      },
                      "fulfillment": {
                          "speech": "",
                          "messages": [
                              {
                                  "type": 0,
                                  "speech": ""
                              }
                          ]
                      },
                      "score": 1
                  },
                  "status": {
                      "code": 200,
                      "errorType": "success"
                  },
                  "sessionId": "688d71f5-f512-404e-a7f9-1e05d44a97a1"
              })
              .expect({
                  "displayText": " It takes 3 mins to reach ",
                  "source": "apiai-weather-webhook-sample",
                  "speech": " It takes 3 mins to reach "
              })
              .end(function(err, res) {
                  if (err) return done(err);
                  expect(validator.validate(res.body, schema)).to.be.true;
                  done();
              });

          setTimeout(done, 2000);
      });






  });

});

