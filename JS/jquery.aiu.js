(function($){
        var config = {
            'photo_input' : '#photo_input',
            'photo_preview' : '#photo_preview',
            'photo_form' : '#photo_form',
            'php_path' : 'photo_controller.php',
            'img_loading_path' : 'images/ajax-loader.gif'
        };
        var methods = {
            'isAjaxUploadSupported' : function(){
                var input = document.createElement("input");
                        input.type = "file";
                        return (
                                "multiple" in input &&
                                typeof File != "undefined" &&
                                typeof FormData != "undefined" &&
                                typeof (new XMLHttpRequest()).upload != "undefined" 
                                );
            },
            'getIframeContentJSON': function(iframe){
                try {
                            var doc = iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document,
                                response;
                            var innerHTML = doc.body.innerHTML;
                            if (innerHTML.slice(0, 5).toLowerCase() == "<pre>" && innerHTML.slice(-6).toLowerCase() == "</pre>") {
                                innerHTML = doc.body.firstChild.firstChild.nodeValue;
                            }
                            response = eval("(" + innerHTML + ")");
                        } catch(err){
                            response = {success: false};
                        }

                        return response;
            }
        };

        $.fn.AIU = function(method) {
            if (methods[method]) {
              return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof method === 'object' || ! method) {
              return methods.init.apply(this, arguments);
            } else {
              $.error('Method ' +  method + ' does not exist on jQuery.myPlugin');
            }
        };
        console.log(config);
})(jQuery);