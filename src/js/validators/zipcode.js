/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('zipcode', {
		regex: {
            NL: /^\d{4}[ ]?[a-z, A-Z]{2}$/,
            BE: /^\d{4}$/,
            DE: /^\d{5}$/
        },

        addRegex: function(countryCode, newRegex) {
            mightyFormValidator.utilities.log('Function: zipcode.addRegex()');
            mightyFormValidator.validators.validator.zipcode.regex[countryCode.toUpperCase()] = newRegex;
        },

        correctFormat: function(input, countryCode) {
            mightyFormValidator.utilities.log('Function: zipcode.correctFormat()');
            var output = input;

            // At this point we only correct Dutch zipcodes
            if (countryCode === 'NL') {
                output = output.toUpperCase();

                if (output.length < 7) {
                    output = output.substr(0, 4) + ' ' + output.substr(4);
                }
            }

            return output;
        },

        validate: function(self, options) {
            mightyFormValidator.utilities.log('Function: zipcode.validate()');

            var isValid,
                inputElm = self,
                value = self.value;

            if (typeof options === 'undefined') {
                options = {};
            }
            mightyFormValidator.utilities.log(options);

            var countryCode = 'NL';
            var zipcodeRegex = mightyFormValidator.validators.validator.zipcode.regex.NL;
            if (typeof options.country !== 'undefined' && options.country !== '' && typeof mightyFormValidator.validators.validator.zipcode.regex[options.country.toUpperCase()] !== 'undefined') {
                countryCode = options.country.toUpperCase();
                zipcodeRegex = mightyFormValidator.validators.validator.zipcode.regex[options.country.toUpperCase()];
            }

            if (value.length >= 2) {
                isValid = zipcodeRegex.test(value);
                //mightyFormValidator.utilities.log('Zipcode validation: VALID "'+countryCode+'" zipcode? ' + isValid);

                if (isValid === true && (typeof options.correctFormat !== 'undefined' && options.correctFormat === true)) {
                    //mightyFormValidator.utilities.log('Zipcode validation: Correct format please');
                    var newZipcode = mightyFormValidator.validators.validator.zipcode.correctFormat(value, countryCode);

                    if (newZipcode !== value) {
                        //mightyFormValidator.utilities.log('Zipcode validation: Update input with updated zipcode');
                        inputElm.value = newZipcode;
                    }
                }
            } else{
                isValid = false;
            }

            return isValid;
        }
	});
})();
