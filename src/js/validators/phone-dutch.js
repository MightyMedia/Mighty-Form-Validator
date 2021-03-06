/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('phone-dutch', {
		validate: function(self, options) {
			mightyFormValidator.utilities.log('Function: phone-dutch.validate()');
			
			var isValid,
				inputElm = self,
				value = self.value,
				minLength = 10,
				expression = "[0-9]{" + minLength + "}",
				phoneRegEx = new RegExp(expression);
				
			var newValue = value.replace(/\s+/g, '').replace('(0)', '');

			if (newValue !== '' && newValue.length >= minLength && phoneRegEx.test(newValue)) {
				isValid = true;
			} else {
				isValid = false;
			}
			
			if (isValid === true && newValue !== value && (typeof options.correctFormat !== 'undefined' && options.correctFormat === true)) {
				inputElm.value = newValue;
			}

			return isValid;
		}
	});
})();
