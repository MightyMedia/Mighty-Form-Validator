/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('regex', {
		validate: function(self, options) {
            mightyFormValidator.utilities.log('Function: regex.validate()');

            var isValid,
                value = self.value;

            if (typeof options === 'undefined') {
                options = {};
            }
            mightyFormValidator.utilities.log(options);

            if (typeof options.regex !== 'undefined' && options.regex !== '') {
                var regex = new RegExp(options.regex, 'i');

                if (regex.test(value)) {
                    isValid = true;
                } else {
                    isValid = false;
                }
            } else {
                // No regex found, should we do anything?
            }

            return isValid;
        }
	});
})();
