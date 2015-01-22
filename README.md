## DynamoForm.js

A jquery based dynamic form field generator with support for Select2.

### html layout:

Below is the needed html elments to turn your standard form into a dynamic
form.

``` html
<div class="dynamo-form">
    <div class="dynamo-form-row">
        <!-- your html form fields here -->
        <button type="button" class="dynamo-form-row-delete">Delete</button>
    </div>
    <button type="button" class="dynamo-form-row-add">Add</button>
</div>
```


### Example:

``` html
<div class="dynamo-form">
    <div class="dynamo-form-row">
        <label>Email</label>
        <input type="text" id="user_email_1" name="user_email_1" />
        <button type="button" class="dynamo-form-row-delete">Delete</button>
    </div>
    <button type="button" class="dynamo-form-row-add">Add Email</button>
</div>
```


### Example with advanced options:

``` html
<div class="dynamo-form" data-min-rows="1" data-max-rows="4">
    <div class="dynamo-form-row">
        <label data-dynamo-relabel="true">Email 1</label>
        <input type="text" id="user_email_1" name="user_email_1" />
        <button type="button" class="dynamo-form-row-delete">Delete</button>
    </div>
    <button type="button" class="dynamo-form-row-add">Add Email</button>
</div>
```


### Bootstrap Example:

``` html
<div class="dynamo-form" data-min-rows="1" data-max-rows="4">
  <div class="dynamo-form-row">
    <div class="row form-group">
      <div class="col-md-1-6">
        <label data-dynamo-relabel="true">Email 1</label>
      </div>
      <div class="col-md-3-12">
        <input type="text" id="user_email_1" name="user_email_1" />
      </div>
      <div class="col-md-1-6">
        <button type="button" class="btn btn-default dynamo-form-row-delete">Delete</button>
      </div>
    </div><!-- /.row -->
  </div><!-- /.dynamo-form-row -->
  <div class="row form-group">
    <div class="col-md-1-6"></div>
    <div class="col-md-1-6">
      <button type="button" class="btn btn-default dynamo-form-row-add">Add Email</button>
    </div>
  </div><!-- /.row -->
</div><!-- /.dynamo-row -->
```