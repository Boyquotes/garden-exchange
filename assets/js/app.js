import '../scss/app.scss';
import '../scss/responsive.scss';

// loads the Bootstrap jQuery plugins
import 'bootstrap-sass/assets/javascripts/bootstrap/transition.js';
import 'bootstrap-sass/assets/javascripts/bootstrap/alert.js';
import 'bootstrap-sass/assets/javascripts/bootstrap/collapse.js';
import 'bootstrap-sass/assets/javascripts/bootstrap/dropdown.js';
import 'bootstrap-sass/assets/javascripts/bootstrap/modal.js';
import 'jquery'

// loads the code syntax highlighting library
import './highlight.js';

// Creates links to the Symfony documentation
import './doclinks.js';


import './jquery.lightbox.min.js';



$(document).ready( function(){
    $('[rel="lightbox"]').lightbox();
    
    $('#user_profile_info_edit').find('.campingType_choice').each( function(){
        $(this).click(function () {
            var idCampingType = $(this).attr('id');
            if ( $('#user_profile_profile_campingTypes option[value="'+idCampingType+'"]').prop( 'selected' ) == true )
            {
                $('#user_profile_profile_campingTypes option[value="'+idCampingType+'"]').removeAttr('selected');
                $(this).removeClass('campingType_selected');
            }
            else{
                $('#user_profile_profile_campingTypes option[value="'+idCampingType+'"]').attr('selected','selected');
                $(this).addClass('campingType_selected');
            }

            if($('.campingType_choice').hasClass('campingType_selected')){
                $('.error-campingTypes').hide();
            }
        });
    });
    
    $('#sendFilter').click( function() {
        var elementsCampingTypes = [];
        $('.campingTypes-garden-listing').find('.campingType_choice').each( function(){
            if($(this).hasClass('campingType_selected')){
                elementsCampingTypes.push($(this).attr('id'));
            }
        });

        var elementsEquipments = [];
        $('.equipments-garden-listing').find('.equipment_choice').each( function(){
            if($(this).hasClass('equipment_selected')){
                elementsEquipments.push($(this).attr('id'));
            }
        });
        
        var elementsRules = [];
        $('.rules-garden-listing').find('.rule_choice').each( function(){
            if($(this).hasClass('rule_selected')){
                elementsRules.push($(this).attr('id'));
            }
        });

        // requete ajax
        var urlAction = $(this).attr('data-action');
        $.ajax({
          url: urlAction,
          method: 'POST',
          data: { filtersCampingTypes: elementsCampingTypes, filtersEquipments: elementsEquipments, filtersRules: elementsRules }
        })
        .done(function(data) {
            $('.gardens-listing-result').html(data);
        });

    });
    
    $('#results').find('.campingType_choice').each( function(){
        $(this).click(function () {
            if($(this).hasClass('campingType_selected')){
                $(this).removeClass('campingType_selected');
            }
            else{
                $(this).addClass('campingType_selected');
            }
            
        });
    });
    $('#results').find('.equipment_choice').each( function(){
        $(this).click(function () {
            if($(this).hasClass('equipment_selected')){
                $(this).removeClass('equipment_selected');
            }
            else{
                $(this).addClass('equipment_selected');
            }
        });
    });
    $('#results').find('.rule_choice').each( function(){
        $(this).click(function () {
            if($(this).hasClass('rule_selected')){
                $(this).removeClass('rule_selected');
            }
            else{
                $(this).addClass('rule_selected');
            }
            
        });
    });
    
    
});
