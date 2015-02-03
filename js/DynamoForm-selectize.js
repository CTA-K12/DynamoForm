$(document).ready(function() {


    // Enable selectize on desired select elements
    $('.dynamo-selectize').each(function(){

        /**
         * Selectize option processing
         *
         * A html data-[option] attribute exist for each Selectize option.
         * The data-[option] attributes are processed in way that options
         * with invalid setting data will be defaulted to the Selectize
         * designated default value, when possible.
         *
         */

        var _options = {};

        // data-diacritics: true
        if ('undefined' !==  typeof $(this).attr('data-diacritics')) {
            //If defined any way other than string 'false', use selectize default
            if ('false' === $(this).attr('data-diacritics').toLowerCase()) {
                _options.diacritics = false;
            }
        }

        // data-create: false
        if ('undefined' !==  typeof $(this).attr('data-create')) {
            //If defined any way other than string 'true', use selectize default
            if ('true' === $(this).attr('data-create').toLowerCase()) {
                _options.create = true;
            }
        }

        // data-createOnBlur: false
        if ('undefined' !==  typeof $(this).attr('data-createOnBlur')) {
            //If defined any way other than string 'true', use selectize default
            if ('true' === $(this).attr('data-createOnBlur').toLowerCase()) {
                _options.createOnBlur = true;
            }
        }

        // data-createFilter: null
        if ('undefined' !==  typeof $(this).attr('data-createFilter')) {
            //If defined any way other than string 'null', use user string
            if ('null' !== $(this).attr('data-createFilter').toLowerCase()) {
                _options.createFilter = $(this).attr('data-createFilter');
            }
        }

        // data-highlight: true
        if ('undefined' !==  typeof $(this).attr('data-highlight')) {
            //If defined any way other than string 'false', use selectize default
            if ('false' === $(this).attr('data-highlight').toLowerCase()) {
                _options.highlight = false;
            }
        }

        // data-persist: true
        if ('undefined' !==  typeof $(this).attr('data-persist')) {
            //If defined any way other than string 'false', use selectize default
            if ('false' === $(this).attr('data-persist').toLowerCase()) {
                _options.persist = false;
            }
        }

        // data-openOnFocus: true
        if ('undefined' !==  typeof $(this).attr('data-openOnFocus')) {
            //If defined any way other than string 'false', use selectize default
            if ('false' === $(this).attr('data-openOnFocus').toLowerCase()) {
                _options.openOnFocus = false;
            }
        }

        // data-maxOptions: 1000
        if ('undefined' !==  typeof $(this).attr('data-maxOptions')) {
            if (!isNaN(parseInt($(this).attr('data-maxOptions')))) {
                _options.maxOptions = parseInt($(this).attr('data-maxOptions'));
            }
        }

        // data-maxItems: 1
        if ('undefined' !==  typeof $(this).attr('data-maxItems')) {
            if (!isNaN(parseInt($(this).attr('data-maxItems')))) {
                _options.maxItems = parseInt($(this).attr('data-maxItems'));
            }
        }

        // data-hideSelected: false
        if ('undefined' !==  typeof $(this).attr('data-hideSelected')) {
            //If defined any way other than string 'true', use selectize default
            if ('true' === $(this).attr('data-hideSelected').toLowerCase()) {
                _options.hideSelected = true;
            }
        }

        // data-allowEmptyOption: false
        if ('undefined' !==  typeof $(this).attr('data-allowEmptyOption')) {
            //If defined any way other than string 'true', use selectize default
            if ('true' === $(this).attr('data-allowEmptyOption').toLowerCase()) {
                _options.allowEmptyOption = true;
            }
        }

        // data-scrollDuration: 60
        if ('undefined' !==  typeof $(this).attr('data-scrollDuration')) {
            if (!isNaN(parseInt($(this).attr('data-scrollDuration')))) {
                _options.scrollDuration = parseInt($(this).attr('data-scrollDuration'));
            }
        }

        // data-loadThrottle: 300
        if ('undefined' !==  typeof $(this).attr('data-loadThrottle')) {
            if (!isNaN(parseInt($(this).attr('data-loadThrottle')))) {
                _options.loadThrottle = parseInt($(this).attr('data-loadThrottle'));
            }
        }

        // data-loadingClass: 'loading'
        if ('undefined' !==  typeof $(this).attr('data-loadingClass')) {
            //If defined any way other than string 'loading', use user string
            if ('loading' !== $(this).attr('data-loadingClass').toLowerCase()) {
                _options.loadingClass = $(this).attr('data-loadingClass');
            }
        }

        // data-preload: false | Can be boolean or string
        if ('undefined' !==  typeof $(this).attr('data-preload')) {
            //If defined string 'true', use boolean true
            if ('true' === $(this).attr('data-preload').toLowerCase()) {
                _options.preload = true;
            }
            //If defined string 'focus', use string focus
            else if ('focus' === $(this).attr('data-preload').toLowerCase()) {
                _options.preload = 'focus';
            }
            //If defined any other way, use selectize default
        }

        // data-dropdownParent: null
        if ('undefined' !==  typeof $(this).attr('data-dropdownParent')) {
            //If defined any way other than string 'body', use selectize default
            if ('body' === $(this).attr('data-dropdownParent').toLowerCase()) {
                _options.dropdownParent = 'body';
            }
        }

       // data-addPrecedence: false
        if ('undefined' !==  typeof $(this).attr('data-addPrecedence')) {
            //If defined any way other than string 'true', use selectize default
            if ('true' === $(this).attr('data-addPrecedence').toLowerCase()) {
                _options.addPrecedence = true;
            }
        }

        // data-selectOnTab: false
        if ('undefined' !==  typeof $(this).attr('data-selectOnTab')) {
            //If defined any way other than string 'true', use selectize default
            if ('true' === $(this).attr('data-selectOnTab').toLowerCase()) {
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
        if ('undefined' !==  typeof $(this).attr('data-options')) {
            _options.options = JSON.parse($(this).attr('data-options'));
        }

        // data-dataAttr: 'data-data'
        if ('undefined' !==  typeof $(this).attr('data-dataAttr')) {
            _options.dataAttr = $(this).attr('data-dataAttr');
        }

        // data-valueField: 'value'
        if ('undefined' !==  typeof $(this).attr('data-valueField')) {
            _options.valueField = $(this).attr('data-valueField');
        }

        // data-optgroupValueField: 'value'
        if ('undefined' !==  typeof $(this).attr('data-optgroupValueField')) {
            _options.optgroupValueField = $(this).attr('data-optgroupValueField');
        }

        // data-labelField: 'text'
        if ('undefined' !==  typeof $(this).attr('data-labelField')) {
            _options.labelField = $(this).attr('data-labelField');
        }

        // data-optgroupLabelField: 'label'
        if ('undefined' !==  typeof $(this).attr('data-optgroupLabelField')) {
            _options.optgroupLabelField = $(this).attr('data-optgroupLabelField');
        }

        // data-optgroupField: 'optgroup'
        if ('undefined' !==  typeof $(this).attr('data-optgroupField')) {
            _options.optgroupField = $(this).attr('data-optgroupField');
        }

        // data-sortField: '$order'
        if ('undefined' !==  typeof $(this).attr('data-sortField')) {
            _options.sortField = $(this).attr('data-sortField');
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
        if ('undefined' !==  typeof $(this).attr('data-searchField')) {
            try {
                _options.searchField = JSON.parse($(this).attr('data-searchField'));
            } catch (e) {
                _options.searchField = ['text'];
            }
        }

        // data-searchConjunction: 'and'
        if ('undefined' !==  typeof $(this).attr('data-preload')) {
            //If defined string 'and', use sting 'and'
            if ('and' === $(this).attr('data-preload').toLowerCase()) {
                _options.preload = 'and';
            }
            //If defined string 'or', use string 'or'
            else if ('or' === $(this).attr('data-preload').toLowerCase()) {
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
        if ('undefined' !==  typeof $(this).attr('data-optgroupOrder')) {
            _options.optgroupOrder = JSON.parse($(this).attr('data-optgroupOrder'));
        }

         // data-copyClassesToDropdown: true
        if ('undefined' !==  typeof $(this).attr('data-copyClassesToDropdown')) {
            //If defined any way other than string 'false', use selectize default
            if ('false' === $(this).attr('data-copyClassesToDropdown').toLowerCase()) {
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
         */
        if ('undefined' !==  typeof $(this).attr('data-load-url')) {

            var loadUrl = $(this).attr('data-load-url');

            // data-load-type: 'GET'
            var loadType = 'GET';
            if ('undefined' !==  typeof $(this).attr('data-load-type')) {
                loadType = $(this).attr('data-load-type');
            }

            // data-load-resultSet-limit: 10
            var loadLimit = 10;
            if ('undefined' !==  typeof $(this).attr('data-load-resultSet-limit')) {
                loadLimit = $(this).attr('data-load-resultSet-limit');
            }

            // data-load-resultSet-key: null
            var loadKey = null;
            if ('undefined' !==  typeof $(this).attr('data-load-resultSet-key')) {
                loadKey = $(this).attr('data-load-resultSet-key');
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

       //console.log( _options );

       $(this).selectize(_options);

    });

});