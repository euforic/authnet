
/**
 * [truncate description]
 * @param  {[type]} len  [description]
 * @param  {[type]} text [description]
 * @return {[type]}      [description]
 */
var truncate = function(len, text) {
    text = (text === null || text === undefined) ? "" : text.toString();

    if (text.length > len) {
        text = text.substring(0, len);
    }
    return text;
};


var Templates = module.exports = {};

/**
 * [build description]
 * @param  {[type]} method [description]
 * @param  {[type]} params [description]
 * @param  {[type]} data   [description]
 * @return {[type]}        [description]
 */

Templates.build = function(method, params, data) {
    data = data || {};
    data.content = Templates[method](params);

    var response = "";

    if(!data.login || !data.transactionKey || !data.requestType || !data.content) return false;

    response += "<?xml version='1.0' encoding='utf-8'?>";
    response += "<" + data.requestType + "Request xmlns='AnetApi/xml/v1/schema/AnetApiSchema.xsd'>";

    response += "<merchantAuthentication>";
    response += "<name>" + data.login + "</name>";
    response += "<transactionKey>" + data.transactionKey + "</transactionKey>";
    response += "</merchantAuthentication>";

    response += data.content;
    response += "</" + data.requestType + "Request>";

    return response;
};

/*
 * Core request type functions, create
 *
 */

Templates.createCustomerProfileTransaction = function(data) {
    var response = "", err = false, insert;
    var errors = [];

    if(data.refId !== undefined) {
        response += "<refId>";
        response += data.refId;
        response += "</refId>";
    }

    response += "<transaction>";

    switch(data.transactionType) {
        case "auth":
            response += "<profileTransAuthOnly>";

            insert = buildTransactionInternals(data);
            if(!(insert instanceof Array)) response += insert;
            else {
				errors = insert;
				err = true;
			}

            response += "</profileTransAuthOnly>";
        break;

        case "authCapture":
            response += "<profileTransAuthCapture>";

            insert = buildTransactionInternals(data);
            if(!(insert instanceof Array)) response += insert;
            else {
				errors = insert;
				err = true;
			}

            response += "</profileTransAuthCapture>";
        break;

        case "capture":
            response += "<profileTransCaptureOnly>";

            insert = buildTransactionInternals(data);
            if(!(insert instanceof Array)) response += insert;
            else {
				errors = insert;
				err = true;
			}

            response += "</profileTransCaptureOnly>";
        break;

        case "priorAuthCapture":
            response += "<profileTransPriorAuthCapture>";

            insert = buildTransactionInternals(data);
            if(!(insert instanceof Array)) response += insert;
            else {
				errors = insert;
				err = true;
			}

            if(data.transId) {
                response += "<transId>";
                response += data.transId;
                response += "</transId>";
            }
            else {
				errors.push('transId');
                err = true;
            }
            response += "</profileTransPriorAuthCapture>";
        break;

        case "refund":
            response += "<profileTransRefund>";

            insert = buildTransactionInternals(data);
            if(!(insert instanceof Array)) response += insert;
            else {
				errors = insert;
				err = true;
			}

            if(data.transId) {
                response += "<transId>";
                response += data.transId;
                response += "</transId>";
            }
            else {
				errors.push('transId');
                err = true;
            }
            response += "</profileTransRefund>";
        break;

        case "void":
            response += "<profileTransVoid>";

            if(data.customerProfileId !== undefined && +data.customerProfileId) {
                response += "<customerProfileId>";
                response += data.customerProfileId;
                response += "</customerProfileId>";
            }
            if(data.customerPaymentProfileId) {
                response += "<customerPaymentProfileId>";
                response += data.customerPaymentProfileId;
                response += "</customerPaymentProfileId>";
            }
            if(data.customerShippingAddressId) {
                response += "<customerShippingAddressId>";
                response += data.customerShippingAddressId;
                response += "</customerShippingAddressId>";
            }
            if(data.transId) {
                response += "<transId>";
                response += data.transId;
                response += "</transId>";
            }
            else {
				errors.push('transId');
                err = true;
            }
            response += "</profileTransVoid>";
        break;


        default:
			errors.push('transactionType');
            err = true;
        break;
    }

    response += "</transaction>";

    response += "<extraOptions><![CDATA[";
    if(data.extraOptions) {
        response += data.extraOptions;
    }
    response += "]]></extraOptions>";

    return (err) ? errors : response;
};

Templates.createCustomerProfile = function(data) {
    var response = '';
    var err = false;
	var errors = [];

    response += (data.refId)
        ? "<refId>" + data.refId + "</refId>"
        : '';

    response += "<profile>";

    response += (data.merchantCustomerId)
        ? "<merchantCustomerId>" + data.merchantCustomerId +"</merchantCustomerId>"
        : '';

    if(data.description) {
        response += "<description>";
        response += data.description;
        response += "</description>";
    }
    if(data.email !== undefined) {
        response += "<email>";
        response += data.email;
        response += "</email>";
    }

    if(data.paymentProfiles !== undefined && data.paymentProfiles instanceof Array) {
        data.paymentProfiles.forEach(function(val) {
            response += "<paymentProfiles>";

            insert = buildPaymentProfileInternals(val);
            if(!(insert instanceof Array)) response += insert;
            else {
				errors = insert;
				err = true;
			}

            response += "</paymentProfiles>";
        });
    }

    if(data.validationMode) {
        if(data.validationMode == 'none' || data.validationMode == 'testMode' || data.validationMode == 'liveMode') {
            response += "<validationMode>";
            response += data.validationMode;
            response += "</validationMode>";
        }
        else {
			errors.push('validationMode');
            err = true;
        }
    }

    response += "</profile>";

    return (err) ? errors : response;
};

Templates.createCustomerPaymentProfile = function(data) {
    var response = "", err = false;
    var errors = [];

    if(data.refId !== undefined) {
        response += "<refId>";
        response += data.refId;
        response += "</refId>";
    }
    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    response += "<paymentProfile>";

    insert = buildPaymentProfileInternals(data);
    if(!(insert instanceof Array)) response += insert;
	else {
		errors = insert;
		err = true;
	}

    response += "</paymentProfile>";

    return (err) ? errors : response;
};

Templates.createCustomerShippingAddress = function(data) {
    var response = "", err = false;
    var errors = [];

    if(data.refId !== undefined) {
        response += "<refId>";
        response += data.refId;
        response += "</refId>";
    }
    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    response += "<address>";

    insert = buildAddressInternals(data);
    if(!(insert instanceof Array)) response += insert;
	else {
		errors = insert;
		err = true;
	}

    response += "</address>";

    return (err) ? errors : response;
};

/*
 * Core request type functions, delete
 *
 */

Templates.deleteCustomerProfile = function(data) {
    var response = "", err = false;
	var errors = [];

    if(data.refId !== undefined) {
        response += "<refId>";
        response += data.refId;
        response += "</refId>";
    }
    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    return (err) ? errors : response;
};

Templates.deleteCustomerPaymentProfile = function(data) {
    var response = "", err = false;
    var errors = [];

    if(data.refId !== undefined) {
        response += "<refId>";
        response += data.refId;
        response += "</refId>";
    }
    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    if(data.customerPaymentProfileId) {
        response += "<customerPaymentProfileId>";
        response += data.customerPaymentProfileId;
        response += "</customerPaymentProfileId>";
    }
    else {
		errors.push('customerPaymentProfileId');
        err = true;
    }
    return (err) ? errors : response;
};

Templates.deleteCustomerShippingAddress = function(data) {
    var response = "", err = false;
    var errors = [];

    if(data.refId !== undefined) {
        response += "<refId>";
        response += data.refId;
        response += "</refId>";
    }
    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    if(data.customerAddressId) {
        response += "<customerAddressId>";
        response += data.customerAddressId;
        response += "</customerAddressId>";
    }
    else {
		errors.push('customerAddressId');
        err = true;
    }

    return (err) ? errors : response;
};

/*
 * Core request type functions, get
 *
 */

Templates.getCustomerProfile = function(data) {
    var response = "", err = false;
    var errors = [];

    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    return (err) ? errors : response;
};

Templates.getCustomerPaymentProfile = function(data) {
    var response = "", err = false;
    var errors = [];

    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

	if(data.customerPaymentProfileId) {
        response += "<customerPaymentProfileId>";
        response += data.customerPaymentProfileId;
        response += "</customerPaymentProfileId>";
    }
    else {
		errors.push('customerPaymentProfileId');
        err = true;
    }

    return (err) ? errors : response;
};

Templates.getCustomerShippingAddress = function(data) {
    var response = "", err = false;
    var errors = [];

    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    if(data.customerAddressId) {
        response += "<customerAddressId>";
        response += data.customerAddressId;
        response += "</customerAddressId>";
    }
    else {
		errors.push('customerAddressId');
        err = true;
    }

    return (err) ? errors : response;
};

/*
 * Core request type functions, update
 *
 */

Templates.updateCustomerProfile = function(data) {
    var response = "", err = false, insert;
	var errors = [];

    if(data.refId !== undefined) {
        response += "<refId>";
        response += data.refId;
        response += "</refId>";
    }

    response += "<profile>";

    if(data.merchantCustomerId !== undefined) {
        response += "<merchantCustomerId>";
        response += data.merchantCustomerId;
        response += "</merchantCustomerId>";
    }
    if(data.description !== undefined) {
        response += "<description>";
        response += data.description;
        response += "</description>";
    }
    if(data.email !== undefined) {
        response += "<email>";
        response += data.email;
        response += "</email>";
    }
    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    response += "</profile>";

    return (err) ? errors : response;
};

Templates.updateCustomerPaymentProfile = function(data) {
    var response = "", err = false;
	var errors = [];

    if(data.refId !== undefined) {
        response += "<refId>";
        response += data.refId;
        response += "</refId>";
    }
    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    response += "<paymentProfile>";

    insert = buildPaymentProfileInternals(data);
    if(!(insert instanceof Array)) response += insert;
    else {
		errors = errors.concat(insert);
		err = true;
	}

    response += "</paymentProfile>";

    if(data.customerPaymentProfileId !== undefined && +data.customerPaymentProfileId) {
        response += "<customerPaymentProfileId>";
        response += data.customerPaymentProfileId;
        response += "</customerPaymentProfileId>";
    }
    else {
		errors.push('customerPaymentProfileId');
        err = true;
    }

    return (err) ? errors : response;
};

Templates.updateCustomerShippingAddress = function(data) {
    var response = "", err = false;
    var errors = [];

    if(data.refId !== undefined) {
        response += "<refId>";
        response += data.refId;
        response += "</refId>";
    }
    if(data.customerProfileId !== undefined && +data.customerProfileId) {
        response += "<customerProfileId>";
        response += data.customerProfileId;
        response += "</customerProfileId>";
    }
    else {
		errors.push('customerProfileId');
        err = true;
    }

    response += "<address>";

    insert = buildAddressInternals(data);
    if(!(insert instanceof Array)) response += insert;
    else {
		errors = errors.concat(insert);
		err = true;
	}

    response += "</address>";

    if(data.customerAddressId !== undefined && +data.customerAddressId) {
        response += "<customerAddressId>";
        response += data.customerAddressId;
        response += "</customerAddressId>";
    }
    else {
		errors.push('customerAddressId');
        err = true;
    }

    return (err) ? errors : response;
};


/*
 * Reusable internal structure functions
 *
 */

var buildTransactionInternals = function(val) {
    var response = "", err = false;
    var errors = [];

    if(!val.amount) {
		errors.push('amount');
        err = true;
    }

    response += "<amount>";
    response += val.amount;
    response += "</amount>";

    if(val.tax && typeof val.tax == 'object') {
        response += "<tax>";

        if(typeof val.tax.amount == 'number') {
            response += "<amount>";
            response += val.tax.amount;
            response += "</amount>";
        }
		else {
			errors.push('tax.amount');
			err = true;
		}

        if(val.tax.name) {
            response += "<name>";
            response += truncate(31, val.tax.name);
            response += "</name>";
        }

        if(val.tax.description) {
            response += "<description>";
            response += truncate(255, val.tax.description);
            response += "</description>";
        }

        response += "</tax>";
    }

    if(val.shipping && typeof val.shipping == 'object') {
        response += "<shipping>";

        if(typeof val.shipping.amount == 'number') {
            response += "<amount>";
            response += val.shipping.amount;
            response += "</amount>";
        }
		else {
			errors.push('shipping.amount');
			err = true;
		}

        if(val.shipping.name) {
            response += "<name>";
            response += truncate(31, val.shipping.name);
            response += "</name>";
        }

        if(val.shipping.description) {
            response += "<description>";
            response += truncate(255, val.shipping.description);
            response += "</description>";
        }

        response += "</shipping>";
    }

    if(val.duty && typeof val.duty == 'object') {
        response += "<shipping>";

        if(typeof val.duty.amount == 'number') {
            response += "<amount>";
            response += val.duty.amount;
            response += "</amount>";
        }
		else {
			errors.push('duty.amount');
			err = true;
		}

        if(val.duty.name) {
            response += "<name>";
            response += truncate(31, val.duty.name);
            response += "</name>";
        }

        if(val.duty.description) {
            response += "<description>";
            response += truncate(255, val.duty.description);
            response += "</description>";
        }

        response += "</shipping>";
    }

    if(val.lineItems && val.lineItems instanceof Array) {
        val.lineItems.forEach(function(item) {
            response += "<lineItems>";

            if(item.itemId !== undefined) {
                response += "<itemId>";
                response += truncate(31, item.itemId);
                response += "<itemId>";
            }

            if(item.name) {
                response += "<name>";
                response += truncate(31, item.name);
                response += "</name>";
            }

            if(item.description) {
                response += "<description>";
                response += truncate(255, item.description);
                response += "</description>";
            }

            if(item.quantity) {
                response += "<quantity>";
                response += item.quantity;
                response += "</quantity>";
            }

            if(item.unitPrice) {
                response += "<unitPrice>";
                response += item.unitPrice;
                response += "</unitPrice>";
            }

            if(typeof item.taxable == 'boolean') {
                response += "<taxable>";
                response += item.taxable.toString();
                response += "</taxable>";
            }

            response += "</lineItems>";
        });
    }

    if(val.customerProfileId) {
        response += "<customerProfileId>";
        response += val.customerProfileId;
        response += "</customerProfileId>";
    }

    if(val.customerPaymentProfileId) {
        response += "<customerPaymentProfileId>";
        response += val.customerPaymentProfileId;
        response += "</customerPaymentProfileId>";
    }

    if(val.customerShippingAddressId) {
        response += "<customerShippingAddressId>";
        response += val.customerShippingAddressId;
        response += "</customerShippingAddressId>";
    }

    if(val.creditCardNumberMasked && val.creditCardNumberMasked.match(/^XXXX[0-9]{4}$/)) {
        response += "<creditCardNumberMasked>";
        response += val.creditCardNumberMasked;
        response += "</creditCardNumberMasked>";
    }

    if(val.bankRoutingNumberMasked && val.bankRoutingNumberMasked.match(/^XXXX[0-9]{4}$/)) {
        response += "<bankRoutingNumberMasked>";
        response += val.bankRoutingNumberMasked;
        response += "</bankRoutingNumberMasked>";
    }

    if(val.bankAccountNumberMasked && val.bankAccountNumberMasked.match(/^XXXX[0-9]{4}$/)) {
        response += "<bankAccountNumberMasked>";
        response += val.bankAccountNumberMasked;
        response += "</bankAccountNumberMasked>";
    }

    if(val.order && typeof val.order =='object') {
        response += "<order>";

        if(val.order.invoiceNumber) {
            response += "<invoiceNumber>";
            response += truncate(20, val.order.invoiceNumber);
            response += "</invoiceNumber>";
        }

        if(val.order.description) {
            response += "<description>";
            response += truncate(255, val.order.description);
            response += "</description>";
        }

        if(val.order.purchaseOrderNumber) {
            response += "<purchaseOrderNumber>";
            response += truncate(25, val.order.purchaseOrderNumber);
            response += "</purchaseOrderNumber>";
        }

        response += "</order>";
    }

    if(val.taxExempt !== undefined && typeof val.taxExempt == 'boolean') {
        response += "<taxExempt>";
        response += val.taxExempt.toString();
        response += "</taxExempt>";
    }

    if(val.recurringBilling !== undefined && typeof val.recurringBilling == 'boolean') {
        response += "<recurringBilling>";
        response += val.recurringBilling.toString();
        response += "</recurringBilling>";
    }

    if(val.cardCode) {
        response += "<cardCode>";
        response += val.cardCode;
        response += "</cardCode>";
    }

    if(val.approvalCode) {
        response += "<approvalCode>";
        response += val.approvalCode;
        response += "</approvalCode>";
    }

    return (err) ? errors : response;
};

var buildPaymentProfileInternals = function(val) {
    var response = "", insert, err = false;
    var errors = [];

    if(val.customerType) {
        if(val.customerType != 'individual' && val.customerType != 'business') {
			errors.push('customerType');
            err = true;
        }
        else {
            response += "<customerType>";
            response += val.customerType;
            response += "</customerType>";
        }
    }

    if(val.billTo && typeof val.billTo == 'object') {
        response += "<billTo>";

        insert = buildAddressInternals(val.billTo);
        if(!(insert instanceof Array)) response += insert;
        else {
			errors = errors.concat(insert);
			err = true;
		}

        if(val.billTo.phoneNumber && val.billTo.phoneNumber.match(/^[()0-9\-+\.]{1,25}$/)) {
            response += "<phoneNumber>";
            response += val.billTo.phoneNumber;
            response += "</phoneNumber>";
        }

        if(val.billTo.faxNumber && val.billTo.faxNumber.match(/^[()0-9\-+\.]{1,25}$/)) {
            response += "<faxNumber>";
            response += val.billTo.faxNumber;
            response += "</faxNumber>";
        }

        response += "</billTo>";
    }

    if(val.shipToList && typeof val.shipToList == 'object') {
        response += "<shipToList>";

        insert = buildAddressInternals(val.shipToList);
        if(!(insert instanceof Array)) response += insert;
        else {
			errors = errors.concat(insert);
			err = true;
		}

        response += "</shipToList>";
    }

    if(val.payment && typeof val.payment == 'object') {
        response += "<payment>";

        insert = buildPaymentInternals(val.payment);
        if(!(insert instanceof Array)) response += insert;
        else {
			errors = errors.concat(insert);
			err = true;
		}

        response += "</payment>";
    }

    return (err) ? errors : response;
};

var buildPaymentInternals = function(val) {
    var response = "", err = false;
	var errors = [];

    if(val.creditCard && typeof val.creditCard == 'object') {
		var cc = val.creditCard;
        response += "<creditCard>";
        if(!cc.cardNumber || !cc.expirationDate || !cc.expirationDate.match(/^[0-9]{4}-[0-9]{2}$/)) {
			if(!cc.cardNumber) errors.push('cc.cardNumber');
			if( !cc.expirationDate || !cc.expirationDate.match(/^[0-9]{4}-[0-9]{2}$/)) errors.push('cc.expirationDate');
		    err = true;
        }
        else {
            response += "<cardNumber>";
            response += cc.cardNumber;
            response += "</cardNumber>";

            response += "<expirationDate>";
            response += cc.expirationDate;
            response += "</expirationDate>";

            if(cc.cardCode) {
                response += "<cardCode>";
                response += cc.cardCode;
                response += "</cardCode>";
            }
        }

        response += "</creditCard>";
    }
    else if(val.bankAccount &&  typeof val.backAccount == 'object') {
		var ba = val.bankAccount;
        response += "<bankAccount>";

        if(ba.accountType) {
            if(ba.accountType == 'checking' || ba.accountType == 'savings' || ba.accountType == 'businessChecking') {
                response += "<accountType>";
                response += ba.accountType;
                response += "</accountType>";
            }
			else {
				errors.push('bankAccount.accountType');
				err = true;
			}
        }

        if(ba.routingNumber && ba.routingNumber.match(/^[0-9]{9}$/)) {
            response += "<routingNumber>";
            response += ba.routingNumber;
            response += "</routingNumber>";
        }
        else {
			errors.push('bankAccount.routingNumber');
			err = true;
        }

        if(ba.accountNumber && ba.accountNumber.match(/^[0-9]{5,17}$/)) {
            response += "<accountNumber>";
            response += ba.accountNumber;
            response += "</accountNumber>";
        }
        else {
			errors.push('bankAccount.accountNumber');
			err = true;
        }

        if(ba.nameOnAccount) {
            response += "<nameOnAccount>";
            response += truncate(22, ba.nameOnAccount);
            response += "</nameOnAccount>";
        }
        else {
			errors.push('bankAccount.nameOnAccount');
			err = true;
        }

        if(ba.echeckType) {
            if(ba.echeckType == 'CCD' || ba.echeckType == 'PPD' || ba.echeckType == 'TEL' || ba.echeckType=='WEB') {
                response += "<echeckType>";
                response += ba.echeckType;
                response += "</echeckType>";
            }
	        else {
				errors.push('bankAccount.echeckType');
				err = true;
	        }
        }

        if(ba.bankName) {
            response += "<bankName>";
            response += truncate(50, ba.bankName);
            response += "</bankName>";
        }

        response += "</bankAccount>";
    }

    return (err) ? errors : response;
};

var buildAddressInternals = function(val) {
    var response = "", err = false;
	var errors = [];

    if(val.firstName) {
        response += "<firstName>";
        response += truncate(50, val.firstName);
        response += "</firstName>";
    }

    if(val.lastName) {
        response += "<lastName>";
        response += truncate(50, val.lastName);
        response += "</lastName>";
    }

    if(val.company) {
        response += "<company>";
        response += truncate(50, val.company);
        response += "</company>";
    }

    if(val.address) {
        response += "<address>";
        response += truncate(60, val.address);
        response += "</address>";
    }

    if(val.city) {
        response += "<city>";
        response += truncate(40, val.city);
        response += "</city>";
    }

    if(val.state) {
        response += "<state>";
        response += truncate(40, val.state);
        response += "</state>";
    }

    if(val.zip) {
        response += "<zip>";
        response += truncate(20, val.zip);
        response += "</zip>";
    }

    if(val.country) {
        response += "<country>";
        response += truncate(60, val.country);
        response += "</country>";
    }

    if(val.phoneNumber && val.phoneNumber.match(/^[()0-9\-+\.]{1,25}$/)) {
        response += "<phoneNumber>";
        response += val.phoneNumber;
        response += "</phoneNumber>";
    }

    if(val.faxNumber && val.faxNumber.match(/^[()0-9\-+\.]{1,25}$/)) {
        response += "<faxNumber>";
        response += val.faxNumber;
        response += "</faxNumber>";
    }

    return (err) ? errors : response;
};