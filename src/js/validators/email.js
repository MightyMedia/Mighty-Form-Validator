/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('email', {
		validate: function(self) {
			mightyFormValidator.utilities.log('Function: email.validate()');

			var isValid,
				value = self.value,
				emailRegex = /\S+@\S+\.\S+/;

			if (value.length >= 2) {
				isValid = emailRegex.test(value);
			} else {
				isValid = false;
			}

			return isValid;
		}
	});
})();
