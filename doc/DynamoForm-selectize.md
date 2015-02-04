## DynamoForm-selectize.js

Enable the use Brian Reavis's popular selectize.js library using html
attributes, without writing any javascript.

### Configuration and Usage

There are three simple steps to get started:

* Step 1 - Enable selectize.js
* Step 2 - Enable DynamoForm-selectize.js
* Step 3 - Add class to your form element
* Step 4 - Add attributes to your html

#### Step 1 - Enable selectize.js

Add the selectize.js library to your project. For more details see the
[selectize.js](http://brianreavis.github.io/selectize.js/) project page.

#### Step 2 - Enable DynamoForm-selectize.js

Download and add the DynamoForm-selectize.js library to your project.

``` html
<script src="js/DynamoForm-selectize.js"></script>
```

#### Step 3 - Add dynamo-selectize class to your form elment

Add the class `dynamo-selectize` to your form element to enable selectize and
support for reading attribute values to control selectize behavior.

``` html
<select class="dynamo-selectize"></select>
```

#### Step 4 - Add attributes to your html to customize

Below is a list of attributes you can add to your form elements to enable
selectize.js functionality. Most of these attributes match the accompanying
selectize option of the same name. The values shown below are the defualts.

```html
<select class="dynamo-selectize"
    data-diacritics="false"
    data-create="true"
    data-createOnBlur="false"
    data-createFilter=""
    data-highlight="true"
    data-persist="true"
    data-openOnFocus="true"
    data-maxOptions="1000"
    data-maxItems="1"
    data-hideSelected="false"
    data-allowEmptyOption="false"
    data-scrollDuration="60"
    data-loadThrottle="300"
    data-preload="false"
    data-dropdownParent="null"
    data-addPrecedence="false"
    data-selectOnTab="false"
    data-options='[]'
    data-dataAttr="data-data"
    data-valueField="value"
    data-optgroupValueField="value"
    data-labelField="text"
    data-optgroupLabelField="label"
    data-optgroupField="optgroup"
    data-sortField="$order"
    data-searchField='["text"]'
    data-searchConjunction="and"
    data-optgroupOrder="[]"
    data-copyClassesToDropdown="true"
>
</select>
```

### Examples

**Loading data from an array:**

``` html
<select class="dynamo-selectize"
    data-options='[
        {
          "value": 1,
          "text": "Astroia"
        },
        {
          "value": 2,
          "text": "Beaverton"
        },
        {
          "value": 3,
          "text": "Clackamas"
        },
        {
          "value": 4,
          "text": "Dallas"
        },
        {
          "value": 5,
          "text": "The Dales"
        },
        {
          "value": 6,
          "text": "Hilboro"
        },
        {
          "value": 7,
          "text": "Junction City"
        }
    ]'
>
</select>
```

**Loading data from a remote source:**

``` html
<select class="dynamo-selectize"
    data-load-type="GET"
    data-load-url="data.php?dataType=cities&search="
    data-load-resultSet-key="cities"
    data-load-resultSet-limit="10"
    data-valueField="value"
    data-labelField="text"
    data-searchField='["text"]'
>
</select>
```