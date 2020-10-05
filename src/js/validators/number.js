/* global mightyFormValidator */

mightyFormValidator.validators.add('number', {
	validate: function(self, options) {
		"use strict";

		mightyFormValidator.utilities.log('Function: number.validate()');

		var isValid,
			value = self.value,
			minValue = null,
			maxValue = null;

		if (typeof options === 'undefined') {
			options = {};
		}
		mightyFormValidator.utilities.log(options);
		
		if (typeof options.min !== 'undefined') {
			//mightyFormValidator.utilities.log('options min');
			minValue = parseFloat(options.min);
			mightyFormValidator.utilities.log(minValue);

			if (typeof minValue !== 'number') {
				minValue = null;
			}
			mightyFormValidator.utilities.log(minValue);
		}

		if (typeof options.max !== 'undefined') {
			//mightyFormValidator.utilities.log('options max');
			maxValue = parseFloat(options.max);
			mightyFormValidator.utilities.log(maxValue);

			if (typeof maxValue !== 'number') {
				maxValue = null;
			}
			mightyFormValidator.utilities.log(maxValue);
		}

		if (!isNaN(parseFloat(value)) && isFinite(value)) {
			isValid = true;
		} else {
			isValid = false;
		}
		
		if (isValid === true && (minValue !== null && parseFloat(value) >= minValue)) {
			isValid = true;
		} else {
			isValid = false;
		}
		
		if (isValid === true && (maxValue !== null && parseFloat(value) <= maxValue)) {
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
