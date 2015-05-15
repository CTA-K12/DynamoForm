## DynamoForm-datetimepicker.js

Enable the use of Eonasdan/bootstrap-datetimepicker library using html
attributes, without writing any javascript.

**Status:** Beta (May 14, 2015)

**To Do:**
* Add remaining data attribute options.

### Configuration and Usage

There are three simple steps to get started:

* Step 1 - Enable bootstrap-datetimepicker.js
* Step 2 - Enable DynamoForm-datetimepicker.js
* Step 3 - Add dynamo-datepicker class to your form element
* Step 4 - Add attributes to your form element

#### Step 1: Enable bootstrap-datetimepicker.js

Add the bootstrap-datetimepicker.js library and it's dependinceis to your
project. For more details see the
[bootstrap-datetimepicker.js](https://github.com/Eonasdan/bootstrap-datetimepicker) project page.

#### Step 2: Enable DynamoForm-datetimepicker.js

Download and add the DynamoForm-datetimepicker.js library to your project.

``` html
<script src="js/DynamoForm-datetimepicker.js"></script>
```

#### Step 3: Add dynamo-datetimepicker class to your form element

Add the class `dynamo-datepicker` to your input element to enable
bootstrap-datetimepicker.js and support for reading attribute values to control
bootstrap-datetimepicker behavior.

``` html
<input class="dynamo-datepicker">
```

#### Step 4: Add attributes to your html to customize

Below is a list of attributes you can add to your form elements to enable
bootstrap-datetimepicker functionality. Most of these attributes match the
accompanying bootstrap-datetimepicker option of the same name. The values
shown below are the defaults. Please see the
[bootstrap-datetimepicker.js](https://github.com/Eonasdan/bootstrap-datetimepicker)
project page for more details about these options.

```html
<input class="dynamo-datepicker"
    data-format="null"
    data-defaultDate="null"
    data-useCurrent="true"
>
```

### Examples

#### Basic date picker


``` html
<div class="form-group col-md-3">
    <label><strong>Standard date picker</strong></label>
    <input
        type="text"
        class="form-control dynamo-datepicker"
        data-format="MM/DD/YYYY"
    />
</div>
```


#### Basic date/time picker


``` html
<div class="form-group col-md-3">
    <label><strong>Standard date/time picker</strong></label>
    <input
        type="text"
        class="form-control dynamo-datepicker"
        data-format="MM/DD/YYYY hh:mm"
    />
</div>
```


#### Date picker with button


``` html
<div class="form-group col-md-3">
    <label><strong>Date picker with button</strong></label>
    <div
        class="input-group dynamo-datepicker"
        data-format="MM/DD/YYYY"
        >
        <input
            type="text"
            class="form-control"
        />
        <div class="input-group-addon">
            <span class="glyphicon glyphicon-calendar"></span>
        </div>
    </div>
</div>
```


#### Date/time picker with button


``` html
<div class="form-group col-md-3">
    <label><strong>Date picker with button</strong></label>
    <div
        class="input-group dynamo-datepicker"
        data-format="MM/DD/YYYY hh:mm"
        >
        <input
            type="text"
            class="form-control"
        />
        <div class="input-group-addon">
            <span class="glyphicon glyphicon-calendar"></span>
        </div>
    </div>
</div>
```

