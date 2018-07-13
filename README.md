# __Overlay - jQuery Plugin__
This plugin aims to allow developers to take content already used in an application and place it inside an overlay to present the website in a minimal and tablet friendly way.

## __Requirements__
The only dependency requirement of this plugin is **jQuery**.

## __Installation__
All you need to install this plugin is to include the provided CSS/JS files:
* `<link rel="stylesheet" href="overlay.css" />`
* `<script src="overlay.js" />`  

&nbsp;

# __Usage__
```javascript
$(element).overlay(Object);
```

&nbsp;

# __Default Options__
```javascript
{
    enabled: true,
    showProgress: true
}
```

&nbsp;

# __Customize Default Options__ 
Here is an example of how to customize plugin defaults. This code can exist anywhere in your application.
```javascript
$.fn.overlay.defaults = {
    enabled: false
}
```


&nbsp;

# __Available Options__
```javascript
{
    enabled: Boolean,
    hide: $(element),
    offsetTop: function(){
        return Number
    },
    offsetBottom: function(){
        return Number
    },
    onValidate: function(){
        return Boolean
    },
    onSubmit: function(){

    },
    remove: $(element),
    showProgress: Boolean,
    steps: [
        {
            title: String,
            content: $(element)
        }
    ]
}
```

## __enabled__
Allows you to enable/disable the entire plugin. If this is disabled - the website will fallback to its default functionality.

## __hide__
Hide content via the plugin. This can also alternatively be done with standard jQuery approach. However the plugin will attempt to hide the elements on each step change to ensure the elements are always hidden.
```javascript
// Standard jQuery
$(element).hide()

// Using Plugin Options
var options = {
    hide: $(element)
}
```

## __offsetTop__
Set the __top__ offset of your content by a certain value. The value returned will be the amount of pixels the content will be offset. This is called on page load as well as on window resize.

## __offsetBottom__
Set the __bottom__ offset of your content by a certain value. The value returned will be the amount of pixels the content will be offset. This is called on page load as well as on window resize.

## __onValidate__
A function that gets called when trying to move between steps/pages. This function must return a boolean value.

## __onSubmit__
A function that gets called after the onValidate function returns 'true'. This will allow you to customize what will happen when attempting to move to the next page.

## __remove__
Remove content via the plugin. This can also alternatively be done with standard jQuery approach. However the plugin will attempt to remove the elements on each step change to ensure the elements are always removed.
```javascript
// Standard jQuery
$(element).remove()

// Using Plugin Options
var options = {
    remove: $(element)
}
```

## __showProgress__
Allows the ability to programatically hide the Progress bar

## __steps__
An array of objects that will represent the "steps" in your application. If this option does not exist - the plugin by default will take the target element of the plugin and place ALL content in the overlay.
