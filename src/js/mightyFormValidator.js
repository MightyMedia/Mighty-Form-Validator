/* exported mightyFormValidator */

// Utility for creating objects in older browsers
if (typeof Object.create !== 'function') {
	Object.create = function(obj) {
    	"use strict";
		function F() {}
		F.prototype = obj;
		return new F();
	};
}

// Create event listeners with jQuery like namespacing. Thanks to Leon Zoutewelle!
var eventsNamespaceBinder = {
    on: function(event, cb, opts) {
        "use strict";

        if (!this.namespaces) { // save the namespaces on the DOM element itself
            this.namespaces = {};
        }

        this.namespaces[event] = cb;
        var options = opts || false;

        this.addEventListener(event.split('.')[0], cb, options);
        return this;
    },

    off: function(event) {
        "use strict";

        if(typeof this.namespaces !== 'undefined') {
            if(event.split('.')[1] === undefined) {
                for (var key in this.namespaces) {
                    if (key.split('.')[0] === event) {
                        this.removeEventListener(event, this.namespaces[key]);
                        delete this.namespaces[key];
                    }
                }
            } else {
                if (this.namespaces.hasOwnProperty(event)) {
                    this.removeEventListener( event.split('.')[0], this.namespaces[event]);
                    delete this.namespaces[event];
                }
            }
        }

        return this;
    }
};

// Extend the DOM with these above custom methods
window.on = Element.prototype.on = eventsNamespaceBinder.on;
window.off = Element.prototype.off = eventsNamespaceBinder.off;

// Mighty Form Validator engine
var mightyFormValidator = (function(){
    "use strict";

    // Form validation settings
    var settings = {
        initialRun: false,
        initialRunTimeout: 20,
        parentSelector: false,
        classes:  {
            passed: 'validation-passed',
            failed: 'validation-failed'
        },
        debug: false,
        validationStatus: {
            valid: 'valid',
            invalid: 'invalid',
            initial: 'initial'
        }
    };

    // contains all xhr handles
    //var xhrTimeOut = {}; //Temporary disabled because it isn't in use yet

    // Utilities for debugging and stuff
    var utilities = {
        // Wrapper for console.log()
        log: function(input) {
            if (settings.debug === true) {
                console.log(input);
            }
        },

        // find parent by selector
        getAncestor: function(el, search) {
            switch (search.charAt(0)) {
                case '#': // Find by ID
                    search = search.substr(1);
                    while ((el = el.parentElement) && el.id !== search ){}
                    break;

                case '.': // Find by classname
                    search = search.substr(1);
                    while ((el = el.parentElement) && !el.classList.contains(search) ){}
                    break;

                default: // Find by tagname
                    search = search.toUpperCase();
                    while ((el = el.parentElement) && el.tagName !== search ){}
                    break;
            }

            return el;
        }
    };

    // Validators handling
    var validators = {
        add: function(name, newValidator) {
            utilities.log('Function: validators.add()');

            if ((typeof name === 'string' || name instanceof String) && name.length > 2 && name !== 'default' && name !== 'general') {
                if (name in validators.validator) {
                    utilities.log('FAIL: Duplicated validator name');
                    return false;
                } else {
                    if (typeof newValidator === 'object' && typeof newValidator.validate === 'function') {
                        utilities.log('SUCCESS: Validator with name `' + name + '` added');
                        validators.validator[name] = newValidator;
                    } else {
                        utilities.log('FAIL: invalid validator object or validate() function is missing');
                        return false;
                    }
                }

            } else {
                utilities.log('FAIL: invalid validator name');
                return false;
            }
        },

        validator: {
            notempty: {
                validate: function(self) {
                    utilities.log('Function: notempty.validate()');

                    var isValid,
                        value = self.value,
						type  = self.type;
					
					// Check for checkbox!
					utilities.log('Input type: ' + type);

					if ( ['checkbox','radio'].includes(type) ) {
						
						if ( type === 'checkbox' ) {
							utilities.log('Checkbox validation');

							if (self.checked) {
								isValid = true;
							} else {
								isValid = false;
							}
						} else {
							utilities.log('Radio validation not yet available');
						}

					} else {
						utilities.log('Regular validation');

						if (value.trim().length > 0) {
							isValid = true;
						} else {
							isValid = false;
						}
					}

                    return isValid;
                }
            }
        }
    };

    // Events binding
    var events = {
        bind: function(fieldElm, fieldValidators, formElm) {
            utilities.log('Function: events.bind for field');
			var validatorOptions = validation.getValidatorOptions(fieldElm);
			fieldValidators = (typeof fieldValidators === 'undefined'  || fieldValidators === null) ? [] : fieldValidators;
			utilities.log(fieldValidators);
			utilities.log(validatorOptions);

            fieldElm.on('blur.mfvBlur', function(event) {
                events.onChange(fieldElm, fieldValidators, validatorOptions, event, formElm);
            }, false);

            fieldElm.on('change.mfvChange', function(event) {
                events.onChange(fieldElm, fieldValidators, validatorOptions, event, formElm);
            }, false);

			if ( typeof validatorOptions.general !== 'undefined' && validatorOptions.general.keyUp !== 'undefined' && validatorOptions.general.keyUp > 0 && validatorOptions.general.keyUp <= 2 ) {
				fieldElm.on('keyup.mfvKeyup', function(event) {
					var isTabKey = false;

					if ( typeof event.key !== 'undefined' && event.key === 'Tab') {
						isTabKey = true;
					} else if (typeof event.code !== 'undefined' && event.code ==='Tab' ) {
						isTabKey = true;
					} else if (typeof event.keyCode !== 'undefined' && event.keyCode === 9) {
						isTabKey = true;
					}

					if (event.type === 'keyup' && isTabKey !== true) {
						events.onKeyUp(fieldElm, fieldValidators, validatorOptions, event, formElm);
					}
				}, false);
			}

            if (settings.initialRun === true) {
                validation.validateInput(fieldElm, fieldValidators, null, formElm);
            }
        },

        onChange: function(fieldElm, fieldValidators, validatorOptions, event, formElm) {
            utilities.log('Function: events.onchange');
			validatorOptions = (typeof validatorOptions === 'undefined') ? validation.getValidatorOptions(fieldElm) : validatorOptions;
            validation.validateInput(fieldElm, fieldValidators, event, formElm);

            // Check if there is an other field that should have it's validation triggered
            utilities.log('Check for trigger validation');
            utilities.log(validatorOptions);

            if ( typeof validatorOptions.general !== 'undefined' && typeof validatorOptions.general.triggerValidation !== 'undefined' && validatorOptions.general.triggerValidation.trim() !== '') {
                var triggerValidateSelector = validatorOptions.general.triggerValidation.trim();

                utilities.log('Trigger validation of other field: #' + triggerValidateSelector);
                var triggerField = document.getElementById(triggerValidateSelector);

                if (triggerField !== null && typeof triggerField !== 'undefined') {
                    setTimeout(function() {
                        validation.validateInput(triggerField, null, null, formElm);
                    }, 50); //
                }
            }
        },

		onKeyUp: function(fieldElm, fieldValidators, validatorOptions, event, formElm) {
            utilities.log('Function: events.onkeyup');
			validatorOptions = (typeof validatorOptions === 'undefined') ? validation.getValidatorOptions(fieldElm) : validatorOptions;
			utilities.log(validatorOptions);

			if ( typeof validatorOptions.general !== 'undefined' && validatorOptions.general.keyUp !== 'undefined' && validatorOptions.general.keyUp > 0 && validatorOptions.general.keyUp <= 2 ) {
				validation.validateInput(fieldElm, fieldValidators, event, formElm);
			}

		}
    };

    // Validation
    var validation = {
        // Get validators from field
        getValidators: function(fieldElm) {
            utilities.log('Function: validation.getValidators()');
            var dataValidators = fieldElm.dataset.validators;
            var fieldValidators = [];
            var fieldValidatorsTrimmed = [];

            if (typeof dataValidators !== 'undefined' && dataValidators.length > 0) {
                if ((dataValidators.indexOf(',') >= 0)) {
                    fieldValidators = dataValidators.trim().split(',');
                } else {
                    fieldValidators.push(dataValidators.trim());
                }
            }
            
            utilities.log('List found validators:');
            utilities.log(fieldValidators);
            
            // Loop through validators and trim name/input
            for (var i=0; i<fieldValidators.length; i++) {
                fieldValidatorsTrimmed.push(fieldValidators[i].trim());
            }
            fieldValidators = fieldValidatorsTrimmed;
            fieldValidatorsTrimmed = [];

            return fieldValidators;
        },

        getValidatorOptions: function(fieldElm) {
            var validatorOptions = {};

            if ('validatorOptions' in fieldElm.dataset && fieldElm.dataset.validatorOptions.trim() !== '') {
                validatorOptions = JSON.parse(fieldElm.dataset.validatorOptions.trim());

                if (typeof validatorOptions === 'undefined') {
                    validatorOptions = {};
                }
            }

            return validatorOptions;
        },

        // Get error text from field data attribute
        getErrorMessage: function(fieldElm) {
            var errorMessage = '';

            if (('errortext' in fieldElm.dataset)) {
                errorMessage = fieldElm.dataset.errormessage;
            }

            return errorMessage;
        },

        // Set error text in field data attribute
        setErrorText: function(fieldElm, errorText) {
            if ((typeof errorText === 'string' || errorText instanceof String)) {
                fieldElm.dataset.errortext = errorText;
            }

            return errorText;
        },

        // Update input field after validation
        updateInput: function(inputElm, isValid) {
            utilities.log('Function: validation.updateInput()');

            var errorText   = '';
            var parentElm   = inputElm.parentElement;
            
            if (settings.parentSelector !== false) {
                var tmpParentElm = utilities.getAncestor(inputElm, settings.parentSelector);

                if (tmpParentElm !== null) {
                    parentElm = tmpParentElm;
                }
            }

            var errorElm = parentElm.querySelector('.message-error');

            if (isValid === true) {
                utilities.log('Update valid');

                inputElm.dataset.validationStatus = settings.validationStatus.valid;
                parentElm.classList.remove(settings.classes.failed);
                parentElm.classList.add(settings.classes.passed);

                if (errorElm !== null) {
                    errorElm.remove();
                }
            } else if (isValid === false) {
                utilities.log('Update invalid');
                
                inputElm.dataset.validationStatus = settings.validationStatus.invalid;
                parentElm.classList.remove(settings.classes.passed);
                parentElm.classList.add(settings.classes.failed);
                errorText = validation.getErrorMessage(inputElm);
            } else {
                utilities.log('Update undefined (not valid and not invalid)');
                
                inputElm.dataset.validationStatus = settings.validationStatus.initial;
                parentElm.classList.remove(settings.classes.failed);
                parentElm.classList.remove(settings.classes.passed);

                if (errorElm !== null) {
                    errorElm.remove();
                }
            }

            if (errorText && errorText.length > 0 && isValid === false) {
                setTimeout( function() {
                    errorElm = parentElm.querySelector('.message-error');

                    if (errorElm !== null) {
                        errorElm.remove();
                    }
                    errorElm = document.createElement('span');
                    errorElm.classList.add('message-error');
                    errorElm.classList.add('message-error--validation');
                    errorElm.innerText = errorText;
                    parentElm.appendChild(errorElm);
                }, 100 );
            }

        },

        // Validate input field
        validateInput: function(inputElm, fieldValidators, triggerEvent, formElm) {
            var isValid;
            var isRequired = false;
            var validatorOptions = {};
			var onlyUpdateOnValid = false;
			triggerEvent = (typeof triggerEvent === 'undefined') ? null : triggerEvent;

            utilities.log('Function: validation.validateInput()');

            if (typeof fieldValidators === 'undefined' || fieldValidators === null) {
                // Try to fetch validators direct from element
                fieldValidators = validation.getValidators(inputElm);
            }

            validatorOptions = validation.getValidatorOptions(inputElm);

			if (
				triggerEvent !== null &&
				typeof triggerEvent.type !== 'undefined' &&
				triggerEvent.type === 'keyup' &&
				typeof validatorOptions.general !== 'undefined' && 
				validatorOptions.general.keyUp !== 'undefined' && 
				validatorOptions.general.keyUp === 1
			) {
				onlyUpdateOnValid = true;
			}

            // Only validate form fields that can be changed by the user
            if ( !inputElm.hasAttribute('hidden') && !inputElm.hasAttribute('disabled') ) {

                // Validate for required or not empty
                if (
                    (isValid === undefined || isValid === true) && 
                    (inputElm.hasAttribute('required') || (fieldValidators.indexOf('notempty') >= 0 ) || ('validateRequired' in inputElm.dataset))
                ) {
                    utilities.log('Validate not empty or required');
                    var notEmptyOptions = {};
                    if (typeof validatorOptions.notempty !== 'undefined') {
                        notEmptyOptions = validatorOptions.notempty;
                    }
                    isRequired = true;
                    isValid = validators.validator.notempty.validate(inputElm, notEmptyOptions);
                    utilities.log(isValid);

                    if (isValid !== true && typeof notEmptyOptions.errorText !== 'undefined' && notEmptyOptions.errorText.trim() !== '') {
                        validation.setErrorText(inputElm, notEmptyOptions.errorText.trim());
                    }
                }

                // Only perform other validators when fields is required and valid or is not required and has a value
                if ((isRequired === true && isValid === true) || (isRequired !== true && inputElm.value !== '' )) {
                    utilities.log('Loop through validators');

                    // Start looping through validators
                    for (var i=0; i<fieldValidators.length; i++) {
                        if (fieldValidators[i] !== 'notempty' && (isValid === undefined || isValid === true) && fieldValidators[i] in validators.validator) {
                            utilities.log('Validate: ' + fieldValidators[i]);

                            var thisValidatorOptions = {};
                            if (typeof validatorOptions[fieldValidators[i]] !== 'undefined') {
                                thisValidatorOptions = validatorOptions[fieldValidators[i]];
                            }

                            isValid = validators.validator[fieldValidators[i]].validate(inputElm, thisValidatorOptions);
                            utilities.log(isValid);

                            if (isValid !== true && typeof thisValidatorOptions.errorText !== 'undefined' && thisValidatorOptions.errorText.trim() !== '') {
                                validation.setErrorText(inputElm, thisValidatorOptions.errorText.trim());
                            }
                        }
                    }
                }

				// Check if stuff needs to be updates
				if (onlyUpdateOnValid === true) {
					if (isValid === true) {
						utilities.log('Update dom (only on valid)');
						validation.updateInput(inputElm, isValid);
                        return isValid;
					}
				} else {
					utilities.log('Update dom (regular)');
					validation.updateInput(inputElm, isValid);
                    return isValid;
				}
            }
        },
        
        validateForm: function(formElm,formFields) {
            var formValidationStatus = false;
            
            if (typeof formElm !== 'undefined' && formElm !== null) {
                formValidationStatus = true;
                
                // Set validation status on entire form
                formElm.dataset.validationStatus = settings.validationStatus.initial;
                
                if (typeof formFields === 'undefined' || formFields === null || formFields.length < 1) {
                    formFields = formElm.getElementsByClassName( 'mfvField' );
                }
            
                if (formFields !== null && formFields.length > 0) {
                    for (var i=0; i<formFields.length; i++) {
                        var thisFieldIsValid = validation.validateInput(formFields[i], null, null, formElm);
                        
                        if (thisFieldIsValid !== true) {
                            formElm.dataset.validationStatus = settings.validationStatus.invalid;
                            formValidationStatus = false;
                        }
                    }
                }
            }
            return formValidationStatus;
        },

        // Enable validation for input field
        enableInput: function(fieldElm,formElm) {
            utilities.log('Function: validation.enableInput()');

            if ('validators' in fieldElm.dataset) {
                var fieldValidators = validation.getValidators(fieldElm);

                utilities.log(fieldValidators);
                
                // Set validation status
                fieldElm.dataset.validationStatus = settings.validationStatus.initial;

                if (fieldValidators.length > 0) {
                    events.bind(fieldElm, fieldValidators, formElm);
                }
            }
        },

        // Enable validation for form
        enableForm: function(formElm) {
            utilities.log('Function: validation.enableForm()');

            var formFields = formElm.getElementsByClassName( 'mfvField' );
            var initialRun = false;
            var formOptions = {};

            if ('validatorOptions' in formElm.dataset && formElm.dataset.validatorOptions.trim() !== '') {
                formOptions = JSON.parse(formElm.dataset.validatorOptions.trim());
            }

            // Should the validation run on the complete form on page load (initial run)
            if (typeof formOptions.debug !== 'undefined' && formOptions.debug === true) {
                settings.debug = true;
            } else {
                settings.debug = false;
            }

            // Should the validation run on the complete form on page load (initial run)
            if (typeof formOptions.initialRun !== 'undefined' && formOptions.initialRun === true) {
                initialRun = true;
            }

            // Check if validation css classes need to be overwritten
            if (typeof formOptions.classes !== 'undefined') {
                utilities.log(formOptions.classes);
                for (var className in settings.classes) {
                    if (typeof formOptions.classes[className] === 'string' && formOptions.classes[className].trim().length > 0) {
                        settings.classes[className] = formOptions.classes[className].trim();
                    }
                }
            }

            // Check if parentSelector needs to be overwritten
            if (typeof formOptions.parentSelector !== 'undefined' && formOptions.parentSelector.trim().length > 0) {
                settings.parentSelector = formOptions.parentSelector.trim();
            }

            utilities.log(settings);
            
            // Set validation status on entire form
            formElm.dataset.validationStatus = settings.validationStatus.initial;

            // Enable form inputs
            if (formFields !== null && formFields.length > 0) {
                for (var i=0; i<formFields.length; i++) {
                    validation.enableInput(formFields[i],formElm);
                }

                if (initialRun === true) {
                    // Minimal timeout to prevent initialRun before extra (external) validators are added.
                    setTimeout(function() {
                        validation.validateForm(formElm,formFields);
                        // for (var j=0; j<formFields.length; j++) {
                        //     validation.validateInput(formFields[j],null, null, formElm);
                        // }
                    }, settings.initialRunTimeout);
                }
            }
        }
    };

    var init = function() {
        utilities.log('Function: init');
        utilities.log(settings);
        utilities.log(validators);

        var mfvForms = document.getElementsByClassName( 'mfvForm' );

        if (mfvForms !== null && mfvForms.length > 0) {
            for (var i=0; i<mfvForms.length; i++) {
                validation.enableForm(mfvForms[i]);
            }
        }
    };

    // Make functions public available
    return {
        init        : init,
        validators  : validators,
        validation  : validation,
        utilities   : utilities
    };

})();

// Initialize
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
    mightyFormValidator.init();
} else {
    document.addEventListener("DOMContentLoaded", mightyFormValidator.init());
}
