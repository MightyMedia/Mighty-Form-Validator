/* global mightyFormValidator */

mightyFormValidator.validators.add('number', {
	validate: function(self, options) {
		"use strict";

		mightyFormValidator.utilities.log('Function: number.validate()');

		var isValid,
			value = self.value;

		if (typeof options === 'undefined') {
			options = {};
		}
		mightyFormValidator.utilities.log(options);

		if (!isNaN(parseFloat(value)) && isFinite(value)) {
			isValid = true;
		} else {
			isValid = false;
		}

		if (isValid === true && typeof options.decimals !== 'undefined' && options.decimals === false) {
			if (parseFloat(value) !== parseInt(value)) {
				isValid = false;
			}
		}

		return isValid;
	}
});
