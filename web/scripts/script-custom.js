/**
 * Created by Rex on 12/5/16.
 */
$(document).ready(function(){
    $('#help-popup').modal('show');
    var all_tooltip = $('[data-toggle="tooltip"]');
    var game_control1 = $("#control-customize-button1");
    var game_control2 = $("#control-customize-button2");
    var game_control3 = $("#control-customize-button3");

    all_tooltip.tooltip({trigger : 'hover'});
    if($(window).width() < 900){
        all_tooltip.tooltip('disable');
    }
    $(window).resize(function(){
        if($(window).width() >= 900){
            all_tooltip.tooltip('enable');
        }
        else{
            all_tooltip.tooltip('disable');
        }
    });


    game_control1.on({
        touchstart: function(){
            game_control1.css("color","#7e909a");
        },
        touchend: function(){
            game_control1.css("color","white");
        },
    });

    game_control2.on({
        touchstart: function(){
            game_control2.css("color","#7e909a");
        },
        touchend: function(){
            game_control2.css("color","white");
        },
    });

    game_control3.on({
        touchstart: function(){
            game_control3.css("color","#7e909a");
        },
        touchend: function(){
            game_control3.css("color","white");
        },
    });

});