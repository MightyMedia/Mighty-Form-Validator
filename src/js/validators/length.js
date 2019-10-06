/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('length', {
		validate: function(self, options) {
			mightyFormValidator.utilities.log('Function: minmax.validate()');

			var isValid,
				value = self.value,
				minLength = -1,
				maxLength = -1;

			if (typeof options === 'undefined') {
				options = {};
			}
			mightyFormValidator.utilities.log(options);

			if (typeof options.min !== 'undefined') {
				//mightyFormValidator.utilities.log('options min');
				minLength = parseInt(options.min);
				mightyFormValidator.utilities.log(minLength);

				if (typeof minLength !== 'number') {
					minLength = -1;
				}
				mightyFormValidator.utilities.log(minLength);
			}

			if (typeof options.max !== 'undefined') {
				//mightyFormValidator.utilities.log('options max');
				maxLength = parseInt(options.max);
				mightyFormValidator.utilities.log(maxLength);

				if (typeof maxLength !== 'number' || maxLength < 1) {
					maxLength = -1;
				}
				mightyFormValidator.utilities.log(maxLength);
			}

			if (minLength < 0 || (minLength > 0 && value.length >= minLength)) {
				//mightyFormValidator.utilities.log('min length valid');
				isValid = true;
			} else {
				isValid = false;
			}

			if (isValid === true && (maxLength < 0 || (maxLength > 0 && value.length <= maxLength))) {
				//mightyFormValidator.utilities.log('max length valid');
				isValid = true;
			} else {
				isValid = false;
			}

			return isValid;
		}
	});
})();
