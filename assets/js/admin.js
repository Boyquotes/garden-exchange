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

function initAjaxPost(){
    $('#main').find('[data-post]').each( function(){
        $(this).click( function(){
            var urlAction = $(this).attr('data-action')
            var element = $(this).attr('data-element')
            var id = $(this).attr('data-id')
            var token = $(this).attr('data-token')
            var classes = $(this).attr('data-classes')
            var recup = $(this).attr('data-recup')
            if(classes){
                var classesTab = classes.split('|')
            }
            if(recup){
                $.ajax({
                  url: urlAction,
                  method: 'POST',
                  data: { _token: token,
                           recupData: $(this).prev("."+recup).val()
                  }
                })
                .done(function( msg ) {
                    if(classes){
                        $("."+element+id).removeClass(classesTab[0]);
                        $("."+element+id).addClass(classesTab[1]);
                    }
                    if( typeof msg.route == 'object' ){
                        $.each( msg.route, function( key, value ) {
                            $.ajax({
                              url: value,
                              method: 'GET'
                            })
                            .done(function(data) {
                                $(key).html(data);
                                initAjaxPost();
                            });
                        });
                    }
                });
            }
            else{
                $.ajax({
                  url: urlAction,
                  method: 'POST',
                  data: { _token: token,
                  }
                })
                .done(function( msg ) {
                    if(classes){
                        $("."+element+id).removeClass(classesTab[0]);
                        $("."+element+id).addClass(classesTab[1]);
                    }
                    if( typeof msg.route == 'object' ){
                        $.each( msg.route, function( key, value ) {
                            $.ajax({
                              url: value,
                              method: 'GET'
                            })
                            .done(function(data) {
                                $(key).html(data);
                                initAjaxPost();
                            });
                        });
                    }
                });
            }
        });
    });
}

function initAjaxDelete($element = '#main'){
    $($element).find('[data-delete]').each( function(){
        $(this).click( function(){
            $('#baseModal').modal('hide');
            $('.loading-content').html("Suppression en cours");
            $('.loading').show();
            $('.loading').css('display', 'flex');
            var urlAction = $(this).attr('data-action')
            var id = $(this).attr('data-id')
            var element = $(this).attr('data-element')
            var token = $(this).attr('data-token')
            $.ajax({
              url: urlAction,
              method: 'DELETE',
              data: { _token: token }
            })
            .done(function( data ) {
                  $('.'+element+'-'+id).hide();
                  $('.loading').hide();
                  $('.flash-messages').html('<div class="alert alert-dismissible alert-success fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Annonce supprimée</div>');
                  $('.flash-messages').show( 300 ).delay( 1000 ).fadeOut( 800 );
            });
        });
    });
}

$(document).ready( function(){
    initAjaxPost();
    initAjaxDelete();
    
    $('#submit-add-garden').on('click', function () {
        event.preventDefault();
        var count = 0;
        $('#main').find('.campingType_choice').each( function(){
            if($(this).hasClass('campingType_selected')){
                count++;
            }
            if(count == 0){
                $('.error-campingTypes').show();
                window.scrollTo(100,0);
                $('.loading').hide();
            }
            else{
                $('.error-campingTypes').hide();
            }
        });
        if(count > 0){
                $('.loading').show();
                $('.loading').css('display', 'flex');
                window.scrollTo(100,0);
                $('.form-add-garden').submit();
        };
    });
    
    $('#submit-edit-garden').on('click', function () {
        event.preventDefault();
        var count = 0;
        var countPostcode = 0;
        var countCity = 0;
        console.log('countPostcode');
        console.log(countPostcode);
        if($('#garden_postcode').val() != ''){
            countPostcode++;
        }
        if(countPostcode == 0){
            $('.warning-postcode').show();
            window.scrollTo(100,0);
        }
        if($('#garden_city').val() != ''){
            countCity++;
        }
        if(countCity == 0){
            $('.warning-city').show();
            window.scrollTo(100,0);
        }
        $('#main').find('.campingType_choice').each( function(){
            if($(this).hasClass('campingType_selected')){
                count++;
            }
            if(count == 0){
                $('.error-campingTypes').show();
                window.scrollTo(100,0);
            }
            else{
                $('.error-campingTypes').hide();
            }
        });
        if(count > 0){
                $('.loading-content').html("Modification de l'annonce en cours");
                $('.loading').show();
                $('.loading').css('display', 'flex');
                window.scrollTo(100,0);
                $('.form-edit-garden').submit();
        };
    });
    

    $('#main').find('#admin_garden_edit .publish-garden buttonBAK').on('click', function () {
        event.preventDefault();
        $('.edit-garden').submit();

    });
    if( $('.flash-messages').html() != '' ){
        $('.flash-messages').show( 300 ).delay( 1000 ).fadeOut( 1000 );
    }
    $('#main').find('.edit-gardenBAK').each(function(){
        var $form = $(this);
        $form.submit(function(event){
            event.preventDefault();
            var submit = $form.find('button[type=submit]')[0];
            $(submit).addClass("disabled");
            $(submit).attr("disabled","disabled");
            $.post($form.attr("action"),
                $form.serialize(),
                function(msg){
                    var $msg = $(msg);
                })
                .done(function(msg) {

                });
            });
    });
            

    $('#garden_description').on('keyup', function(){
        if($('#garden_description').val().length > 50){
            $('.error-description').hide();
        }
        else if($('#garden_description').val().length == 0){
            $('.error-description').show();
        }
    });

    $('#garden_street').on('keyup', function(){
        if($('#garden_street').val().length > 2){
            $('.error-street').hide();
        }
        else if($('#garden_street').val().length == 0){
            $('.error-street').show();
        }
    });
    $('#garden_postcode').on('keyup', function(){
        if($('#garden_postcode').val().length > 2){
            $('.error-postcode').hide();
        }
        else if($('#garden_postcode').val().length == 0){
            $('.error-postcode').show();
        }
    });
    $('#garden_city').on('keyup', function(){
        if($('#garden_city').val().length > 2){
            $('.error-city').hide();
        }
        else if($('#garden_city').val().length == 0){
            $('.error-city').show();
        }
    });
    $('#garden_area').on('keyup', function(){
        if($('#garden_area').val().length > 2){
            $('.error-area').hide();
        }
        else if($('#garden_area').val().length == 0){
            $('.error-area').show();
        }
    });

    $('#main').find('.equipment_choice').each( function(){
        $(this).click(function () {
            var idEquipment = $(this).attr('id');
            if ( $('#garden_equipments option[value="'+idEquipment+'"]').prop( 'selected' ) == true )
            {
                $('#garden_equipments option[value="'+idEquipment+'"]').removeAttr('selected');
                $(this).removeClass('equipment_selected');
            }
            else{
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
                $('#garden_campingTypes option[value="'+idCampingType+'"]').removeAttr('selected');
                $(this).removeClass('campingType_selected');
            }
            else{
                $('#garden_campingTypes option[value="'+idCampingType+'"]').attr('selected','selected');
                $(this).addClass('campingType_selected');
            }

            if($('.campingType_choice').hasClass('campingType_selected')){
                $('.error-campingTypes').hide();
            }
        });
    });

    $('#main').find('.rule_choice').each( function(){
        $(this).click(function () {
            var idRule = $(this).attr('id');
            if ( $('#garden_rules option[value="'+idRule+'"]').prop( 'selected' ) == true )
            {
                $('#garden_rules option[value="'+idRule+'"]').removeAttr('selected');
                $(this).removeClass('rule_selected');
            }
            else{
                $('#garden_rules option[value="'+idRule+'"]').attr('selected','selected');
                $(this).addClass('rule_selected');
            }
        });
    });

    $('#post_postImages').change(function (event) {
        //Get count of selected files
        var countFiles = $(this)[0].files.length;

        var imgPath = $(this)[0].value;
        var extn = imgPath.substring(imgPath.lastIndexOf('.') + 1).toLowerCase();
        var image_holder = $("#upload_post_image_result");
        image_holder.empty();

        if(extn == "png" || extn == "jpg" || extn == "jpeg"){
            if (typeof (FileReader) != "undefined") {

                //loop for each file selected for uploaded.
                for (var i = 0; i < countFiles; i++) {
                    if($(this)[0].files[i].size > 2000000){
                        alert('Cette image '+$(this)[0].files[i].name+' ne pourra pas être envoyée vers nos serveurs car elle est supérieure à 2MB');
                    }
                    else{
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $("<img />", {
                                "src": e.target.result,
                                    "class": "thumb-image is-hidden-mobile"
                            }).appendTo(image_holder);
                            $("<img />", {
                                "src": e.target.result,
                                    "class": "thumb-image-mobile is-hidden-desktop"
                            }).appendTo(image_holder);
                        }

                        image_holder.show();
                        reader.readAsDataURL($(this)[0].files[i]);
                    }
                }
            } else {
                alert("This browser does not support FileReader.");
            }
        } else {
            alert("Ce type de fichier n'est pas supporte, seulement jpg, jpeg, png");
        }
    });
    
    $('.item-actions').find('#deleteGardenModal').click(function () {
        // requete ajax
        var urlAction = $(this).attr('data-action');
        $.ajax({
          url: urlAction,
          method: 'GET'
        })
        .done(function(data) {
            $('.modal-content').html(data);
            initAjaxDelete('.modal-footer');
        });
        $('#baseModal').modal('show');
    });
    
    $('.action-profile').find('#deleteCamperModal').click(function () {
        // requete ajax
        var urlAction = $(this).attr('data-action');
        $.ajax({
          url: urlAction,
          method: 'GET'
        })
        .done(function(data) {
            $('.modal-content').html(data);
            initAjaxDelete('.modal-footer');
        });
        $('#baseModal').modal('show');
    });
    
    $('#main').find('.ajaxLink').click(function () {
        // requete ajax
        var urlAction = $(this).attr('data-action');
        $.ajax({
          url: urlAction,
          method: 'GET'
        })
        .done(function(data) {
            $('.notification').html(data.success);
        });
    });
    
});
