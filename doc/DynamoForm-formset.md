## DynamoForm-formset.js

A jquery based dynamic formset generator with support for Selectize.js via DynamoForm-selectize.

![DynamoForm Example](https://github.com/MESD/DynamoForm/blob/master/demo/DynamoForm-formset.png "DynamoForm Example")

**Note:** (May 25, 2016)
At the moment, for cloning of rows to work with selectize'd fields, you need a new API method
called getOptions() for selectize.js. I have submitted a pull request to the selectize.js
project for this method. [selectize.js - Pull Request #735](https://github.com/selectize/selectize.js/pull/820)
At this time it's best just to use the version of Selectize in the vendor directory of this repo.

**Status:** Beta (May 25, 2016)

## Usuage

### html layout:

Below is the needed html elements to turn your standard form into a dynamic
form.

``` html
<div class="dynamo-formset">
    <div class="dynamo-formset-row">
        <!-- your html form fields here -->
        <button type="button" class="dynamo-formset-row-delete">Delete</button>
    </div>
    <button type="button" class="dynamo-formset-row-add">Add</button>
</div>
```


### Example:

Here is a sample formset for collecting multiple email addresses.

DynamoForm will automatically re-index the input id and name attributes each
time the user adds or removes a formset row. It's important that the id and
name attributes end with a `_#` or `#]` for indexing to work. Where `#`
represents a positive integer.

``` html
<div class="dynamo-formset">
    <div class="dynamo-formset-row">
        <label>Email</label>
        <input type="text" id="user_email_1" name="user[email][1]" />
        <button type="button" class="dynamo-formset-row-delete">Delete</button>
    </div>
    <button type="button" class="dynamo-formset-row-add">Add Email</button>
</div>
```


### Example with advanced options:

You can limit the minimum and/or maximum number of addresses by specifying the
`data-min-rows` and/or `data-max-rows` attributes on the element with class
`dynamo-formset`.

If you want Dynamo to re-index your field label text as well, add an
`data-dynamo-relabel="true"` attribute to your element holding the field label.
It's important that the field label text end with a `[space]#` for indexing to
work. Where `[space]` represents a space character and `#` represents a
positive integer.

``` html
<div class="dynamo-formset" data-min-rows="1" data-max-rows="4">
    <div class="dynamo-formset-row">
        <label data-dynamo-relabel="true">Email 1</label>
        <input type="text" id="user_email_1" name="user_email_1" />
        <button type="button" class="dynamo-formset-row-delete">Delete</button>
    </div>
    <button type="button" class="dynamo-formset-row-add">Add Email</button>
</div>
```


### Bootstrap Example:

Here is the same email address collection formset using bootstrap based form code.

``` html
<div class="dynamo-formset"  data-min-rows="1" data-max-rows="4">
  <div class="dynamo-formset-row form-group">
    <label for="email_1"  class="col-md-3 control-label" data-dynamo-relabel="true">Email 1</label>
    <div class="col-md-6">
      <input type="email" class="form-control" id="email_1" placeholder="Enter email addresss">
    </div>
    <div class="col-md-1">
      <button type="button" class="btn btn-default dynamo-formset-row-delete" disabled="disabled">Delete</button>
    </div>
  </div>
  <div class="col-md-offset-3 col-md-2">
    <button type="button" class="btn btn-default dynamo-formset-row-add">Add Email</button>
  </div>
</div>
```

### Prototype Example:

Here is the first example agin, this time using a `prototype` for the row
definition. This is helpful in situations where you may start (and end) with
zero rows in your formset.

The only difference in this configuration is the addition of an attribute
called `data-prototype`. The value of this attribute will be the html for
your formset row. The html may need to be encoded as html entities to prevent
the browser from attempting to render the prototype.


``` html
<div
  class="dynamo-formset"
  data-prototype="<div class="dynamo-formset-row"><label>Email</label><input type="text" id="user_email_1" name="user[email][1]" /><button type="button" class="dynamo-formset-row-delete">Delete</button></div>"
>
    <button type="button" class="dynamo-formset-row-add">Add Email</button>
</div>
```
