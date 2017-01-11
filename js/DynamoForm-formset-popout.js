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
        var dynamoForm = $(this).closest('.dynamo-formset-popout');

        // Find the number of existing rows
        var rowCount = dynamoForm.find('.dynamo-formset-row').size();

        // Determine if Max Rows is specified
        var maxRows = dynamoForm.attr('data-max-rows');
        if (undefined !== maxRows) {
            // Determine if Max Rows is exceeded and return false now if
            // yes. The add row button should be disabled if max rows has
            // been reached. This check is in here as a precaution.
            if (rowCount >= maxRows) {
                return false;
            }
        }

        // Check for popout title attribute or set default title.
        if ('undefined' !==  typeof dynamoForm.attr('data-popout-title')) {
            var popoutTitle = dynamoForm.attr('data-popout-title');
        }
        else {
            var popoutTitle = 'Add Record';
        }

        // Locate the popout prototype definition or throw error.
        if ('undefined' !==  typeof dynamoForm.attr('data-popout-prototype')) {
            var prototypeHtml = dynamoForm.attr('data-popout-prototype');
            var popoutForm = $($.parseHTML(prototypeHtml));
        }
        else {
            console.error('ERROR: Dynamo-Formset-Popout requires a data-popout-prototype attribute.');
            return false;
        }

        // Create new dialog
        var dialog = createDialog(popoutTitle, popoutForm, dynamoForm, rowCount, maxRows);

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
        var dynamoForm = $(this).closest('.dynamo-formset-popout');

        // Determine if Min Rows is specified
        var minRows = dynamoForm.attr('data-min-rows');
        if (undefined !== minRows) {
            // Determine if Min Rows is met and return false now if
            // yes. The delete row buttons should be disabled if min rows
            // has been reached. This check is in here as a precaution.
            if (dynamoForm.find('.dynamo-formset-row').size() <= minRows) {
                return false;
            }
        }

        // Remove row
        $( this ).closest('.dynamo-formset-row').remove();

        // Update the row numbering
        updateRowIndex( dynamoForm );

        // Determine if Min Rows is specified
        if (undefined !== minRows) {
            // Determine if Min Rows has been met. If yes
            // remove delete row button functionality.
            if (dynamoForm.find('.dynamo-formset-row').size() == minRows) {
                dynamoForm.find('.dynamo-formset-row-delete').addClass('disabled');
                dynamoForm.find('.dynamo-formset-row-delete').attr('disabled', 'disabled');
            }
        }

        // Determine if Max Rows is specified
        var maxRows = dynamoForm.attr('data-max-rows');
        if (undefined !== maxRows) {
            // Determine if Max Rows has now been maintained.
            // If yes, restore add row button functionality.
            if (dynamoForm.find('.dynamo-formset-row').size() < maxRows) {
                dynamoForm.find('.dynamo-formset-popout-add').removeClass('disabled');
                dynamoForm.find('.dynamo-formset-popout-add').removeAttr('disabled');
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
    var dynamoForm = $(this).closest('.dynamo-formset-popout');

    // Find the triggering row
    var dynamoFormRow = $(this).closest('.dynamo-formset-row');

    // Find the number of existing rows
    var rowCount = dynamoForm.find('.dynamo-formset-row').size();

    // Determine if Max Rows is specified
    var maxRows = dynamoForm.attr('data-max-rows');
    if (undefined !== maxRows) {
        // Determine if Max Rows is exceeded and return false now if
        // yes. The add row button should be disabled if max rows has
        // been reached. This check is in here as a precaution.
        if (rowCount >= maxRows) {
            return false;
        }
    }

    // Check for popout title attribute or set default title.
    if ('undefined' !==  typeof dynamoForm.attr('data-popout-title')) {
        var popoutTitle = dynamoForm.attr('data-popout-title');
    }
    else {
        var popoutTitle = 'Add Record';
    }

    // Locate the popout prototype definition or throw error.
    if ('undefined' !==  typeof dynamoForm.attr('data-popout-prototype')) {
        var prototypeHtml = dynamoForm.attr('data-popout-prototype');
        var popoutForm = $($.parseHTML(prototypeHtml));
    }
    else {
        console.error('ERROR: Dynamo-Formset-Popout requires a data-popout-prototype attribute.');
        return false;
    }

    // Add edit mode flag to popoutForm html
    var editModeFlag = $($.parseHTML(
        '<input type="hidden" id="dynForm-popout-editMode" value ="' + dynamoFormRow.index() + '">'
    ));
    editModeFlag.appendTo(popoutForm);


    // Create new dialog
    var dialog = createDialog(popoutTitle, popoutForm, dynamoForm, rowCount, maxRows);

    // Realize dialog without displaying
    dialog.realize();

    // Set values from formset row into dialog form
    processFromRow(dialog.getModalBody(), dynamoFormRow);

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
 * Create Dialog form
 *
 */
function createDialog(popoutTitle, popoutForm, dynamoForm, rowCount, maxRows) {

    var dialog = new BootstrapDialog({
        type: BootstrapDialog.TYPE_INFO,
        title: popoutTitle,
        message: popoutForm,
        closeByBackdrop: false,
        buttons: [{
            label: 'Close',
            cssClass: 'pull-left btn-default',
            action: function(dialogRef) {
                dialogRef.close();
            }
        },
        {
            label: 'Save',
            cssClass: 'btn-info',
            action: function(dialogRef) {

                // Get dialog form
                var dialogForm = dialogRef.getModalBody().find('form');

                // Validate form content
                var valid = validateForm(dialogForm)

                if (true === valid) {
                    // Check for edit mode flag
                    if (undefined !== dialogForm.find('input#dynForm-popout-editMode').attr('id')) {
                        // Update formset row
                        updateRow(dialogForm, dynamoForm, rowCount, maxRows);
                    }
                    else {
                        // Process to formset row
                        processToRow(dialogForm, dynamoForm, rowCount, maxRows);
                    }                    

                    dialogRef.close();                    
                }
                else {
                    alert('Invalid!');
                }
            }
        }]
    });

    return dialog;
}


/**
 * Process formset row into dialog form data
 *
 */
function processFromRow(dialogBody, dynamoFormRow) {

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
         *  If matching field exists, update value in dialog form.
         *
         *  If matching field does not exist, ignore.
         */
        var formField = dialogBody.find(pattern);
        if (formField.length) {
            formField.val(formsetInput.val());
        }
        else {
            console.log(pattern);
        }
    });

    console.log

    return false;
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
            baseField.after(formInput.val());
        }
        else{
            var newField = $($.parseHTML(
                '<input type="hidden" name="' + formInputName + '_0" id="' + formInputName + '_0" value ="' + formInput.val() + '">'
            ));
            newField.appendTo(baseRow);
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
 * Update formset row from dialog form data
 *
 */
function updateRow(dialogForm, dynamoForm, rowCount, maxRows) {

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
                formsetRowField.parent().contents().filter(function(){ 
                    return this.nodeType == 3; 
                })[0].nodeValue = formInput.val();
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
            }
            else {
                console.error('ERROR: Dynamo-Formset-Popout could not locate .dynamo-formset-row hidden field with pattern ' + pattern);

                return false;
            }
        }

    });

/*
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
    */
}



/**
 * Validate dialog form data
 *
 */
function validateForm(dialogForm) {

    return true;
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