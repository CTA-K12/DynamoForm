/**
 *  DynamoForm-datetimepicker.js - Enable the bootstrap 3 datetimepicker js
 * library using html attributes.
 *
 *  Author:     David Cramblett (dcramble@mesd.k12.or.us)
 *  License:    MIT
 */
$(document).ready(function() {

    /**
     * Enable bootstrap-datetimepicker on desired form elements
     *
     * Process all elements with class 'bs-datepicker', parsing all of the
     * attribute options for each element and enabling the desired
     * configuration for the specific element.
     *
     */
    var formElements = $('.dynamo-datepicker');
    initBootstrapDateTimePicker(formElements);

});


/**
 * Initialize bootstrap-datetimepicker elements
 *
 */
function initBootstrapDateTimePicker(formElements) {

    // Enable Selectize on each element
    $.each(formElements, function() {

        // Parse the elements attribute options into the selectize format.
        var options = buildBootstrapDateTimePickerOptionsObject($(this));

        // Enable selectize on the element with the desired option
        // configuration.
        $(this).datetimepicker(options);
    });
}


/**
 * Build bootstrap-datetimepicker option object
 *
 * A html data-[option] attribute exists for each datetimepicker option. The
 * data-[option] attributes are processed in way that options with invalid
 * setting data will be defaulted to the datetimepicker designated default
 * value, when possible.
 *
 */
function buildBootstrapDateTimePickerOptionsObject(formElement) {

    var _options = {};

    // data-defaultDate: false | Can be "now" for curent date / time
    if ('undefined' !==  typeof formElement.attr('data-defaultDate')) {
        if ('now' === formElement.attr('data-defaultDate')) {
            _options.defaultDate = new Date();
        }
        else if ('false' != formElement.attr('data-defaultDate')) {
            _options.defaultDate = formElement.attr('data-defaultDate');
        }
    }

    // data-format: null
    if ('undefined' !==  typeof formElement.attr('data-format')) {
        //If defined any way other than string 'null', use user string
        if ('null' !== formElement.attr('data-format')) {
            _options.format = formElement.attr('data-format');
        }
    }

    // data-useCurrent: true
    if ('undefined' !==  typeof formElement.attr('data-useCurrent')) {
        //If defined any way other than string 'false', use default
        if ('false' === formElement.attr('data-useCurrent').toLowerCase()) {
            _options.useCurrent = false;
        }
    }

    return _options;

} //END buildSelectizeOptionsObject(formElement)
