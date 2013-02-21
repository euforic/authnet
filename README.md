
# Authnet

Node.js Authorize.net API

## Install

```
$ npm install authnet
```

## API

## AuthNet

```js
var AuthNet = require('authnet');
```

## cim#

```js
  var cim = AuthNet.cim({ id: config.authId, key: config.authKey });
```

### cim#createCustomerProfile

```js
  var cim = AuthNet.cim;
```
### cim#createPaymentProfile

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

### cim#createAuthOnlyTransaction

### cim#createAuthAndCaptureTransaction

### cim#createCaptureTransaction

### cim#createPriorAuthAndCaptureTransaction

### cim#createRefundTransaction

### cim#createVoidTransaction

### cim#deleteCustomerProfile

### cim#deletePaymentProfile

### cim#deleteShippingAddress

### cim#getCustomerProfile

### cim#getCustomerPaymentProfile

### cim#getShippingAddress

### cim#updateCustomerProfile

### cim#updatePaymentProfile

### cim#updateShippingAddress

## License

MIT