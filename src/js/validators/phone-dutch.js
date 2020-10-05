/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('phone-dutch', {
		validate: function(self) {
			mightyFormValidator.utilities.log('Function: _template.validate()');
			
			var minLength = 10;
			var isValid,
				value = self.value,
				phoneRegEx = new RegExp("[0-9]{" + minLength + "}");

			if (value !== '' && value.length >= minLength && phoneRegEx.test(value)) {
				isValid = true;
			} else {
				isValid = false;
			}

			return isValid;
		}
	});
})();
