/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('_template', {
		validate: function(self) {
			mightyFormValidator.utilities.log('Function: _template.validate()');

			var isValid,
				value = self.value;

			if (value !== '') {
				isValid = true;
			} else {
				isValid = false;
			}

			return isValid;
		}
	});
})();
