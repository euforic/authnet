var Cim = require('../').cim
  , config = require('./fixtures/config');

var client = Cim({ id: config.authId, key: config.authKey });

var profile = {
  refId: +new Date(),
  profile: 'test12345',
  email: 'tester@test.com',
  description: 'test account'

};

// Create User

client.createCustomerProfile(profile, function (err, res){
  console.log(res);
});