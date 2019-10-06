# Mighty Form Validator

Generic client-side form validator written in JavaScript with focus on being:

* Lightweight
* Extendable
* Easy-to-use

Version: 0.1.0

For changes, see changelog: [CHANGELOG.md](CHANGELOG.md)


## Requirements

- Nuthin', it's all plain ol' JavaScript


## Installation

1. Include `dist/mightyFormValidator.min.js` (_Validator Engine_), or include `dist/mightyFormValidator.full.js` to include all current available validators with the _Validator Engine_ in 1 file and skip step 2.
2. Include the validators of your choosing from `src/js/validators`
3. Have fun!


## Documentation

The validator loops through all fields that require validation within your form.

To select a form for validation you have to add the css class `mfvForm` to the form tag. Within this form, the fields dat need validation should have the css class `mfvField` assigned to them.


### Options

#### Form options

Options for the entire form can be set by adding a data-attribute `data-validator-options` to the form tag with a json string.

__Example:__
```HTML
<input type="text" name="input1" data-validator-options='{"initialRun": true, "debug": true, "classes": {"passed": "is_valid", "failed": "is_error"}}'
```

The following options are available: 

| Option | Description |
| ----- | ------------ |
| __initialRun__ | Validate the form on page-load |
| __classes__ | Set custom CSS classes to add to a form when it is valid or invalid is. Default are `validation-passed` and `validation-failed` |
| __debug__ | Enable debug-mode. When enabled, the console.log() is filled with debug info |

---

#### Field options

For each form field you can choose which validators to run and set some options per validator. With the data-attribute `data-validators` you can select the validators you want to run on the form field. Multiple validators are seperated with a comma (NO SPACES).

__Example:__
```HTML
<input type="text" name="input1" data-validators="notempty,email"
```

Validators can have extra options. With the data-attribute `data-validator-options` you van set these options for each validator.

There are also a few non-validator-specific options, these are grouped within `general`.

__Example:__ 
```HTML
<input type="text" name="input1" data-validator-options='{"general": {"validatorTrigger": "field_id"}, "number": {"decimals": false}, "customvalidator" {"setting1": "this", "setting2": "that"}}'
```

Non-validator-specific form field options:

| Option | Description |
| ----- | ------------ |
| __validatorTrigger__ | The ID of the field that gets revalidated when the current field changes. |
| _keyUp_ | __Not available yet__ Trigger field validation on the key up event, possible values: `0` (no, default), `1` (only show if field is valid), `2` (show if field is valid or invalid). |

---

### Error messages

It's possible to display an message when a field is invalid. This message can be set with the data-attribute `data-errortext`.

When you have multiple validators on a form field, it is possible to have a custom error message for each validator. With the data-attribute `data-validator-options` you can set an error message for each validator. These error messages will overwrite any messages set with `data-errortext`.

If no error message is set, none will be shown.

__Example:__ 
```HTML
<input type="text" name="input1" data-validator-options='{"notempty": {"errorText": "This is a required field"}, "email": {"errorText": "Enter a valid email address"}}'>
```


### Validators

The validators are executed in the order they are places in `data-validators`. When a validator fails, the validation of the field is halted and the field will be set `invalid`.

__NOTE:__ The `notempty` validator is a special one and is always executed first when assigned to a form field.

__NOTE 2:__ The `notempty` validator is also the only validator that is defined in the _validator engine_ core file (`mightyFormValidator.js`). All other validators are defined exernally. The default (core) validators can be found in the `validators` folder.

__NOTE 3:__ When the `notempty` validator is not assigned to a field, the field is not required. Other validators assigned to the field are only executed when the field is not empty. So the field is only validated when it has a value. When empty, the field is not valid or invalid, it is unvalidated.


| Validator | Name | Description | Options |
| --------- | ------------ | ------- | ------ |
| Required field | __notempty__ | Check if field is not empty. Default in the _validator engine_. | No options |
| E-mail | __email__ | Check if the value is formatted as a valid email address. | No options |
| Date | __date__ | Check if value is a valid date. Optionally with auto-correction of the input, allow/disable future dates, allow short year (2 digits) | __acceptShortyear__ allow 2 digits notation for date year. Boolean, default `false` <br/>__correctFormat__ Auto-correct input date. Boolean, default `false` <br/>__allowFuture__ Allow future date, default `true` |
| Min / max length | __length__ | Check if value has a minimum and/or maximum string lenght. | __min__ Minimum lenght. Interger, optional<br/> __max__ Maximum lenght. Interger, optional |
| Number | __number__ | Check if value is a number, optional with or without decimals. | __decimals__ Allow decimals. Boolean, default `true`. |
| Custom regex | __regex__ | Validate the value against a custom regular expression. | __regex__ Regular Expression to validate against. String, ie. `"^[0-9]{4}([ ]){0,1}([a-zA-Z]){2}$"` |
| Equals | __equals__ | Compare field value with another fields value. | __compareElement__ CSS selector for the other field. String: ie. `#ditveld` |
| Zipcode | __zipcode__ | Check if the value is formatted as a valid zipcode. Custom zipcode-regexs can be added with: `mightyFormValidator.validators.zipcode.addRegex('PL', regExp);` | __country__ Country to validate `NL`,`BE`,`DE`. String, default `NL`<br/> __correctFormat__ Auto-correct input, Dutch zipcodes (NL) only? Boolean, default `false` |

---

## Example HTML form

```HTML
<form class="form mfvForm" data-validator-options='{"initialRun": true, "classes": {"passed": "is_valid", "failed": "is_error"}}'>
    <div class="form__group">
        <label>Name: </label>
        <input class="mfvField" type="text" name="name" value="" data-validators="notempty" data-errortext="Required field">
    </div>
    <div class="form__group">
        <label>Street: </label>
        <input class="mfvField" type="text" name="street" value="" data-validators="notempty" data-errortext="Required field">
    </div>
    <div class="form__group">
        <label>Housenumber: </label>
        <input class="mfvField" type="text" name="number" value="" data-validators="number" data-validator-options='{"number": {"decimals": false}}' data-errortext="Invalid number">
    </div>
    <div class="form__group">
        <label>Birth Date: </label>
        <input class="mfvField" type="text" name="date" value="" data-validators="date" data-validator-options='{date: "acceptShortyear": true, "correctFormat": true, "allowFuture": false}}' data-errortext="Invalid birth date (dd-mm-yyyy)">
    </div>
    <div class="form__group">
        <label>E-mail: </label>
        <input class="mfvField" type="text" name="email" value="" data-validators="notempty,email" data-errortext="Invalid e-mail address">
    </div>
    
    <fieldset>
        <div class="form__group">
            <label>Field 1: </label>
            <input id="field1" class="mfvField" data-validators="notempty" type="text" name="field1" value="">
        </div>

        <div class="form__group">
            <label>Field 2: </label>
            <input id="field2" class="mfvField" data-validators="notempty,equals" data-validator-options='{"equals": {"compareElement": "#field1"}}' type="text" name="field2" value="">
        </div>
    </fieldset>
    
    <div class="form__group">
        <button type="submit">Submit</button>
    </div>
</form>
```

---

## Development

For information about developing on this project, see: [DEVELOPMENT.md](DEVELOPMENT.md)
