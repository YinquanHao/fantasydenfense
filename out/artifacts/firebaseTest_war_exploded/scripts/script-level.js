
$(document).ready(function(){
    var all_tooltip = $('[data-toggle="tooltip"]');
    var game_control1 = $("#control-game-button1");
    var game_control2 = $("#control-game-button2");

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

});