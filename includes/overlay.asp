<link rel="stylesheet" href="/core/overlay/overlay.css" />
<script src="/core/overlay/overlay.js"></script>

<script>

    //  $.fn is as globally available object that comes with jQuery and to manage all of its plugins/functions. So we are just setting the global plugin defaults with the following code.
    $.fn.overlay.defaults = {
        
        //  Turns the plugin on/off.
        enabled: true,

        //  By default the plugins CSS will add 30px margin so this is entirely optional
        offsetTop: function(){
            return 0
        },

        //  Same thing as offSetTop but bottom. The best default value i've found is 300px this allows any breathing room if the tablet keyboard is up. By default the plugin css will add 30px margin so this is entirely optional.
        offsetBottom: function(){
            return 400
        },

        //  valid() is a function that comes with the jQuery Validate plugin which is what a very large majority of our registration pages use – so its fairly safe to put this as a default setting. I’m pretty sure all the WD’s use #Form1 as their default form id. This can also be overridden on each page the plugin is being used on a case by case basis, the provided function just needs to return a boolean value.
        onValidate: function () {
            return $("#Form1").valid(); 
        },

        // submit() is a function that comes with jQuery. When the "onSubmit" function is called by the plugin, it will try to submit the form using its default action. Basically whatever is in the forms "action" attribute – Example: <form action="reginfo_p?b=<%=b%>&o=<%=o%>">
        onSubmit: function () {
            return $("#Form1").submit();
        },
    }

</script>
