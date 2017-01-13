/**
 *  DynamoForm-formset-popout.js - A jquery based dynamic formset generator
 *  with popout data entry dialog window.
 *
 *  Author:     David Cramblett (dcramble@mesd.k12.or.us)
 *  License:    MIT
 */


$(document).ready(function() {


    /**
     * Add formset-popout row activity
     *
     * Open new data entry dialog window when add button is clicked. The user
     * will either save the entry or cancel out of the window.
     *
     */
    $('.dynamo-formset-popout').on('click', '.dynamo-formset-popout-add', function() {

        // Find the parent dynamo-formset
        var dynamoPopout = $(this).closest('.dynamo-formset-popout');

        // Find the number of existing rows
        var rowCount = dynamoPopout.find('.dynamo-formset-row').size();

        // Determine if Max Rows is specified
        var maxRows = dynamoPopout.attr('data-max-rows');
        if (undefined !== maxRows) {
            // Determine if Max Rows is exceeded and return false now if
            // yes. The add row button should be disabled if max rows has
            // been reached. This check is in here as a precaution.
            if (rowCount >= maxRows) {
                return false;
            }
        }

        // Create new dialog
        var dialog = createDialog(dynamoPopout, rowCount, maxRows, false);

        // Realize dialog without displaying
        dialog.realize();

        // Enable any Dynamo-Selectize fields
        if ('function' == typeof initDynamoSelectize) {
            var elements = dialog.getModalBody().find('.dynamo-selectize');
            initDynamoSelectize(elements);
        }


        // Enable or Re-enable any dynamo-datetimepicker fields
        if ('function' == typeof initBootstrapDateTimePicker) {
            dialog.getModalBody().find('.dynamo-datepicker').each(function() {
                initBootstrapDateTimePicker($(this));
            });
        }

        // Open dialog
        dialog.open();


        return false;
    });



     /**
     * Remove formset row activity
     *
     * Remove formset row when delete button is clicked. The specific row will be
     * deleted and all rows will be numerically re-indexed to ensure unique name
     * and id attribute when form is processed server side.
     *
     */
    $('.dynamo-formset-popout').on('click', '.dynamo-formset-row-delete', function() {

        // Find the parent dynamo-formset-popout
        var dynamoPopout = $(this).closest('.dynamo-formset-popout');

        // Determine if Min Rows is specified
        var minRows = dynamoPopout.attr('data-min-rows');
        if (undefined !== minRows) {
            // Determine if Min Rows is met and return false now if
            // yes. The delete row buttons should be disabled if min rows
            // has been reached. This check is in here as a precaution.
            if (dynamoPopout.find('.dynamo-formset-row').size() <= minRows) {
                return false;
            }
        }

        // Remove row
        $( this ).closest('.dynamo-formset-row').remove();

        // Update the row numbering
        updateRowIndex( dynamoPopout );

        // Determine if Min Rows is specified
        if (undefined !== minRows) {
            // Determine if Min Rows has been met. If yes
            // remove delete row button functionality.
            if (dynamoPopout.find('.dynamo-formset-row').size() == minRows) {
                dynamoPopout.find('.dynamo-formset-row-delete').addClass('disabled');
                dynamoPopout.find('.dynamo-formset-row-delete').attr('disabled', 'disabled');
            }
        }

        // Determine if Max Rows is specified
        var maxRows = dynamoPopout.attr('data-max-rows');
        if (undefined !== maxRows) {
            // Determine if Max Rows has now been maintained.
            // If yes, restore add row button functionality.
            if (dynamoPopout.find('.dynamo-formset-row').size() < maxRows) {
                dynamoPopout.find('.dynamo-formset-popout-add').removeClass('disabled');
                dynamoPopout.find('.dynamo-formset-popout-add').removeAttr('disabled');
            }
        }

        return false;
    });

});


/**
 * Edit formset row activity
 *
 * Display dialog window with formset row data when user clicks the edit
 * button.
 *
 */
$('.dynamo-formset-popout').on('click', '.dynamo-formset-row-edit', function() {

    // Find the parent dynamo-formset-popout
    var dynamoPopout = $(this).closest('.dynamo-formset-popout');

    // Find the triggering row
    var dynamoFormRow = $(this).closest('.dynamo-formset-row');

    // Find the number of existing rows
    var rowCount = dynamoPopout.find('.dynamo-formset-row').size();

    // Determine if Max Rows is specified
    var maxRows = dynamoPopout.attr('data-max-rows');

    // Create new dialog
    var dialog = createDialog(dynamoPopout, rowCount, maxRows, dynamoFormRow.index());

    // Realize dialog without displaying
    dialog.realize();

    /**
     * Set values from formset row into the dialog form, returning
     * any exisiting selectize elments to be post processed.
     *
     */
    var selectizeElements = processFromRow(dialog.getModalBody(), dynamoFormRow);

    /**
     *  Are there Dynamo-Selectize fields that need data copied back
     *  after initialization?
     *
     */
    if (!$.isEmptyObject(selectizeElements)) {
        $.each(selectizeElements, function(key, value) {
            var selectObject = dialog.getModalBody().find('#'+key);
            selectObject.attr('data-set-value', value.optionId);
            initDynamoSelectize(selectObject);

            if (!$.isEmptyObject(value.optionList)) {
                selectObject[0].selectize.addOption(value.optionList);
                selectObject[0].selectize.setValue(value.optionId);
            }
        })
    }

    // Enable or Re-enable any dynamo-datetimepicker fields
    if ('function' == typeof initBootstrapDateTimePicker) {
        dialog.getModalBody().find('.dynamo-datepicker').each(function() {
            initBootstrapDateTimePicker($(this));
        });
    }

    // Open dialog
    dialog.open();

    return false;
});


/**
 * Create Dialog form
 *
 */
function createDialog(dynamoPopout, rowCount, maxRows, editRow) {

    // Locate the popout prototype definition or throw error.
    if (undefined !==  dynamoPopout.attr('data-popout-prototype')) {
        var prototypeHtml = dynamoPopout.attr('data-popout-prototype');
        var popoutForm = $($.parseHTML(prototypeHtml));
    }
    else {
        console.error('ERROR: Dynamo-Formset-Popout requires a data-popout-prototype attribute.');
        return false;
    }

    // Add edit mode flag to popoutForm html if needed
    if (false !== editRow) {
        var editModeFlag = $($.parseHTML(
            '<input type="hidden" id="dynForm-popout-editMode" value ="' + editRow + '">'
        ));
        editModeFlag.appendTo(popoutForm);
    }

    // Check for popout title attribute or set default title.
    if (undefined !==  dynamoPopout.attr('data-popout-title')) {
        var popoutTitle = dynamoPopout.attr('data-popout-title');
    }
    else {
        var popoutTitle = 'Add Record';
    }

    // Check for button additional css classes
    var saveButtonClass = '';
    if (undefined !== dynamoPopout.attr('data-popout-saveButton-class')) {
        var saveButtonClass = dynamoPopout.attr('data-popout-saveButton-class');
    }
    var saveMoreButtonClass = '';
    if (undefined !== dynamoPopout.attr('data-popout-saveMoreButton-class')) {
        var saveMoreButtonClass = dynamoPopout.attr('data-popout-saveMoreButton-class');
    }
    var saveCloseButtonClass = ''
    if (undefined !== dynamoPopout.attr('data-popout-closeButton-class')) {
        var saveCloseButtonClass = dynamoPopout.attr('data-popout-closeButton-class');
    }

    var buttonList = [{
        label: 'Close',
        cssClass: saveCloseButtonClass,
        action: function(dialogRef) {
            dialogRef.close();
        }
    },
    {
        label: 'Save',
        cssClass: saveButtonClass,
        action: function(dialogRef) {

            // Get dialog form
            var dialogForm = dialogRef.getModalBody().find('form');

            // Validate form content
            var valid = validateForm(dialogForm)

            if (true === valid) {
                // Check for edit mode flag
                if (undefined !== dialogForm.find('input#dynForm-popout-editMode').attr('id')) {
                    // Update formset row
                    updateRow(dialogForm, dynamoPopout);
                }
                else {
                    // Process to formset row
                    processToRow(dialogForm, dynamoPopout, rowCount, maxRows);
                }

                dialogRef.close();
            }
            else {
                alert('Invalid!');
            }
        }
    }];

    // If not editing, then allow save and add another
    if (false === editRow) {
        buttonList.push({
            label: 'Save + Add Another',
            cssClass: saveMoreButtonClass,
            action: function(dialogRef) {

                // Get dialog form
                var dialogForm = dialogRef.getModalBody().find('form');

                // Validate form content
                var valid = validateForm(dialogForm)

                if (true === valid) {
                    // Process to formset row
                    processToRow(dialogForm, dynamoPopout, rowCount, maxRows);
                    clearPopoutForm(dialogForm);
                }
                else {
                    alert('Invalid!');
                }
            }
        });
    }

    // Create new dialog object
    var dialog = new BootstrapDialog({
        type: BootstrapDialog.TYPE_INFO,
        title: popoutTitle,
        message: popoutForm,
        closeByBackdrop: false,
        buttons: buttonList
    });

    /**
     *  Determine if any function should be run on events
     *
     *  Add/Edit Mode Specific functions will override, non-mode
     *  specific functions if both have been defined.
     */
    // Non-Mode Specific Functions
    if (undefined !== dynamoPopout.attr('data-onShown-function')) {
        var onShownFn = dynamoPopout.attr('data-onShown-function');
        dialog.onshown = dynamoFormsetPopoutCallbacks[onShownFn](dialog);
    }
    if (undefined !== dynamoPopout.attr('data-onHidden-function')) {
        var onHiddenFn = dynamoPopout.attr('data-onHidden-function');
        dialog.onhidden = dynamoFormsetPopoutCallbacks[onHiddenFn](dialog);
    }
    // Add New Record Specific Functions
    if (false === editRow) {
        if (undefined !== dynamoPopout.attr('data-onShown-add-function')) {
            var onShownAddFn = dynamoPopout.attr('data-onShown-add-function');
            dialog.onshown = dynamoFormsetPopoutCallbacks[onShownAddFn](dialog);
        }
        if (undefined !== dynamoPopout.attr('data-onHidden-add-function')) {
            var onHiddenAddFn = dynamoPopout.attr('data-onHidden-add-function');
            dialog.onhidden = dynamoFormsetPopoutCallbacks[onHiddenAddFn](dialog);
        }
    }
    // Edit Record Specific Functions
    else {
        if (undefined !== dynamoPopout.attr('data-onShown-edit-function')) {
            var onShownEditFn = dynamoPopout.attr('data-onShown-edit-function');
            var data = {};
            data.stuff = "Hey";
            dialog.onshown = dynamoFormsetPopoutCallbacks[onShownEditFn](dialog);
        }
        if (undefined !== dynamoPopout.attr('data-onHidden-edit-function')) {
            var onHiddenEditFn = dynamoPopout.attr('data-onHidden-edit-function');
            dialog.onhidden = dynamoFormsetPopoutCallbacks[onHiddenEditFn](dialog);
        }
    }


    return dialog;
}


/**
 * Process formset row into dialog form data when user edits
 * existing data.
 *
 */
function processFromRow(dialogBody, dynamoFormRow) {

    // Create object to track selectize elements
    var selectizeElements = {};

    dynamoFormRow.find('input,select').each(function(){

        // Get formset field
        var formsetInput = $(this);

        // Get Input Name and create a "begins with" pattern
        var formsetInputName = formsetInput.attr('name');
        if (undefined === formsetInputName) {
            // Skip un-named inputs
            return true;
        }

        // Remove any numerical indexing from attribute name
        formsetInputName = getUnindexedAttribute(formsetInputName);
        var pattern = "input[name='" + formsetInputName + "'],select[name='" + formsetInputName + "']";

        /*
         *  Check for formset input field in dialog form.
         *
         *  If matching field exists:

         *    Determine if dynamo-selectize is in use. If yes, grab selected
         *    item id to be stored and added back to selectize after
         *    initialization. If requested, also grab all options as well.
         *
         *    If selectize is not in use, update value in dialog form.
         *
         *  If matching field does not exist, ignore.
         *
         */
        var formField = dialogBody.find(pattern);
        if (formField.length) {
            if (formField.hasClass('dynamo-selectize')) {
                // Store current selectize item value to restore later.
                selectizeElements[formField.attr('id')] = {
                    optionId:     formsetInput.val()
                };
                if (undefined !== formField.attr('data-popout-store-options')) {
                    if ('true' === formField.attr('data-popout-store-options')) {
                        var selectizeOptions = JSON.parse(
                            formsetInput.attr('data-selectize-options')
                        );
                        selectizeElements[formField.attr('id')].optionList = selectizeOptions;
                    }
                }
            }
            else {
                formField.val(formsetInput.val());
            }
        }
    });

    return selectizeElements;
}


/**
 * Process Dialog form data into formset row
 *
 */
function processToRow(dialogForm, dynamoForm, rowCount, maxRows) {

    // Locate the formset row prototype definition or throw error.
    if ('undefined' !==  typeof dynamoForm.attr('data-row-prototype')) {
        var prototypeHtml = dynamoForm.attr('data-row-prototype');
        var baseRow = $($.parseHTML(prototypeHtml));
    }
    else {
        console.error('ERROR: Dynamo-Formset-Popout requires a data-row-prototype attribute.');
        return false;
    }

    // Iterate through dialog form inputs
    dialogForm.find('input,select').each(function(){
        // Get form field
        var formInput = $(this);

        // Get Input Name and create a "begins with" pattern
        var formInputName = formInput.attr('name');
        if (undefined === formInputName) {
            // Skip un-named inputs
            return true;
        }
        var pattern = "input[name^='" + formInputName + "_'],input[name^='" + formInputName + "-']";

        /**
         *  Determin if selectize options should be stored in formset field
         *
         *  This is common for remotely loaded data options that the user
         *  searched for, and may not be avilable immediately if the user
         *  chooses to edit the row later on. In this case, the inital
         *  options will be loaded from this attribute store method.
         */
         var selectizeOptions = null;
         if (undefined !== formInput[0].selectize && undefined !== formInput.attr('data-popout-store-options')) {
            if ('true' === formInput.attr('data-popout-store-options')) {
                var selectizeOptions = JSON.stringify(
                    formInput[0].selectize.getOptions()
                );
            }
         }

        /*
         *  Check for form input field in formset row
         *
         *  If matching field exists, store dialog form data in formset row,
         *  both in a hidden input to be passed for back-end processing, and
         *  also to be displayed as text in the formset row for user
         *  experience.
         *
         *  If matching field does not exist, store dialog form data in
         *  hidden input appended to formset row. The "_0 " row index on name
         *  and id attributes will be corrected during re-indexing below.
         */
        var baseField = baseRow.find(pattern);
        if (baseField.length) {
            baseField.val(formInput.val());
            baseField.after(formatTextNode(formInput.val()));
            if (null !== selectizeOptions) {
                baseField.attr('data-selectize-options', selectizeOptions);
            }
        }
        else{
            var newField = $($.parseHTML(
                '<input type="hidden" name="' + formInputName + '_0" id="' + formInputName + '_0" value ="' + formInput.val() + '">'
            ));
            newField.appendTo(baseRow);
            if (null !== selectizeOptions) {
                newField.attr('data-selectize-options', selectizeOptions);
            }
        }

    });

    /*
     *  If no rows exist, then prepend to formset container
     *  If row(s) exist, insert at end of formset
     */
    if (0 === rowCount) {
        var newRow = baseRow.clone().prependTo(dynamoForm);
    }
    else {
        var lastRow = dynamoForm.find('.dynamo-formset-row').last();
        var newRow = baseRow.clone().insertAfter(lastRow);
    }

    // Update Row indexing and Label indexing.
    updateRowIndex( dynamoForm );

    // Determine if Max Rows is specified
    if (undefined !== maxRows) {
        // Determine if Max Rows has been met. If yes
        // remove add row button functionality.
        if (dynamoForm.find('.dynamo-formset-row').size() == maxRows) {
            dynamoForm.find('.dynamo-formset-popout-add').addClass('disabled');
            dynamoForm.find('.dynamo-formset-popout-add').attr('disabled', 'disabled');
        }
    }

    // Determine if Min Rows is specified
    var minRows = dynamoForm.attr('data-min-rows');
    if (undefined !== minRows) {
        // Determine if Min Rows has now been exceeded.
        // If yes, restore delete button functionality.
        if (dynamoForm.find('.dynamo-formset-row').size() > minRows) {
            dynamoForm.find('.dynamo-formset-row-delete').removeClass('disabled');
            dynamoForm.find('.dynamo-formset-row-delete').removeAttr('disabled');
        }
    }
}


/**
 * Update formset row from dialog form data in edit mode.
 *
 */
function updateRow(dialogForm, dynamoForm) {

    // Locate the formset row prototype definition or throw error.
    if ('undefined' !==  typeof dynamoForm.attr('data-row-prototype')) {
        var prototypeHtml = dynamoForm.attr('data-row-prototype');
        var baseRow = $($.parseHTML(prototypeHtml));
    }
    else {
        console.error('ERROR: Dynamo-Formset-Popout requires a data-row-prototype attribute.');
        return false;
    }

    // Get original formset row index
    var formsetRowIndex = dialogForm.find('input#dynForm-popout-editMode').val();

    // Locate the formset row to update or throw error.
    var formsetRow = dynamoForm.find('.dynamo-formset-row').eq(formsetRowIndex);
    if ('undefined' ===  typeof formsetRow) {
        console.error('ERROR: Dynamo-Formset-Popout could not locate .dynamo-formset-row number ' + formsetRowIndex);

        return false;
    }

    // Iterate through dialog form inputs
    dialogForm.find('input,select').each(function(){
        // Get form field
        var formInput = $(this);

        // Get Input Name and create a "begins with" pattern
        var formInputName = formInput.attr('name');
        if (undefined === formInputName) {
            // Skip un-named inputs

            return true;
        }
        var pattern = "input[name^='" + formInputName + "_'],input[name^='" + formInputName + "-']";

        /**
         *  Determin if selectize options should be stored in formset field
         *
         *  This is common for remotely loaded data options that the user
         *  searched for, and may not be avilable immediately if the user
         *  chooses to edit the row later on. In this case, the inital
         *  options will be loaded from this attribute store method.
         */
         var selectizeOptions = null;
         if (undefined !== formInput[0].selectize && undefined !== formInput.attr('data-popout-store-options')) {
            if ('true' === formInput.attr('data-popout-store-options')) {
                var selectizeOptions = JSON.stringify(
                    formInput[0].selectize.getOptions()
                );
            }
         }

        /*
         *  Check for form input field in formset row
         *
         *  If matching field exists, store dialog form data in formset row,
         *  both in a hidden input to be passed for back-end processing, and
         *  also to be displayed as text in the formset row for user
         *  experience.
         *
         *  If matching field does not exist, store dialog form data in
         *  hidden input appended to formset row. The "_0 " row index on name
         *  and id attributes will be corrected during re-indexing below.
         */
        var baseField = baseRow.find(pattern);
        if (baseField.length) {
            var formsetRowField = formsetRow.find(pattern);
            if (formsetRowField.length) {
                formsetRowField.val(formInput.val());
                if (null !== selectizeOptions) {
                    formsetRowField.attr('data-selectize-options', selectizeOptions);
                }
                var textNode = formsetRowField.parent().contents().filter(function(){
                    return this.nodeType == 3;
                })[0];
                if ("undefined" !== typeof textNode) {
                    textNode.nodeValue = formInput.val();
                }
                else {
                    formsetRowField.after(formatTextNode(formInput.val()));
                }
            }
            else {
                console.error('ERROR: Dynamo-Formset-Popout could not locate .dynamo-formset-row display field with pattern ' + pattern);

                return false;
            }
        }
        else{
            var formsetRowField = formsetRow.find(pattern);
            if (formsetRowField.length) {
                formsetRowField.val(formInput.val());
                if (null !== selectizeOptions) {
                    formsetRowField.attr('data-selectize-options', selectizeOptions);
                }
            }
            else {
                console.error('ERROR: Dynamo-Formset-Popout could not locate .dynamo-formset-row hidden field with pattern ' + pattern);

                return false;
            }
        }

    });
}



/**
 * Validate dialog form data
 *
 */
function validateForm(dialogForm) {

    return true;
}


/**
 * Clear dialog form data
 *
 */
function clearPopoutForm(dialogForm) {

    dialogForm.find('input,select').each(function(){
        var formField = $(this);

        // Check for selectize
        if(formField.hasClass('dynamo-selectize')) {
            formField[0].selectize.clear();
        }
        else {
            formField.val('');
        }
    });
}


/**
 * Re-index formset rows
 *
 * Row indexing is updated after a formset row has been added or deleted.
 *
 */
function updateRowIndex(obj) {

    var index = 1;

    obj.find('.dynamo-formset-row').each( function() {

        var dynamoFormRow = $(this);

        // Re-index 'id' attribute
        if ( undefined !== dynamoFormRow.attr('id') ) {
            dynamoFormRow.attr('id', reindexIdentityAttribute( dynamoFormRow.attr('id'), index));
        }

        dynamoFormRow.find('*').not('option').each( function() {

            // Re-index 'id' attribute
            if ( undefined !== $(this).attr('id') ) {
                $(this).attr('id', reindexIdentityAttribute( $(this).attr('id'), index));
            }

            // Re-index 'name' attribute
            if ( undefined !== $(this).attr('name') ) {
                $(this).attr('name', reindexIdentityAttribute($(this).attr('name'), index));
            }

            // Re-index 'for' attribute
            if ( undefined !== $(this).attr('for') ) {
                $(this).attr('for', reindexIdentityAttribute($(this).attr('for'), index));
            }

            // Re-index dynamo-selectize data-chain-child / data-chain-parent
            if ( undefined !== $(this).attr('data-chain-child') ) {
                $(this).attr(
                    'data-chain-child',
                    reindexDynamoSelectizeAttribute(
                        $(this).attr('data-chain-child'),
                        index
                    )
                );
            }
            if ( undefined !== $(this).attr('data-chain-parent') ) {
                $(this).attr(
                    'data-chain-parent',
                    reindexDynamoSelectizeAttribute(
                        $(this).attr('data-chain-parent'),
                        index
                    )
                );
            }
            if ( undefined !== $(this).attr('data-chain-parent-deactivate') ) {
                $(this).attr(
                    'data-chain-parent-deactivate',
                    reindexDynamoSelectizeAttribute(
                        $(this).attr('data-chain-parent-deactivate'),
                        index
                    )
                );
            }

            // Re-index label text if requested
            if ( 'true' == $(this).attr('data-dynamo-relabel') ) {
                $(this).text(reindexText($(this).text(), index));

                // Re-index 'for' attributes on labels
                if ( undefined !== $(this).attr('for') ) {
                    $(this).attr('for', reindexIdentityAttribute($(this).attr('for'), index));
                }
            }

            // Re-index dynamo-selectize url variables if needed
            if ($(this).hasClass('dynamo-selectize') && undefined !== $(this).attr('data-load-url')) {
                $(this).attr(
                    'data-load-url',
                    reindexUrlVariables(
                        $(this).attr('data-load-url'),
                        index
                    )
                );
            }
        });

        index++;
    });
}


/**
 * Get the attribute name after removing any numerical indexing.
 *
 */
function getUnindexedAttribute(attribute) {
    attribute = attribute.replace(/\_\d+/, '');
    attribute = attribute.replace(/\d+]/, '');

    return attribute;
}


/**
 * Re-index id, name, and for attributes
 *
 * Check attribute for integer index pattern and update the attribute
 * when pattern is matched.
 */
function reindexIdentityAttribute(attribute, index) {
    attribute = attribute.replace(/\_\d+/, '_' + index);
    attribute = attribute.replace(/\d+]/, index + ']');

    return attribute;
}


/**
 * Re-index element text
 *
 * Check element text for index pattern and update the text when
 * pattern is matched.
 */
function reindexText(text, index) {
    text = text.replace(/\ \d+$/, ' ' + index);

    return text;
}


/**
 * Re-index dynamo-selectize attributes
 *
 * Check attribute for integer index pattern and update the attribute
 * when pattern is matched.
 */
function reindexDynamoSelectizeAttribute(attribute, index) {
    attribute = attribute.replace(/\_\d+\"/g, '_' + index + '"');

    return attribute;
}


/**
 * Re-index dynamo-selectize url variables
 *
 * Check url string for variables with integer index pattern and
 * update the variable when pattern is matched.
 */
function reindexUrlVariables(attribute, index) {
    attribute = attribute.replace(/\{(\w+)\_\d+\}/g, '{' + '$1' + '_' + index + '}');

    return attribute;
}


/**
 * Format Text Nodes with empty strings
 *
 * Empty text nodes cause html/css display formating issues when
 * no text is present (empty strings). This function adds an html
 * non-breaking space in place of empty strings to resolve the
 * formating issues.
 */
function formatTextNode(stringValue) {
    if ('' == stringValue) {
        return '&nbsp;';
    }
    else {
        return stringValue;
    }

}
