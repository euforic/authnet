
/**
 * Module Deps
 */

var queryString = require('querystring')
  , templates = require('./templates')
  , request = require('superagent')
  , parseXml = require('xml2json').toJson;

/**
 * [Cim description]
 * @param {[type]} options [description]
 */

var Cim = module.exports = function Cim(options) {
  if (!(this instanceof Cim)){ return new Cim(options); }

  var self = this;
  options = options || {};

  self.id = options.id;
  self.key = options.key;
  self.url = (options.env === 'live') ? 'api.authorize.net' : 'apitest.authorize.net',
  self.path = options.path || '/xml/v1/request.api';

};

Cim.prototype.createCustomerProfile = function(params, cb) {
  this.sendRequest('createCustomerProfile', params, cb);
};

Cim.prototype.createPaymentProfile = function(params, cb) {
  this.sendRequest('createCustomerPaymentProfile', params, cb);
};

Cim.prototype.createShippingAddress = function(params, cb) {
  this.sendRequest('createCustomerShippingAddress', params, cb);
};

Cim.prototype.createAuthOnlyTransaction = function(params, cb) {
  var data = {
    profileTransAuthOnly: params
  };

  this.sendRequest('createCustomerProfileTransaction', data, cb);
};

Cim.prototype.createAuthAndCaptureTransaction = function(params, cb) {
  var data = {
    profileTransAuthCapture: params
  };

  this.sendRequest('createCustomerProfileTransaction', data, cb);
};

Cim.prototype.createCaptureTransaction = function(params, cb) {
  var data = {
    profileTransCaptureOnly: params
  };

  this.sendRequest('createCustomerProfileTransaction', data, cb);
};

Cim.prototype.createPriorAuthAndCaptureTransaction = function(params, cb) {
  var data = {
    profileTransPriorAuthCapture: params
  };

  this.sendRequest('createCustomerProfileTransaction', data, cb);
};

Cim.prototype.createRefundTransaction = function(params, cb) {
  var data = {
    profileTransRefund: params
  };

  this.sendRequest('createCustomerProfileTransaction', data, cb);
};

Cim.prototype.createVoidTransaction = function(params, cb) {
  var data = {
    profileTransAVoid: params
  };

  this.sendRequest('createCustomerProfileTransaction', data, cb);
};

Cim.prototype.deleteCustomerProfile = function(params, cb) {
  this.sendRequest('deleteCustomerProfile', params, cb);
};

Cim.prototype.deletePaymentProfile = function(params, cb) {
  this.sendRequest('deleteCustomerPaymentProfile', params, cb);
};

Cim.prototype.deleteShippingAddress = function(params, cb) {
  this.sendRequest('deleteCustomerShippingAddress', params, cb);
};

Cim.prototype.getCustomerProfile = function(params, cb) {
  this.sendRequest('getCustomerProfile', params, cb);
};

Cim.prototype.getCustomerPaymentProfile = function(params, cb) {
  this.sendRequest('getCustomerPaymentProfile', params, cb);
};

Cim.prototype.getShippingAddress = function(params, cb) {
  this.sendRequest('getCustomerShippingAddress', params, cb);
};

Cim.prototype.updateCustomerProfile = function(params, cb) {
  this.sendRequest('updateCustomerProfile', params, cb);
};

Cim.prototype.updatePaymentProfile = function(params, cb) {
  this.sendRequest('updateCustomerPaymentProfile', params, cb);
};

Cim.prototype.updateShippingAddress = function(params, cb) {
  this.sendRequest('updateCustomerShippingAddress', params, cb);
};

/**
 * [sendRequest description]
 * @param  {[type]} method [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */

Cim.prototype.sendRequest = function (method, params, fn) {
  var self = this;
  var callback = fn || function (){};
  var data = params || {};

  data.requestType = method;
  data.login = self.id;
  data.transactionKey = self.key;

  var body = templates.build(method, params, data);
  if (body instanceof Array) { return self.emit('error', body); }

  request
    .post('https://' + self.url + self.path)
    .type('xml')
    .send(body)
    .end(function(err, res){
        if (!res.ok) return callback(err,res.text);
        var jsonData = parseXml(res.text, {object: true});
        var data = jsonData[Object.keys(jsonData)[0]];
        delete data['xmlns:xsi'];
        delete data['xmlns:xsd'];
        delete data.xmlns;

        if(data.messages.resultCode.toLowerCase() === 'error') { return callback(true,data); }

        if (data.directResponse) {
          var dr = data.directResponse.split(',');
          data.error = data.messages.message.text;
          data.code = data.messages.message.code;
          data.response_code = dr[0];
          data.response_subcode = dr[1];
          data.reason_code = dr[2];
          data.response_reason = dr[3];
          data.auth_code = dr[4];
          data.avs = dr[5];
          data.transaction_id = dr[6];
        }

        callback(err, data);
  });
};