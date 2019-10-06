/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('date', {
		validateSimple: function(self) {
            mightyFormValidator.utilities.log('Function: date.validateSimple()');

            var isValid,
                value = self.value;

            // Check if given date is valid format (dd-mm-yyyy, dd/mm/yyyy, d-m-yyyy or d/m/yyyy)
            var regex = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/, 'i');

            if (regex.test(value)) {
                isValid = true;
            } else {
                isValid = false;
            }

            return isValid;
        },

        validate: function(self, options) {
            mightyFormValidator.utilities.log('Function: dateadvanced.validate()');
            var isValid,
                inputElm = self,
                value = inputElm.value;

            var cleanValue  = value.replace(/\//g, '-');
            var arrayValue  = cleanValue.split('-');
            var currentDate = new Date();
            var myDate      = new Date();

            if (typeof options === 'undefined') {
                options = {};
            }
            mightyFormValidator.utilities.log(options);

            // Allow short year notation (ie. dd-mm-yy)
            if (typeof options.acceptShortyear !== 'undefined' && options.acceptShortyear === true) {
                if ('undefined' !== typeof arrayValue[2] && null !== arrayValue[2] && arrayValue[2].length === 2) {
                    // Validate format with 2 digit year notation (dd-mm-yy, dd/mm/yy, d-m-yy or d/m/yy)
                    var regex = new RegExp(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{2}$/, 'i');

                    if (regex.test(cleanValue)) {
                        isValid = true;
                    } else {
                        isValid = false;
                    }

                    if (isValid === true) {
                        // Convert year to 4 digit year
                        var currentShortYear = currentDate.getFullYear().toString().substr(-2);
                        var currentYearFirst = currentDate.getFullYear().toString().substr(0, 2);
                        mightyFormValidator.utilities.log('currentShortYear:' + currentShortYear);

                        if (parseInt(arrayValue[2]) >= 0 && parseInt(arrayValue[2]) <= parseInt(currentShortYear)) {
                            mightyFormValidator.utilities.log('Should be in 2000');
                            arrayValue[2] = currentYearFirst + arrayValue[2];
                        } else {
                            mightyFormValidator.utilities.log('Should be in 1900');
                            arrayValue[2] = (parseInt(currentYearFirst) - 1) + arrayValue[2];
                        }
                    }

                } else {
                    // Validate format with full year notation
                    isValid = mightyFormValidator.validators.validator.date.validateSimple(inputElm);
                }

            } else {
                // Validate format with full year notation
                isValid = mightyFormValidator.validators.validator.date.validateSimple(inputElm);
            }

            // Check if given date is valid as a date
            if ((isValid === undefined || isValid === true)) {
                mightyFormValidator.utilities.log('Dateadvanced: check for real date');
                // Format is valid, check real date
                var inputDate = parseInt(arrayValue[2]) + '-' + parseInt(arrayValue[1]) + '-' + parseInt(arrayValue[0]);
                myDate = new Date(arrayValue[2], arrayValue[1] - 1, arrayValue[0]);
                var controlDate = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate();

                // Check if valid date (real existing date)
                if (inputDate === controlDate) {
                    isValid = true;
                } else {
                    isValid = false;
                }
            }

            // Check for advanced date options for future date and correct format
            if ((isValid === undefined || isValid === true)) {
                // Input date is a real date, check for advanced options
                mightyFormValidator.utilities.log(options);

                // Check for future date option and check date
                if ( typeof options.allowFuture !== 'undefined' && options.allowFuture === false ) {
                    //mightyFormValidator.utilities.log('Dateadvanced: check for future date');

                    if ( currentDate >= myDate ) {
                        isValid = true;
                    } else {
                        isValid = false;
                    }
                }

                // Check if date format should be corrected to format with leading zero's
                if (isValid === true && (typeof options.correctFormat !== 'undefined' && options.correctFormat === true)) {
                    //mightyFormValidator.utilities.log('Dateadvanced: check for leading zeros format');
                    var newDate = ('0' + myDate.getDate()).slice(-2) + '-' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '-' + myDate.getFullYear();
                    mightyFormValidator.utilities.log('newData: ' + newDate);
                    if (newDate !== value) {
                        //mightyFormValidator.utilities.log('Dateadvanced: Update date with leading zeros');
                        inputElm.value = newDate;
                    }
                }
            }

            return isValid;
        }
	});
})();
