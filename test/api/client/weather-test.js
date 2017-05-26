//
// 'use strict';
// var chai = require('chai');
// var ZSchema = require('z-schema');
// var customFormats = module.exports = function(zSchema) {
//     // Placeholder file for all custom-formats in known to swagger.json
//     // as found on
//     // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat
//
//     var decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;
//
//     /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
//     zSchema.registerFormat('double', function(val) {
//         return !decimalPattern.test(val.toString());
//     });
//
//     /** Validates value is a 32bit integer */
//     zSchema.registerFormat('int32', function(val) {
//         // the 32bit shift (>>) truncates any bits beyond max of 32
//         return Number.isInteger(val) && ((val >> 0) === val);
//     });
//
//     zSchema.registerFormat('int64', function(val) {
//         return Number.isInteger(val);
//     });
//
//     zSchema.registerFormat('float', function(val) {
//         // better parsing for custom "float" format
//         if (Number.parseFloat(val)) {
//             return true;
//         } else {
//             return false;
//         }
//     });
//
//     zSchema.registerFormat('date', function(val) {
//         // should parse a a date
//         return !isNaN(Date.parse(val));
//     });
//
//     zSchema.registerFormat('dateTime', function(val) {
//         return !isNaN(Date.parse(val));
//     });
//
//     zSchema.registerFormat('password', function(val) {
//         // should parse as a string
//         return typeof val === 'string';
//     });
// };
//
// customFormats(ZSchema);
//
// var validator = new ZSchema({});
// var supertest = require('supertest');
// var api = supertest('http://localhost:10010'); // supertest init;
// var expect = chai.expect;
//
// describe('/weather', function() {
//     describe('post', function() {
//
//         it('should respond with default Error', function(done) {
//             /*eslint-disable*/
//             var schema = {
//                 "required": [
//                     "message"
//                 ],
//                 "properties": {
//                     "message": {
//                         "type": "string"
//                     }
//                 }
//             };
//
//             /*eslint-enable*/
//             api.post('/weather')
//                 .set('Content-Type', 'application/json')
//                 .send({
//
//                 })
//                 .expect({
//                     "message": "Response validation failed: invalid content type (text/plain).  These are valid: application/json",
//                     "failedValidation": true
//                 })
//                 .end(function(err, res) {
//                     if (err) return done(err);
//
//                     expect(validator.validate(res.body, schema)).to.be.true;
//                     done();
//                 });
//         });
//
//         it('should return temperature', function(done) {
//             /*eslint-disable*/
//             var schema = {
//                 "required": [
//                     "speech",
//                     "displayText",
//                     "source"
//                 ],
//                 "properties": {
//                     "speech": {
//                         "type": "string"
//                     },
//                     "displayText": {
//                         "type": "string"
//                     },
//                     "source": {
//                         "type": "string"
//                     }
//                 }
//             };
//
//             /*eslint-enable*/
//             api.post('/weather')
//                 .set('Content-Type', 'application/json')
//                 .send({
//                     "id": "222a8b96-374d-4ecd-b8a3-3b754b691d8b",
//                     "timestamp": "2017-05-20T13:35:06.006Z",
//                     "lang": "en",
//                     "result": {
//                         "source": "agent",
//                         "resolvedQuery": "Show me weather in Chennai",
//                         "speech": "",
//                         "action": "navigation.directions",
//                         "actionIncomplete": false,
//                         "parameters": {
//                             "address": "San Francisco, CA",
//                             "unit": "F"
//                         },
//                         "contexts": [],
//                         "metadata": {
//                             "intentId": "f59f4d20-6d45-4123-830f-72e801a85468",
//                             "webhookUsed": "true",
//                             "webhookForSlotFillingUsed": "false",
//                             "intentName": "Weather"
//                         },
//                         "fulfillment": {
//                             "speech": "",
//                             "messages": [
//                                 {
//                                     "type": 0,
//                                     "speech": ""
//                                 }
//                             ]
//                         },
//                         "score": 1
//                     },
//                     "status": {
//                         "code": 200,
//                         "errorType": "success"
//                     },
//                     "sessionId": "688d71f5-f512-404e-a7f9-1e05d44a97a1"
//                 })
//                 .expect({
//                     "displayText": " The temperature is 55F ",
//                     "source": "apiai-weather-webhook-sample",
//                     "speech": " The temperature is 55F "
//                 })
//                 .end(function(err, res) {
//                     if (err) return done(err);
//                     expect(validator.validate(res.body, schema)).to.be.true;
//                     done();
//                 });
//
//             setTimeout(done, 2000);
//         });
//
//     });
//
// });
//
