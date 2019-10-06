/* global mightyFormValidator */

(function(){
	"use strict";

	mightyFormValidator.validators.add('equals', {
		validate: function(self, options) {
            mightyFormValidator.utilities.log('Function: equals.validate()');

            var isValid,
                value = self.value,
                compareElement;

            if (typeof options === 'undefined') {
                options = {};
            }
            mightyFormValidator.utilities.log(options);

            if (typeof options.compareElement !== 'undefined' && options.compareElement !== '') {
                compareElement = document.querySelector(options.compareElement);
            }

            if (compareElement !== null) {
                var compareValue = compareElement.value;

                if ( compareValue === value ) {
                    isValid = true;
                } else {
                    isValid = false;
                }

            } else {
                isValid = false;
            }

            return isValid;
        }
	});
})();
