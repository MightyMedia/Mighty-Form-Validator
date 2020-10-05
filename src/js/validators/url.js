/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('url', {
		validate: function(self, options) {
			mightyFormValidator.utilities.log('Function: url.validate()');

			var isValid,
				value = self.value,
				expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,63}(:[0-9]{1,5})?(\/.*)?$/gm,
				urlRegEx = new RegExp(expression);
				
			var newValue = value.replace(/\s+/g, '');
			
			if ( typeof options.requireScheme !== 'undefined' && options.requireScheme === true ) {
				expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,63}(:[0-9]{1,5})?(\/.*)?$/gm;
				urlRegEx = new RegExp(expression);
			}

			if (value !== '' && urlRegEx.test(newValue) ) {
				isValid = true;
			} else {
				isValid = false;
			}

			return isValid;
		}
	});
})();
