## DynamoForm-selectize.js

Enable the use Brian Reavis's popular selectize.js library using html
attributes, without writing any javascript.

**Status:** Beta (Feb 9, 2015)

**To Do:**
* Add custom rendering support from data attributes

### Configuration and Usage

There are three simple steps to get started:

* Step 1 - Enable selectize.js
* Step 2 - Enable DynamoForm-selectize.js
* Step 3 - Add class to your form element
* Step 4 - Add attributes to your form element

#### Step 1: Enable selectize.js

Add the selectize.js library to your project. For more details see the
[selectize.js](http://brianreavis.github.io/selectize.js/) project page.

#### Step 2: Enable DynamoForm-selectize.js

Download and add the DynamoForm-selectize.js library to your project.

``` html
<script src="js/DynamoForm-selectize.js"></script>
```

#### Step 3: Add dynamo-selectize class to your form element

Add the class `dynamo-selectize` to your form element to enable selectize and
support for reading attribute values to control selectize behavior.

``` html
<select class="dynamo-selectize"></select>
```

#### Step 4: Add attributes to your html to customize

Below is a list of attributes you can add to your form elements to enable
selectize.js functionality. Most of these attributes match the accompanying
selectize option of the same name. The values shown below are the defaults.
Please see the [selectize.js](http://brianreavis.github.io/selectize.js/)
project page for more details about these options.

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

#### Loading data from an array

Selectize can load data from an array if convenient for your application or
environment. The javascript JSON.parse() method is used to convert this data.
JSON.parse() expects the string data to be in proper form to be successfully
parsed. It's important that all strings, including the object key names, be
surrounded in double quotes. This means you will likely need to surround the
html attribute value in single quotes. See example below:

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

#### Loading data from a remote source

Selectize.js has a `load` option to specify a function for loading remote
data. To trigger the load option be built by dynamo-selectize you must specify
at least the`data-load-url` attribute. There are 4 attributes you can use to
customize the remote fetch:

* data-load-url : The URL to fetch data from. The users search text will be
appended to the URL.

* data-load-type : The http method to use for the fetch. Defaults to `GET`

* data-load-resultSet-limit: The max number of records from remote fetch.
Default: 10

* data-load-resultSet-key: The object key under which your data can be found.
Default: null


      If your remote source returns multiple types of data, for instance
      a list of beverages and a list of food items, and you only want the
      beverage list you would specify the key name for the beverage list.

```json
/* JSON Data */
{
  "beverage": [
     {
       "value": 1,
      "text": "Coffee"
     },
     {
       "value": 2,
       "text": "Soda"
     },
     {
      "value": 3,
      "text": "Water"
     }
  ],
  "food": [
     {
       "value": 1,
       "text": "Apple"
     },
     {
       "value": 2,
       "text": "Carrot"
     },
     {
      "value": 3,
      "text": "Sandwich"
     }
  ]
}
```


``` html
<select class="dynamo-selectize"
    data-load-url="data.php?dataType=beverage&search="
    data-load-type="GET"
    data-load-resultSet-key="beverage"
    data-load-resultSet-limit="10"
    data-valueField="value"
    data-labelField="text"
    data-searchField='["text"]'
>
</select>
```

**Note:**

> By default the load option is not called until the user enters a search query
> in the selectize'd input. If you would like to `preload` data when the
> selectize'd input is initialized, use the `data-preload` attribute.


#### Working with dependencies - Chaining elements

You can chain form elements together to satisfy dependencies. For instance, if
you had city select list that needs the user to select the state first, you can
chain the state and city elements. Child elements, whose parent elements don't
have a value set, will be disabled until all parents have a value set. The
parent value can also be read by the child element to lookup data if needed.

**Step 1**: Add a `data-chain-child` attribute to the parent(s), with a value of
the child's `id` attribute. `data-chain-child` is a JSON array element. You can
specify more than one child if needed.

**Step 2**: Add a `data-chain-parent` attribute to the child, with a value of the
parent's `id` attribute. `data-chain-parent` is a JSON array element. You can
specify more than one parent if needed.

**Optional**: If the child element needs the parents value to lookup data
you can use variables in the `data-load-url` attribute. Place the parent
element's id attribute between braces `{parent-id}`, e.g. `{state}`, within
the url specification where you want the value to appear when the fetch occurs.


``` html
<select id="state" class="dynamo-selectize"
    data-chain-child='["city"]'
    data-load-type="GET"
    data-load-url="data.php/states/"
    data-load-resultSet-limit="10"
    data-valueField="value"
    data-labelField="text"
    data-searchField='["text"]'
>

<select id="city" class="dynamo-selectize"
    data-chain-parent='["state"]'
    data-load-type="GET"
    data-load-url="data.php/{state}/cities/"
    data-load-resultSet-limit="10"
    data-valueField="value"
    data-labelField="text"
    data-searchField='["text"]'
>
</select>
```


#### Custom rendering of options list

Selectize.js has support for custom rendering of options list items. To
activate the rendering add the `data-render-option` attribute to your input
element and set the escaped html you want to rendor as the value of the
attribute. You can use use vairables within the html to represent the data you
want displayed for each option. To create variables in the rendor html, place
the data elements between braces `{data-element}`, e.g. `{name}`,
`{description}`, etc.

For example, here is a list of some json data for states:

```json
{
    "states": [
        {
            "id": 1,
            "abbr": "AK",
            "description": "Alaska"
        },
        {
            "id": 2,
            "abbr": "CA",
            "description": "California"
        },
        {
            "id": 3,
            "abbr": "OR",
            "description": "Oregon"
        },
        {
            "id": 4,
            "abbr": "WA",
            "description": "Washington"
        }
    ]
}
```

I want to display the Abbreviation (abbr) and Description (description) in my
option list. I develop the following html to display my options:

```html
<div><strong>{abbr}</strong> - {description}</div>
```

The varible names between braces `{abbr}` and `{description}` match the
property names from my json data above. The html needs to be encoded as html
entities to prevent the web broswer from trying to render it in the middle of
my input element. Below is the final product:


``` html
<select id="state" class="dynamo-selectize"
    data-render-option='&#x3C;div&#x3E;&#x3C;strong&#x3E;{abbr}&#x3C;/strong&#x3E; - {description}&#x3C;/div&#x3E;'
>
```

**Note:**

> Many html temperating systems used today have support for automatically
> outputting the encoded version of the html. However, if your not using a
> temperating system, you can use one of the free on-line html encoders which
> allow you to paste in your raw html and output the encoded version.