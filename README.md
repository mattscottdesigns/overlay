# __Overlay - jQuery Plugin__
This plugin aims to allow developers to take content already used in an application and place it inside an overlay to present the website in a minimal and tablet friendly way

## __Requirements__
The only dependency requirement of this plugin is **jQuery**

## __Installation__
All you need to install this plugin is to include the provided CSS/JS files:
* `<link rel="stylesheet" href="overlay.css" />`
* `<script src="overlay.js" />`  

&nbsp;

# __Usage__
```javascript
$("element").overlay(options);
```

&nbsp;

# __Default Options__
```javascript
{
    "enabled": true,
    "showActions": true
}
```

&nbsp;

# __Available Options__
```javascript
{
    "enabled": "",
    "hide": "",
    "offsetTop": "",
    "offsetBottom": "",
    "onValidate": "",
    "onSubmit": "",
    "remove": "",
    "steps": [
        {
            "title": "",
            "content": ""
        }
    ]
}
```

## __enabled__ - _function_
Allows you to enable/disable the entire plugin

## __hide__ - _string/node_
Hide content via the plugin, it accepts a string or a DOM node

## __offsetTop__ - _function_
Set the __top__ offset of your content by a certain value. The value returned will be the amount of pixels the content will be offset. This is triggered on page load as well as on window resize.

## __offsetBottom__ - _function_
Set the __bottom__ offset of your content by a certain value. The value returned will be the amount of pixels the content will be offset. This is triggered on page load as well as on window resize.

## __onValidate__ - _function_
A function that gets triggered while trying to submit each step. It must return a boolean value whether or not the conditions have been met and they can proceed to the next step.

## __onSubmit__ - _function_
A function that gets triggered after the onValidate conditions have been met and the user is ready to move on to the next page

## __remove__ - _string/node_
Remove content via the plugin, it accepts a string or a DOM node

## __steps__ - _array_
An array of objects that will represent the "steps" in your application. If this option does not exist - the plugin by default will take the target element of the plugin and place ALL content in the overlay

&nbsp;

# __Customize Default Options__ 
Here is an example of how to customize plugin defaults. This code can exist anywhere in your application
```javascript
$.fn.overlay.defaults = {
    "enabled": false
}
```
