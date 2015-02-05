$(document).ready(function() {

    // Enable selectize on desired select elements
    $('.dynamo-selectize').each(function(){
        _options = buildOptionsObject($(this));

       //console.log( _options );

       $(this).selectize(_options);
    });

});


/**
 * Selectize option processing
 *
 * A html data-[option] attribute exist for each Selectize option.
 * The data-[option] attributes are processed in way that options
 * with invalid setting data will be defaulted to the Selectize
 * designated default value, when possible.
 *
 */
function buildOptionsObject(formElement) {

    var _options = {};

    // data-diacritics: true
    if ('undefined' !==  typeof formElement.attr('data-diacritics')) {
        //If defined any way other than string 'false', use selectize default
        if ('false' === formElement.attr('data-diacritics').toLowerCase()) {
            _options.diacritics = false;
        }
    }

    // data-create: false
    if ('undefined' !==  typeof formElement.attr('data-create')) {
        //If defined any way other than string 'true', use selectize default
        if ('true' === formElement.attr('data-create').toLowerCase()) {
            _options.create = true;
        }
    }

    // data-createOnBlur: false
    if ('undefined' !==  typeof formElement.attr('data-createOnBlur')) {
        //If defined any way other than string 'true', use selectize default
        if ('true' === formElement.attr('data-createOnBlur').toLowerCase()) {
            _options.createOnBlur = true;
        }
    }

    // data-createFilter: null
    if ('undefined' !==  typeof formElement.attr('data-createFilter')) {
        //If defined any way other than string 'null', use user string
        if ('null' !== formElement.attr('data-createFilter').toLowerCase()) {
            _options.createFilter = formElement.attr('data-createFilter');
        }
    }

    // data-highlight: true
    if ('undefined' !==  typeof formElement.attr('data-highlight')) {
        //If defined any way other than string 'false', use selectize default
        if ('false' === formElement.attr('data-highlight').toLowerCase()) {
            _options.highlight = false;
        }
    }

    // data-persist: true
    if ('undefined' !==  typeof formElement.attr('data-persist')) {
        //If defined any way other than string 'false', use selectize default
        if ('false' === formElement.attr('data-persist').toLowerCase()) {
            _options.persist = false;
        }
    }

    // data-openOnFocus: true
    if ('undefined' !==  typeof formElement.attr('data-openOnFocus')) {
        //If defined any way other than string 'false', use selectize default
        if ('false' === formElement.attr('data-openOnFocus').toLowerCase()) {
            _options.openOnFocus = false;
        }
    }

    // data-maxOptions: 1000
    if ('undefined' !==  typeof formElement.attr('data-maxOptions')) {
        if (!isNaN(parseInt(formElement.attr('data-maxOptions')))) {
            _options.maxOptions = parseInt(formElement.attr('data-maxOptions'));
        }
    }

    // data-maxItems: 1
    if ('undefined' !==  typeof formElement.attr('data-maxItems')) {
        if (!isNaN(parseInt(formElement.attr('data-maxItems')))) {
            _options.maxItems = parseInt(formElement.attr('data-maxItems'));
        }
    }

    // data-hideSelected: false
    if ('undefined' !==  typeof formElement.attr('data-hideSelected')) {
        //If defined any way other than string 'true', use selectize default
        if ('true' === formElement.attr('data-hideSelected').toLowerCase()) {
            _options.hideSelected = true;
        }
    }

    // data-allowEmptyOption: false
    if ('undefined' !==  typeof formElement.attr('data-allowEmptyOption')) {
        //If defined any way other than string 'true', use selectize default
        if ('true' === formElement.attr('data-allowEmptyOption').toLowerCase()) {
            _options.allowEmptyOption = true;
        }
    }

    // data-scrollDuration: 60
    if ('undefined' !==  typeof formElement.attr('data-scrollDuration')) {
        if (!isNaN(parseInt(formElement.attr('data-scrollDuration')))) {
            _options.scrollDuration = parseInt(formElement.attr('data-scrollDuration'));
        }
    }

    // data-loadThrottle: 300
    if ('undefined' !==  typeof formElement.attr('data-loadThrottle')) {
        if (!isNaN(parseInt(formElement.attr('data-loadThrottle')))) {
            _options.loadThrottle = parseInt(formElement.attr('data-loadThrottle'));
        }
    }

    // data-loadingClass: 'loading'
    if ('undefined' !==  typeof formElement.attr('data-loadingClass')) {
        //If defined any way other than string 'loading', use user string
        if ('loading' !== formElement.attr('data-loadingClass').toLowerCase()) {
            _options.loadingClass = formElement.attr('data-loadingClass');
        }
    }

    // data-preload: false | Can be boolean or string
    if ('undefined' !==  typeof formElement.attr('data-preload')) {
        //If defined string 'true', use boolean true
        if ('true' === formElement.attr('data-preload').toLowerCase()) {
            _options.preload = true;
        }
        //If defined string 'focus', use string focus
        else if ('focus' === formElement.attr('data-preload').toLowerCase()) {
            _options.preload = 'focus';
        }
        //If defined any other way, use selectize default
    }

    // data-dropdownParent: null
    if ('undefined' !==  typeof formElement.attr('data-dropdownParent')) {
        //If defined any way other than string 'body', use selectize default
        if ('body' === formElement.attr('data-dropdownParent').toLowerCase()) {
            _options.dropdownParent = 'body';
        }
    }

   // data-addPrecedence: false
    if ('undefined' !==  typeof formElement.attr('data-addPrecedence')) {
        //If defined any way other than string 'true', use selectize default
        if ('true' === formElement.attr('data-addPrecedence').toLowerCase()) {
            _options.addPrecedence = true;
        }
    }

    // data-selectOnTab: false
    if ('undefined' !==  typeof formElement.attr('data-selectOnTab')) {
        //If defined any way other than string 'true', use selectize default
        if ('true' === formElement.attr('data-selectOnTab').toLowerCase()) {
            _options.selectOnTab = true;
        }
    }

    /** data-options: []
     *
     *  The JSON.parse method expects the string data to be in proper form
     *  to be successfully parsed. It's important that all strings, including
     *  the object key names, be surrounded in double quotes. This means you
     *  will likely need to surround the html attribute value in single quotes.
     *
     *  Example:
     *
     *    <select
     *      class="dynamo-selectize"
     *      data-options='[
     *        {
     *          "value": 1,
     *          "text": "Portland"
     *        },
     *        {
     *          "value": 2,
     *         "text": "Astoria"
     *        },
     *        {
     *         "value": 3,
     *         "text": "Vancouver"
     *        }
     *      ]'
     *    >
     */
    if ('undefined' !==  typeof formElement.attr('data-options')) {
        try {
            _options.options = JSON.parse(formElement.attr('data-options'));
        } catch (e) {}
    }

    // data-dataAttr: 'data-data'
    if ('undefined' !==  typeof formElement.attr('data-dataAttr')) {
        _options.dataAttr = formElement.attr('data-dataAttr');
    }

    // data-valueField: 'value'
    if ('undefined' !==  typeof formElement.attr('data-valueField')) {
        _options.valueField = formElement.attr('data-valueField');
    }

    // data-optgroupValueField: 'value'
    if ('undefined' !==  typeof formElement.attr('data-optgroupValueField')) {
        _options.optgroupValueField = formElement.attr('data-optgroupValueField');
    }

    // data-labelField: 'text'
    if ('undefined' !==  typeof formElement.attr('data-labelField')) {
        _options.labelField = formElement.attr('data-labelField');
    }

    // data-optgroupLabelField: 'label'
    if ('undefined' !==  typeof formElement.attr('data-optgroupLabelField')) {
        _options.optgroupLabelField = formElement.attr('data-optgroupLabelField');
    }

    // data-optgroupField: 'optgroup'
    if ('undefined' !==  typeof formElement.attr('data-optgroupField')) {
        _options.optgroupField = formElement.attr('data-optgroupField');
    }

    // data-sortField: '$order'
    if ('undefined' !==  typeof formElement.attr('data-sortField')) {
        _options.sortField = formElement.attr('data-sortField');
    }

    /**
     *  data-searchField: ['text']
     *
     *  The JSON.parse method expects the string data to be in proper form
     *  to be successfully parsed. It's important that all strings, including
     *  the array key names, be surrounded in double quotes. This means you
     *  will likely need to surround the html attribute value in single quotes.
     *
     *  Example:
     *
     *    <select
     *      class="dynamo-selectize"
     *      data-searchField='[
     *        "text",
     *        "description"
     *      ]'
     *    >
     */
    if ('undefined' !==  typeof formElement.attr('data-searchField')) {
        try {
            _options.searchField = JSON.parse(formElement.attr('data-searchField'));
        } catch (e) {}
    }

    // data-searchConjunction: 'and'
    if ('undefined' !==  typeof formElement.attr('data-preload')) {
        //If defined string 'and', use sting 'and'
        if ('and' === formElement.attr('data-preload').toLowerCase()) {
            _options.preload = 'and';
        }
        //If defined string 'or', use string 'or'
        else if ('or' === formElement.attr('data-preload').toLowerCase()) {
            _options.preload = 'or';
        }
        //If defined any other way, use selectize default
    }

    /**
     *  data-optgroupOrder: null
     *
     *  The JSON.parse method expects the string data to be in proper form
     *  to be successfully parsed. It's important that all strings, including
     *  the array key names, be surrounded in double quotes. This means you
     *  will likely need to surround the html attribute value in single quotes.
     *
     *  Example:
     *
     *    <select
     *      class="dynamo-selectize"
     *      data-optgroupOrder='[
     *        "Seahawks",
     *        "Blazers",
     *        "Timbers"
     *      ]'
     *    >
     */
    if ('undefined' !==  typeof formElement.attr('data-optgroupOrder')) {
        try {
            _options.optgroupOrder = JSON.parse(formElement.attr('data-optgroupOrder'));
        } catch (e) {}
    }

     // data-copyClassesToDropdown: true
    if ('undefined' !==  typeof formElement.attr('data-copyClassesToDropdown')) {
        //If defined any way other than string 'false', use selectize default
        if ('false' === formElement.attr('data-copyClassesToDropdown').toLowerCase()) {
            _options.copyClassesToDropdown = false;
        }
    }


    /**
     *  data-load-url: null
     *
     *  The data-load-[*] attributes define the necessary selectize options for
     *  remote data fetching. You must define the data-load-url attribute to
     *  trigger the functionality.
     *
     *  data-load-type:
     *      The http method used to fetch data. Default: 'GET'
     *
     *  data-load-resultSet-limit:
     *      The max number of records from remote fetch. Default: 10
     *
     *  data-load-resultSet-key:
     *      The object key under which your data can be found. Default: null
     *
     *      If your remote source returns multiple types of data, for instance
     *      a list of beverages and a list of food items, and you only want the
     *      beverage list you would specify the key name for the beverage list.
     *
     *          {
     *            "beverage": [
     *               {
     *                 "value": 1,
     *                 "text": "Coffee"
     *               },
     *               {
     *                 "value": 2,
     *                 "text": "Soda"
     *               },
     *               {
     *                "value": 3,
     *                "text": "Water"
     *               }
     *            ],
     *            "food": [
     *               {
     *                 "value": 1,
     *                 "text": "Apple"
     *               },
     *               {
     *                 "value": 2,
     *                 "text": "Carrot"
     *               },
     *               {
     *                "value": 3,
     *                "text": "Sandwich"
     *               }
     *            ]
     *          }
     *
     *
     *
     */
    if ('undefined' !==  typeof formElement.attr('data-load-url')) {

        var loadUrl = formElement.attr('data-load-url');

        // data-load-type: 'GET'
        var loadType = 'GET';
        if ('undefined' !==  typeof formElement.attr('data-load-type')) {
            loadType = formElement.attr('data-load-type');
        }

        // data-load-resultSet-limit: 10
        var loadLimit = 10;
        if ('undefined' !==  typeof formElement.attr('data-load-resultSet-limit')) {
            loadLimit = formElement.attr('data-load-resultSet-limit');
        }

        // data-load-resultSet-key: null
        var loadKey = null;
        if ('undefined' !==  typeof formElement.attr('data-load-resultSet-key')) {
            loadKey = formElement.attr('data-load-resultSet-key');
        }

        // Build load option
        _options.load =
            function(query, callback) {
                if (!query.length) return callback();
                $.ajax({
                    url: loadUrl + encodeURIComponent(query),
                    type: loadType,
                    error: function() {
                        callback();
                    },
                    success: function(res) {
                        if (loadKey) {
                            callback(res[loadKey].slice(0, loadLimit));
                        } else {
                            callback(res.slice(0, loadLimit));
                        }
                    }
                });
            };
    }

    return _options;

} //END buildOptionsObject(formElement) {