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
            console.log(idCampingType);
            console.log($('#user_profile_profile_campingTypes option[value="'+idCampingType+'"]').prop( 'selected' ));
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
    
});
