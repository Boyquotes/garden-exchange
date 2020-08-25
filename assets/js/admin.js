import '../scss/admin.scss';
import 'eonasdan-bootstrap-datetimepicker';
import 'typeahead.js';
import Bloodhound from "bloodhound-js";
import 'bootstrap-tagsinput';

$(function() {
    // Datetime picker initialization.
    // See https://eonasdan.github.io/bootstrap-datetimepicker/
    $('[data-toggle="datetimepicker"]').datetimepicker({
        icons: {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-chevron-up',
            down: 'fa fa-chevron-down',
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-check-circle-o',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
    });

    // Bootstrap-tagsinput initialization
    // https://bootstrap-tagsinput.github.io/bootstrap-tagsinput/examples/
    var $input = $('input[data-toggle="tagsinput"]');
    if ($input.length) {
        var source = new Bloodhound({
            local: $input.data('tags'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            datumTokenizer: Bloodhound.tokenizers.whitespace
        });
        source.initialize();

        $input.tagsinput({
            trimValue: true,
            focusClass: 'focus',
            typeaheadjs: {
                name: 'tags',
                source: source.ttAdapter()
            }
        });
    }
});

// Handling the modal confirmation message.
$(document).on('submit', 'form[data-confirmation]', function (event) {
    var $form = $(this),
        $confirm = $('#confirmationModal');

    if ($confirm.data('result') !== 'yes') {
        //cancel submit event
        event.preventDefault();

        $confirm
            .off('click', '#btnYes')
            .on('click', '#btnYes', function () {
                $confirm.data('result', 'yes');
                $form.find('input[type="submit"]').attr('disabled', 'disabled');
                $form.submit();
            })
            .modal('show');
    }
});

$(document).ready( function(){
    $('#main').find('[data-delete]').each( function(){
        $(this).click( function(){
            var urlDeleteGardenImage = $(this).attr('data-action')
            var gardenImageId = $(this).attr('data-id')
            var tokenDeleteGardenImage = $(this).attr('data-token')
            console.log(urlDeleteGardenImage);
            console.log('delete');
            $.ajax({
              url: urlDeleteGardenImage,
              method: 'DELETE',
              data: { _token: tokenDeleteGardenImage }
            })
            .done(function( data ) {
                console.log('image'+gardenImageId);
                  $('.image'+gardenImageId).hide();
            });
        });
    });
    
    $('#main').find('.equipment_choice').each( function(){
        $(this).click(function () {
            var idEquipment = $(this).attr('id');
            if ( $('#garden_equipments option[value="'+idEquipment+'"]').prop( 'selected' ) == true )
            {
                $('#garden_equipments option[value="'+idEquipment+'"]').prop('selected', '');
                $(this).removeClass('equipment_selected');
            }
            else if ( $('#garden_equipments option[value="'+idEquipment+'"]').attr( 'selected' ) == 'selected' )
            {
                console.log('selec');
                //~ $('#garden_equipments').hide();
                $('#garden_equipments option[value="4"]').removeAttr('selected', '');
                $(this).removeClass('equipment_selected');
            }
            else{
                console.log('sdsd bbb');
                $('#garden_equipments option[value="'+idEquipment+'"]').attr('selected','selected');
                $(this).addClass('equipment_selected');
            }
        });
    });

    $('#main').find('.campingType_choice').each( function(){
        $(this).click(function () {
            var idCampingType = $(this).attr('id');
            if ( $('#garden_campingTypes option[value="'+idCampingType+'"]').prop( 'selected' ) == true )
            {
                $('#garden_campingTypes option[value="'+idCampingType+'"]').prop('selected', '');
                $(this).removeClass('campingType_selected');
            }
            else{
                $('#garden_campingTypes option[value="'+idCampingType+'"]').prop('selected','selected');
                $(this).addClass('campingType_selected');
            }
        });
    });

    $('#garden_gardenImages').change(function (event) {
        console.log("hola");
        
     //Get count of selected files
     var countFiles = $(this)[0].files.length;

     var imgPath = $(this)[0].value;
     var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
     var image_holder = $("#upload_garden_image_result");
     image_holder.empty();

     if (extn == "gif" || extn == "png" || extn == "jpg" || extn == "jpeg") {
         if (typeof (FileReader) != "undefined") {

             //loop for each file selected for uploaded.
             for (var i = 0; i < countFiles; i++) {

                 var reader = new FileReader();
                 reader.onload = function (e) {
                     $("<img />", {
                         "src": e.target.result,
                             "class": "thumb-image"
                     }).appendTo(image_holder);
                 }

                 image_holder.show();
                 reader.readAsDataURL($(this)[0].files[i]);
             }

         } else {
             alert("This browser does not support FileReader.");
         }
     } else {
         alert("Pls select only images");
     }
        
        //~ console.log(event);
        var filename = $(this).val().replace(/C:\\fakepath\\/i, '');
        //~ console.log(filename);
        var fi = $('#garden_gardenImages')[0]; // GET THE FILE INPUT AS VARIABLE.
//~ console.log(fi);
        var totalFileSize = 0;

        // VALIDATE OR CHECK IF ANY FILE IS SELECTED.
        if (fi.files.length > 0)
        {
            // RUN A LOOP TO CHECK EACH SELECTED FILE.
            for (var i = 0; i <= fi.files.length - 1; i++)
            {
                //ACCESS THE SIZE PROPERTY OF THE ITEM OBJECT IN FILES COLLECTION. IN THIS WAY ALSO GET OTHER PROPERTIES LIKE FILENAME AND FILETYPE
                var fsize = fi.files.item(i).size;
                //~ console.log(fi.files.item(i));
                //~ console.log(fsize);
                totalFileSize = totalFileSize + fsize;
                //~ document.getElementById('fp').innerHTML =
                //~ document.getElementById('fp').innerHTML
                +
                '<br /> ' + 'File Name is <b>' + fi.files.item(i).name
                +
                '</b> and Size is <b>' + Math.round((fsize / 1024)) //DEFAULT SIZE IS IN BYTES SO WE DIVIDING BY 1024 TO CONVERT IT IN KB
                +
                '</b> KB and File Type is <b>' + fi.files.item(i).type + "</b>.";
            }
        }
        var reader = new FileReader();

        reader.onload = function (e) {
        // VALIDATE OR CHECK IF ANY FILE IS SELECTED.
            if (fi.files.length > 0)
            {
                // RUN A LOOP TO CHECK EACH SELECTED FILE.
                for (var i = 0; i <= fi.files.length - 1; i++)
                {
                //~ console.log(e.target.result);
                // get loaded data and render thumbnail.
                //~ $("#image").attr('src', e.target.result);
                $('.upload_garden_image_result').append("<img src='" + e.target.result + "' />");
                }
            }
        };

        // read the image file as a data URL.
        reader.readAsDataURL(fi.files[0]);
        
                if(typeof FileReader == "undefined") return true;

        var elem = $(this);
        var files = event.target.files;

        for (var i = 0, f; f = files[i]; i++) {
            if (f.type.match('image.*')) {
                var reader = new FileReader();
                reader.onload = (function(theFile) {
                    return function(e) {
                        var image = e.target.result;
                        console.log(image);
                        var previewDiv = $('.upload_garden_image_result', elem.parent());
                        var bg_width = previewDiv.width() * 2;
                        previewDiv.css({
                            "background-size":bg_width + "px, auto",
                            "background-position":"50%, 50%",
                            "background-image":"url("+image+")",
                        });
                    };
                })(f);
                reader.readAsDataURL(f);
            }
        }
        
        //~ $('.upload_garden_image_result').append("Total File(s) Size is <b>" + Math.round(totalFileSize / 1024) + "</b> KB");
        //~ $('.upload_garden_image_result').append("<img src='" + e.target.result + "' />");
        //~ var img = 
        //~ $('.upload_garden_image_result').append("<img src='"+e.target.result+"'>);
        
    });
    
});
