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
            var popout = $($.parseHTML(prototypeHtml));
        }
        else {
            console.error('ERROR: Dynamo-Formset-Popout requires a data-popout-prototype attribute.');
            return false;
        }

        // Display dialog
        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_INFO,
            title: popoutTitle,
            message: popout,
            closeByBackdrop: false,
            buttons: [{
                label: 'Cancel',
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
                    // validateForm(dialogForm)

                    // Proccess to formset row
                    processToRow(dialogForm, dynamoForm, rowCount);

                    //dialogRef.close();
                }
            }]
        });


/*
        // Enable any Dynamo-Selectize fields
        if ('function' == typeof initDynamoSelectize) {
            var elements = newRow.find('.dynamo-selectize');
            initDynamoSelectize(elements);
        }


        // Enable or Re-enable any dynamo-datetimepicker fields
        if ('function' == typeof initBootstrapDateTimePicker) {
            newRow.find('.dynamo-datepicker').each(function() {
                initBootstrapDateTimePicker($(this));
            });
        }
*/

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
 * Process Dialog form data into formset row
 *
 */
function processToRow(dialogForm, dynamoForm, rowCount) {

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
    dialogForm.find('input').each(function(){
        // Get form field
        var formInput = $(this);

        // Get Input Name and create starts with pattern
        var formInputName = formInput.attr('name');
        var pattern = "input[name^='" + formInputName + "_'],input[name^='" + formInputName + "-']";

        /*
         *  Check for input field in formset row
         *
         *  If field exisits, store dialog form data in formset row.
         *
         *  If field does not exisit, store dialog form data in hidden input
         *  appended to formset row.
         */
        var baseField = baseRow.find(pattern);
        if (baseField.length) {
            //console.log(baseField);
            baseField.val(formInput.val());
            baseField.after(formInput.val());
        }
        else{

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
 * Increment index on item key
 *
 * Check key for integer index pattern and increment the key
 * when pattern is matched.
 */
function incrementItemKey(key) {

    var myRegexp = /(.*)\_(\d+)(\_?.*)/;
    var match = myRegexp.exec(key);

    if (null === match) {
        return key;
    }

    return  match[1] + '_' + (parseInt(match[2]) + 1) + match[3];
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