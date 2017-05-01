/**
 * Created by green on 12/18/2016.
 */
/* Set the width of the side navigation to 250px */
var music = 1;
var music_control = document.getElementById("music");
var music_control2 = document.getElementById("music2");
var music_bool =1;
var music_bool2 =1;
function openNav() {
    document.getElementById("mySidenav").style.width  = "400px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width  = "0";
}
function setVolume(){
    music_control = document.getElementById("music");
    if(music_bool===0){
        music_control.play();
        music_bool=1;
    }else{
        music_control.pause();
        music_bool=0;
    }
}
function setVolume2(){
    music_control2 = document.getElementById("music2");
    if(music_bool2===0){
        music_control2.play();
        music_bool2=1;
    }else{
        music_control2.pause();
        music_bool2=0;
    }
}