;(function ( $, window, document, undefined ) {

		var pluginName = "AIU",
				defaults = {
				'photo_preview' : '#photo_preview',
				'photo_error' : '.photo_error',
				'img_loading_path' : 'images/ajax-loader.gif',
				'php_path' : 'photo_controller.php',
				'callback_success' : callbackSuccess,
				'callback_fails' : callbackFails,
<<<<<<< HEAD
				'error_msg': 'Something went wrong. Please try again later!',
				'extension_accepted': ["jpeg","jpg","gif","bmp","png"],
				'extension_msg': 'The image needs to be in the following extensions: jpeg, jpg, gif, bmp, png'
=======
				'callback_onload' : callbackOnload
>>>>>>> f4e62d33352578f615aba16ebcd3a6973cf81177
		};

		// Constructor
		function Plugin ( element, options ) {
				this.element = element;
				this._input = $("input[type=file]", $(element));
				this._options = options;
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
		}

		function callbackOnload(){
			console.log('Default Callback On Load function called!');
		}
		function callbackSuccess(){
			console.log('Default Callback Success function called!');
		}
		function callbackFails(){
			console.log('Default Callback Fails function called!');
		}

		Plugin.prototype = {
				init: function () {
					var that = this;
					var $photo_preview = $(this.settings.photo_preview);
					var $photo_error = $(this.settings.photo_error);
					var image_default = $photo_preview.attr("src"); 	/* Saves the default-image path. If something fails, it'll be shown again..*/
					var accept_ext = this.settings.extension_accepted;
					var extensions = accept_ext.join(", ");
					var msgErrorDefault = this.settings.error_msg;
					var extension_msg = this.settings.extension_msg;
					var callback_success = this.settings.callback_success;
					var callback_fails = this.settings.callback_fails;
					var callback_onload = this.settings.callback_onload;

					$(this._input).on("change", function(){
						callback_onload();
						var file_extension = $(this).val().split('.').pop().toLowerCase();
						var result = $.inArray(file_extension, accept_ext);

						$photo_preview.attr("src", that.settings.img_loading_path).addClass("loading");
						$photo_error.hide(); /* Hides the error message, if it is visible.*/

						if (result == -1) {
							$photo_error.show().html(extension_msg);
							$photo_preview.attr("src", image_default).removeClass("loading");
							return false;
						}
						 if(!that.isAjaxUploadSupported()){
						            var iframe = document.createElement("iframe");
						            iframe.setAttribute("id", "upload_iframe_myFile");
						            iframe.setAttribute("name", "upload_iframe_myFile");
						            iframe.setAttribute("width", "0");
						            iframe.setAttribute("height", "0");
						            iframe.setAttribute("border", "0");
						            iframe.setAttribute("src","javascript:false;");
						            iframe.style.display = "none";
						            var form = document.createElement("form");
						            form.setAttribute("target", "upload_iframe_myFile");
						            form.setAttribute("action", that.settings.php_path);
						            form.setAttribute("method", "post");
						            form.setAttribute("enctype", "multipart/form-data");
						            form.setAttribute("encoding", "multipart/form-data");
						            form.style.display = "none";

						            var files = $(this)[0];
						            form.appendChild(files);
						            document.body.appendChild(form);
						            document.body.appendChild(iframe);

						            iframeIdmyFile = document.getElementById("upload_iframe_myFile");
						            var eventHandlermyFile = function () {
						                if (iframeIdmyFile.detachEvent)
						                    iframeIdmyFile.detachEvent("onload", eventHandlermyFile);
						                else
						                    iframeIdmyFile.removeEventListener("load", eventHandlermyFile, false);

						                response = that.getIframeContentJSON(iframeIdmyFile);
						                if(response.success)
						                {
						                    $photo_preview.attr("src", response.src).removeClass("loading");
						                    callback_success(response.src);
						                }
						                else
						                {
						                	var message = response.msg || msgErrorDefault;

					                    	$photo_error.show().html(message);
						                    $photo_preview.attr("src", image_default).removeClass("loading");
						                    callback_fails();
						                }
						            };

						            if (iframeIdmyFile.addEventListener)
						                iframeIdmyFile.addEventListener("load", eventHandlermyFile, true);
						            if (iframeIdmyFile.attachEvent)
						                iframeIdmyFile.attachEvent("onload", eventHandlermyFile);

						            form.submit();

						            $(photo_form).append(that);

						        } else {
						                 /*********************************************************** Nice Browsers ********************************************************************************/
						            var data = new FormData();
						            data.append("Photo", $(this).prop("files")[0]);

						            $.ajax(
						            {
						                url: that.settings.php_path,
						                secureuri: false,
						                fileElementId: 'photo_input',
						                dataType: "json",
						                data: data,
						                cache: false,
						                enctype: "multipart/form-data",
						                type: "POST",
						                processData: false,
						                contentType: false,
						                success: function(data)
						                {
						                   if(data.success)
						                   {
						                        $photo_preview.attr("src", data.src).removeClass("loading");
						                        callback_success(data.src);
						                   }
						                   else
						                   {
						                   		var message = data.msg || msgErrorDefault;

						                    	$photo_error.show().html(message);
							                    $photo_preview.attr("src", image_default).removeClass("loading");
						                        callback_fails();
						                   }
						                },
						                error: function(xhr, textStatus, errorThrown)
						                {
						                    var message = data.msg || msgErrorDefault;

					                    	$photo_error.show().html(message);
						                    $photo_preview.attr("src", image_default).removeClass("loading");
					                        callback_fails();

						                    return false;
						                }
						            });
						        }
					});

				},

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

		$.fn[ pluginName ] = function ( options ) {
				this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});

				return this;
		};

})( jQuery, window, document );
