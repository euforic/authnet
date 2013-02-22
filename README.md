
# Authnet

Node.js Authorize.net API

## Install

```
$ npm install authnet
```
## Official API Docs
- [AIM XML guide](http://www.authorize.net/support/AIM_guide_XML.pdf)
- [ARB XML guide](http://www.authorize.net/support/ARB_guide.pdf)
- [CIM XML guide](http://www.authorize.net/support/CIM_XML_guide.pdf)
- [Transaction Details Guide](http://www.authorize.net/support/ReportingGuide_XML.pdf)

## API

### AuthNet

```js
var AuthNet = require('authnet');
```

### cim#

```js
var cim = AuthNet.cim({ id: config.authId, key: config.authKey });
```

### cim#createCustomerProfile

Create a new customer profile along with any customer payment profiles and customer shipping addresses for the customer profile.

```js
var cim = AuthNet.cim;
```
### cim#createPaymentProfile

Create a new customer payment profile for an existing customer profile.

```js
var profile = {
  refId: +new Date(),
  profile: 'test12345',
  email: 'tester@test.com',
  description: 'test account'
};

cim.createCustomerProfile(profile, function (err, res){
  console.log(err,res);
});
```
### cim#createShippingAddress

Create a new customer shipping address for an existing customer profile.

### cim#createAuthOnlyTransaction

### cim#createAuthAndCaptureTransaction

### cim#createCaptureTransaction

### cim#createPriorAuthAndCaptureTransaction

### cim#createRefundTransaction

### cim#createVoidTransaction

### cim#deleteCustomerProfile

### cim#deletePaymentProfile

Create a new payment transaction from an existing customer profile.

### cim#deleteShippingAddress

### cim#getCustomerProfile

### cim#getCustomerPaymentProfile

### cim#getShippingAddress

### cim#updateCustomerProfile

### cim#updatePaymentProfile

### cim#updateShippingAddress

## License

(The MIT License)

Copyright (c) 2012 Christian Sullivan &lt;cs@euforic.co&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.E.