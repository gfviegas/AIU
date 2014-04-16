/*////////////////////////////////////////////////////////////////////////////////////
         // CAUTION:
         // The file input name needs to be: "Photo" . If you change it, remember to change JS and PHP names as well.
/////////////////////////////////////////////////////////////////////////////////////
               //  It's strongly adviced to not change for this point foward, unless you are a pro in jQuery.\\
*/
$(document).ready(function(){
    var image_default = $('#photo_preview').attr("src"); /* Saves the default-image path. If something fails, it'll be shown again..*/

    $('#photo_input').on("change", function(){

        var _this = this;
                        /********************************************************************    IE Support (yuk) ****************************************************************************************/
        function isAjaxUploadSupported(){
            var input = document.createElement("input");
                input.type = "file";
                return (
                        "multiple" in input &&
                        typeof File != "undefined" &&
                        typeof FormData != "undefined" &&
                        typeof (new XMLHttpRequest()).upload != "undefined" );
            }

        function getIframeContentJSON(iframe){
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

        if(!isAjaxUploadSupported()){
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
            form.setAttribute("action", 'photo_controller.php');
            form.setAttribute("method", "post");
            form.setAttribute("enctype", "multipart/form-data");
            form.setAttribute("encoding", "multipart/form-data");
            form.style.display = "none";

            var files = $(this)[0];
            form.appendChild(files);
            $('#photo_preview').attr("src", "images/ajax-loader.gif").addClass("loading");
            $(".photo_error").hide();  /* Hides the error message, if it is visible.*/

            document.body.appendChild(form);
            document.body.appendChild(iframe);

            iframeIdmyFile = document.getElementById("upload_iframe_myFile");
            var eventHandlermyFile = function () {
                if (iframeIdmyFile.detachEvent)
                    iframeIdmyFile.detachEvent("onload", eventHandlermyFile);
                else
                    iframeIdmyFile.removeEventListener("load", eventHandlermyFile, false);

                response = getIframeContentJSON(iframeIdmyFile);
                if(response.success)
                {
                    $('#photo_preview').attr("src", response.src).removeClass("loading");
                }
                else
                {
                    $('#photo_preview').attr("src", image_default).removeClass("loading");
                         if(response.msg) {
                            $(".photo_error").show().html(response.msg);
                        } else {
                            $(".photo_error").show().html(" An error occured. Check the image extension and size.");
                        }
                }
            };

            if (iframeIdmyFile.addEventListener)
                iframeIdmyFile.addEventListener("load", eventHandlermyFile, true);
            if (iframeIdmyFile.attachEvent)
                iframeIdmyFile.attachEvent("onload", eventHandlermyFile);

            form.submit();

            $('#photo_form').append(_this);

        } else {
                 /*********************************************************** Nice Browsers ********************************************************************************/
            var data = new FormData();
            data.append("Photo", $(this).prop("files")[0]);

            $('#photo_preview').attr("src", "images/ajax-loader.gif").addClass("loading");
            $(".photo_error").hide(); /* Hides the error message, if it is visible.*/
            $.ajax(
            {

                url: 'photo_controller.php',
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
                        $('#photo_preview').attr("src", data.src).removeClass("loading");
                   }
                   else
                   {
                        $('#photo_preview').attr("src", image_default).removeClass("loading");
                       if (data.msg) {
                            $(".photo_error").show().html(data.msg);
                        } else {
                            $(".photo_error").show().html(" An error occured. Check the image extension and size.");
                        }
                   }
                },
                error: function(xhr, textStatus, errorThrown)
                {
                    console.log(xhr, textStatus, errorThrown);
                    $('#photo_preview').attr("src", image_default).removeClass("loading");
                     if (data.msg) {
                            $(".photo_error").show().html(data.msg);
                        } else {
                            $(".photo_error").show().html(" An error occured. Check the image extension and size.");
                        }
                    return false;
                }
            });
        }
    });
});