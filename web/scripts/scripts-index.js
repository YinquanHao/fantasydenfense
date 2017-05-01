$(document).ready(function(){

    var home_navbar_button=$(".home-navbar-button");
    var home_navbar_text=$(".home-nav-text");
    var navbar_nav=$(".navbar-nav");

    $(document).on({
        click: function(event){
            if(!home_navbar_button.is(event.target)&&!home_navbar_text.is(event.target)){
                navbar_nav.removeClass("home-navbar-show");
            }
        }/*,
         touchend: function(event){
         if(!home_navbar_button.is(event.target)&&!home_navbar_text.is(event.target)){
         navbar_nav.removeClass("home-navbar-show");
         }
         },*/
    });


    home_navbar_button.on({
        click: function(event){
            if(!home_navbar_text.is(event.target)){
                navbar_nav.toggleClass("home-navbar-show");
            }
        }
    });


    home_navbar_text.on({
        click: function(event){
            if(!home_navbar_button.is(event.target)){
                navbar_nav.toggleClass("home-navbar-show");
            }
        }
    });

});