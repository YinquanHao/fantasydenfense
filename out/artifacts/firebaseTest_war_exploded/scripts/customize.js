/*
 * Created by Leo on 11/21/16.
 */

var game;
var customizeMap;
var defaultMap;
var monsterStack;
var money = 100;
var size;
var stackIndex = 19;
var window_width = window.innerWidth;
var window_height = window.innerHeight;
var mapName;

var mapBase = function(positionX, positionY, gameImage ,bgimage){
    this.positionX = positionX;
    this.positionY = positionY;
    this.gameImage = gameImage;
    this.mapBaseBg = game.add.sprite(positionX,positionY,bgimage);
    game.physics.enable(this.mapBaseBg, Phaser.Physics.ARCADE);
    this.mapBaseBg.body.immovable = true;
    this.isTowerSet  = false;
}

mapBase.prototype.getPosition = function(){
    var position = new Array();
    position[0] = this.positionX;
    position[1] = this.positionY;
    return position;
}
mapBase.prototype.getImage = function(){
    return this.gameImage;
}

mapBase.prototype.setImage = function(gameImage){
    this.gameImage = gameImage;
};


function MapBaseListener(){
    this.param1.getImage().destroy();
    i = this.param1.getPosition()[0];
    j = this.param1.getPosition()[1];

    if(selectedTower === 0) {
        if(money>100) {
            this.param1.setImage(new towerObj(numberOfTowers, 'eyetower', size, 20, 500, game, Bullets277, this.param1.getPosition()[0], this.param1.getPosition()[1], enemyArray, 500, this.param1, false));
            this.param1.isTowerSet = true;
            towerArray.push(this.param1.getImage());
            numberOfTowers++;
            money-=100;
        }
    }

    //******   add by Jun *****////
    // this below is for customize

    // 6 is start grid
    else if (selectedTower === 6){

        this.param1 = new mapBase(this.param1.getPosition()[0], this.param1.getPosition()[1],game.add.image(this.param1.getPosition()[0], this.param1.getPosition()[1],'start'),'grid');
        this.param1.getImage().scale.setTo(size/10/100,size/10/100);
        this.param1.mapBaseBg.scale.setTo(size/10/100,size/10/100);
        this.param1.getImage().inputEnabled = true;
        this.param1.getImage().events.onInputDown.add(MapBaseListener, {param1: this.param1 , param2:this.param2});
        defaultMap[this.param2] = 5;


    }
    // 7 is path
    else if (selectedTower === 7){
        this.param1 = new mapBase(this.param1.getPosition()[0], this.param1.getPosition()[1],game.add.image(this.param1.getPosition()[0], this.param1.getPosition()[1],'path'),'grid');
        this.param1.getImage().scale.setTo(size/10/100,size/10/100);
        this.param1.mapBaseBg.scale.setTo(size/10/100,size/10/100);
        this.param1.getImage().inputEnabled = true;
        this.param1.getImage().events.onInputDown.add(MapBaseListener, {param1: this.param1 , param2:this.param2});
        defaultMap[this.param2] = 1;
    }

    // 8 is end

    else if (selectedTower === 8){

        this.param1 = new mapBase(this.param1.getPosition()[0], this.param1.getPosition()[1],game.add.sprite(this.param1.getPosition()[0], this.param1.getPosition()[1],'home'),'grid');
        this.param1.getImage().frame = 1;
        this.param1.getImage().scale.setTo(size/10/400,size/10/400);
        this.param1.mapBaseBg.scale.setTo(size/10/400,size/10/400);
        this.param1.getImage().animations.add('homeAnimation',[0,1,2,3,4,5,6,7,8,9],10,true);
        this.param1.getImage().animations.play('homeAnimation');
        home = this.param1.getImage();
        this.param1.getImage().inputEnabled = true;
        this.param1.getImage().events.onInputDown.add(MapBaseListener, {param1: this.param1 , param2:this.param2});



        defaultMap[this.param2] = 4;
    }

    else if (selectedTower === 9){

        this.param1 = new mapBase(this.param1.getPosition()[0], this.param1.getPosition()[1],game.add.image(this.param1.getPosition()[0], this.param1.getPosition()[1],'grid'),'grid');
        this.param1.getImage().scale.setTo(size/10/100,size/10/100);
        this.param1.mapBaseBg.scale.setTo(size/10/100,size/10/100);
        defaultMap[this.param2] = 0;
        this.param1.getImage().inputEnabled = true;
        this.param1.getImage().events.onInputDown.add(MapBaseListener, {param1: this.param1 , param2:this.param2});


        console.log(defaultMap);

    }
    //******   add by Jun *****////

}


function actionOnClick () {

    selectedTower = this.param1;

}
function saveAction(){
    money = getCustomMoney();
    var content = JSON.stringify({Map : defaultMap, Monster: monsterStack, Money : money});
    mapName = getLevelName();
    shareMyWork(mapName,defaultMap,monsterStack,money);
    //change
    var cuslist = window.sessionStorage.getItem("cusName");
    cuslist = cuslist+mapName+",";
    window.sessionStorage.setItem("cusName",cuslist);
    //change
    window.localStorage.setItem(mapName,content);
}

function loadLevel(levelname){
    resetmap();
    mapName = levelname;
    // change
    firebase.database().ref('share/' + levelname).once('value').then(function(snapshot) {
        var balance = snapshot.child("Balance").val();
        var map = snapshot.child("Map").val();
        var monster = snapshot.child("Monster").val();
        var content = JSON.stringify({Map : map, Monster: monster, Money : balance});
        alert(content);
        window.localStorage.setItem(mapName,content);
    });
    // change
    var temp = window.localStorage.getItem(levelname);
    var data = JSON.parse(temp);
    money = data.Money;
    document.getElementById("money-text").innerHTML= money.toString();
    defaultMap = data.Map;
    monsterStack = data.Monster;
    refreshMap();

}
function refreshMap(){
    bg = game.add.sprite(0, 0, 'background');
    bg.scale.setTo(window.innerWidth/1800,window.innerHeight/1199)
    boardBg = game.add.sprite(size/20*2,size/20*2,'high_way');
    boardBg.scale.setTo(size/20*16/1000,size/20*16/1000);

    var k = 0;
    var i = 0;
    var j = 0;

    for(i=size/20*2;i<size/20*17;i=i+(size/10)){
        for(j=size/20*2;j<size/20*17;j=j+(size/10)) {
            if(defaultMap[k] ===0) {
                customizeMap[k] = new mapBase(j,i,game.add.image(j,i,'grid'),'grid');
                customizeMap[k].getImage().scale.setTo(size/10/100,size/10/100);
                customizeMap[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);
                customizeMap[k].getImage().inputEnabled = true;
                customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});

            }else if(defaultMap[k]===1){


                customizeMap[k] = new mapBase(j,i,game.add.image(j,i,'path'),'grid');
                customizeMap[k].getImage().scale.setTo(size/10/100,size/10/100);
                customizeMap[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);
                customizeMap[k].getImage().inputEnabled = true;
                customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});

            }else if(defaultMap[k]===5){


                customizeMap[k] = new mapBase(j,i,game.add.image(j,i,'start'),'grid');
                customizeMap[k].getImage().scale.setTo(size/10/100,size/10/100);
                customizeMap[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);
                customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});

            }else if(defaultMap[k]===4){


                customizeMap[k] = new mapBase(j,i,game.add.sprite(j,i,'home'),'grid');
                customizeMap[k].getImage().frame = 1;
                customizeMap[k].getImage().scale.setTo(size/10/400,size/10/400);
                customizeMap[k].mapBaseBg.scale.setTo(size/10/400,size/10/400);
                customizeMap[k].getImage().animations.add('homeAnimation',[0,1,2,3,4,5,6,7,8,9],10,true);
                customizeMap[k].getImage().animations.play('homeAnimation');
                home = customizeMap[k].getImage();

                game.physics.enable(home, Phaser.Physics.ARCADE);
                home.body.immovable = false;
                customizeMap[k].getImage().inputEnabled = true;
                customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});

            }
            k++;
        }
    }
}

function resetmap(){
    bg = game.add.sprite(0, 0, 'background');
    bg.scale.setTo(window.innerWidth/1800,window.innerHeight/1199)
    boardBg = game.add.sprite(size/20*2,size/20*2,'high_way');
    boardBg.scale.setTo(size/20*16/1000,size/20*16/1000);
    var k = 0;
    var i = 0;
    var j = 0;

    for(i=size/20*2;i<size/20*17;i=i+(size/10)){
        for(j=size/20*2;j<size/20*17;j=j+(size/10)) {
            defaultMap[k] = 0;
            customizeMap[k] = new mapBase(j,i,game.add.image(j,i,'grid'),'grid');
            customizeMap[k].getImage().scale.setTo(size/10/100,size/10/100);
            customizeMap[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);
            customizeMap[k].getImage().inputEnabled = true;
            customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});
            k++;
        }
    }

}

function addMonster(num){


    if (num ===0){
        monsterStack.push(0);




    }
    else if (num ===1){
        monsterStack.push(1);
    }
    else if (num ===2){
        monsterStack.push(2);
    }
    else if (num ===3){
        monsterStack.push(3);
    }
    else if (num ===4){
        monsterStack.push(4);
    }else if(num ===5){
        monsterStack.push(5);
    }
}
function remove(num){
    monsterStack.splice(num,1);
}


window.onload = function() {
    // creating a 320x480 pixels game and executing PlayGame state
    game = new Phaser.Game(window_width, window_height, Phaser.AUTO, "");

    game.state.add("customizeScreen",customizeScreen);

    game.state.start("customizeScreen");
}


var customizeScreen =  function (game){};
customizeScreen.prototype ={
    preload: function(){

        game.load.image('background', 'assets/background.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('high_way','assets/basic_map.png');
        game.load.spritesheet('eyetowerButton', 'assets/buttons/eye_tower.png', 200, 100);
        game.load.image('grid', 'assets/blank.png');
        game.load.spritesheet('home', 'assets/path/home.png', 400, 400);
        game.load.image('path', 'assets/path/pathnew2.png');
        game.load.image('start', 'assets/path/start_stage.png');
        game.load.image("blank",'assets/grid.png')

        game.load.spritesheet('eye', 'assets/monsters/mob_mov_2.png', 300, 300, 5);
        game.load.spritesheet('feiLian', 'assets/monsters/feiLian.png',600,600,7);
        game.load.spritesheet('huoDou', 'assets/monsters/dou_ani.png',599,599,7);
        game.load.spritesheet('hong', 'assets/monsters/hong_ani.png',599,599,7);
        game.load.spritesheet('qiLin', 'assets/monsters/qilin_ani.png',599,599,7);
        game.load.spritesheet('tie', 'assets/monsters/tie_ani.png',599,599,7);

    },
    create: function(){
        size  = Math.min(window.innerHeight,window.innerWidth);
        monsterStack = new Array();
        customizeMap = new Array();
        monsterStack =[4,4];
        defaultMap =[
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0
        ];

        var bg = game.add.sprite(0, 0, 'background');
        bg.scale.setTo(window.innerWidth/1800,window.innerHeight/1199)
        var boardBg = game.add.sprite(size/20*2,size/20*2,'high_way');
        boardBg.scale.setTo(size/20*16/1000,size/20*16/1000);
        var k = 0;
        var i = 0;
        var j = 0;

        for(i=size/20*2;i<size/20*17;i=i+(size/10)){
            for(j=size/20*2;j<size/20*17;j=j+(size/10)) {
                if(defaultMap[k] ===0) {
                    customizeMap[k] = new mapBase(j,i,game.add.image(j,i,'grid'),'grid');
                    customizeMap[k].getImage().scale.setTo(size/10/100,size/10/100);
                    customizeMap[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);
                    customizeMap[k].getImage().inputEnabled = true;
                    customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});

                }else if(defaultMap[k]===1){


                    customizeMap[k] = new mapBase(j,i,game.add.image(j,i,'path'),'grid');
                    customizeMap[k].getImage().scale.setTo(size/10/100,size/10/100);
                    customizeMap[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);
                    customizeMap[k].getImage().inputEnabled = true;
                    customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});

                }else if(defaultMap[k]===5){


                    customizeMap[k] = new mapBase(j,i,game.add.image(j,i,'start'),'grid');
                    customizeMap[k].getImage().scale.setTo(size/10/100,size/10/100);
                    customizeMap[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);
                    customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});

                }else if(defaultMap[k]===4){


                    customizeMap[k] = new mapBase(j,i,game.add.sprite(j,i,'home'),'grid');
                    customizeMap[k].getImage().frame = 1;
                    customizeMap[k].getImage().scale.setTo(size/10/400,size/10/400);
                    customizeMap[k].mapBaseBg.scale.setTo(size/10/400,size/10/400);
                    customizeMap[k].getImage().animations.add('homeAnimation',[0,1,2,3,4,5,6,7,8,9],10,true);
                    customizeMap[k].getImage().animations.play('homeAnimation');
                    home = customizeMap[k].getImage();

                    game.physics.enable(home, Phaser.Physics.ARCADE);
                    home.body.immovable = false;
                    customizeMap[k].getImage().inputEnabled = true;
                    customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});

                }
                k++;
            }
        }

        // var cstartButton = game.add.button(size/20*19, size/3, 'eyetowerButton', actionOnClick, {param1:6}, 0, 0, 0);
        // var cpathButton = game.add.button(size/20*18, size/3, 'eyetowerButton', actionOnClick, {param1:7}, 0, 0, 0);
        // var cendButton = game.add.button(size/20*17, size/3, 'eyetowerButton', actionOnClick, {param1:8}, 0, 0, 0);
        // var removeButton = game.add.button(size/20*16, size/3, 'eyetowerButton', actionOnClick, {param1:9}, 0, 0, 0);
        //
        // var saveButton = game.add.button(size/20*30, size/3, 'eyetowerButton',saveAction);
        //
        // var addFeilian = game.add.button(size/20*19, size/2, 'eyetowerButton',addMonster,{monster:0});
        // var addHon = game.add.button(size/20*24, size/2, 'eyetowerButton',addMonster,{monster:1});
        // var addHuodou = game.add.button(size/20*25, size/2, 'eyetowerButton',addMonster,{monster:2});
        // var addqilin = game.add.button(size/20*26, size/2, 'eyetowerButton',addMonster,{monster:3});
        // var addeye= game.add.button(size/20*27, size/2, 'eyetowerButton',addMonster,{monster:4});



        // textfield
        //monster array


    },// create end
    /*update: function(){
     if (addFeilian.input.onDown){
     game.add.sprite(100,200,"feiLian");
     }
     }*/


}











/***********************************add by lead designer*****************************************/
function clickCustomButton(num){
    selectedTower = num;
}

function getLevelName(){
    //window.alert(document.getElementById("levelname").value);
    return document.getElementById("levelname").value;
}
/*function getloadMapName(){
 return document.getElementById("mapname").value;
 }*/
function getCustomMoney(){
    //window.alert(document.getElementById("money-text").innerHTML);
    return document.getElementById("money-text").innerHTML;
}


document.getElementById("path-button").addEventListener('click',function(){clickCustomButton(7);});
document.getElementById("origin-button").addEventListener('click',function(){clickCustomButton(6);});
document.getElementById("end-button").addEventListener('click',function(){clickCustomButton(8);});
document.getElementById("remove-button").addEventListener('click',function(){clickCustomButton(9);});

document.getElementById("control-customize-button1").addEventListener('click',function(){
    if(mapName!= null){
        window.sessionStorage.setItem("UserMap",mapName);
        window.location.href ="/custPlay.html";
    }
    else{
        alert("Please save first!");
    }

});
document.getElementById("control-customize-button2").addEventListener('click',function(){saveAction()});
document.getElementById("control-customize-button4").addEventListener('click',function(){window.location.href="game.html"});
/*document.getElementById("control-customize-button5").addEventListener('click',function(){
 loadLevel(getloadMapName());
 })*/

function moneyText(isIncrement){
    var s = document.getElementById("money-text").textContent;
    var s2 = parseInt(s);
    if(isIncrement){
        if(s2<1000){
            s2=s2+100;
            document.getElementById("money-text").innerHTML=s2;
        }
    }
    else{
        if(s2>100){
            s2=s2-100;
            document.getElementById("money-text").innerHTML=s2;
        }
    }
}
document.getElementById("plus-button").addEventListener('click',function(){moneyText(true);});
document.getElementById("minus-button").addEventListener('click',function(){moneyText(false);});
var button1 = document.getElementById("monster-row-button1");
var button2 = document.getElementById("monster-row-button2");
var row1 = document.getElementById("monster-row-1");
var row2 = document.getElementById("monster-row-2");
var indextemp1=row1.rowIndex;
var indextemp2=row2.rowIndex;
button1.addEventListener('click',function(){removeMonster(row1);remove(indextemp1);});
button2.addEventListener('click',function(){removeMonster(row2);remove(indextemp2);});
function addMonsterUI(name){

    var table = document.getElementById("selected-monster-table");
    if(table.rows.length<50){
        var row = table.insertRow(-1);
        var col1 = row.insertCell(0);
        var col2 = row.insertCell(1);
        col1.className = "monster-name";
        col2.className = "delete-monster";
        col1.innerHTML = name;
        var button = document.createElement("BUTTON");
        var indextemp3 = row.rowIndex;
        button.addEventListener('click',function(){removeMonster(row);remove(indextemp3);});
        var span = document.createElement("SPAN");
        span.className = "glyphicon glyphicon-remove";
        col2.appendChild(button);
        button.appendChild(span);
    }
}

function removeMonster(row){
    var table = document.getElementById("selected-monster-table");
    if(table.rows.length>2){
        var rowIndex = row.rowIndex;
        table.deleteRow(rowIndex);
    }
}

function shareMyWork(MapName,map,monster,balance){
    firebase.database().ref('share/'+MapName).set({Map : map, Monster : monster,Balance:balance});
}

document.getElementById("feilian-button").addEventListener('click',function(){addMonsterUI("Fei Lian");addMonster(0);});
document.getElementById("citie-button").addEventListener('click',function(){addMonsterUI("Ci Tie");addMonster(5);});
document.getElementById("kirin-button").addEventListener('click',function(){addMonsterUI("Kirin");addMonster(3);});
document.getElementById("redboy-button").addEventListener('click',function(){addMonsterUI("Red Boy");addMonster(1);});
document.getElementById("huodou-button").addEventListener('click',function(){addMonsterUI("Huo Dou");addMonster(2);});
document.getElementById("mob-button").addEventListener('click',function(){addMonsterUI("Mob");addMonster(4);});



var levelCount = 0;
var row = null;
function addCustomLevel(name){
    var table = document.getElementById("custom-level-table");
    if(levelCount%6==0){
        row = table.insertRow(-1);
    }
    var col1 = row.insertCell(levelCount%6);
    levelCount = levelCount+1;
    var col2 = row.insertCell(levelCount%6);
    levelCount = levelCount+1;
    col1.className = "load-td1";
    col2.className = "load-td2";
    col1.innerHTML = name;
    var button = document.createElement("BUTTON");

    button.addEventListener('click',function(){loadLevel(name);});
    button.innerHTML="Load"
    col2.appendChild(button);
}
function addCustomLevelCaller(){
    var table = document.getElementById("custom-level-table");
    var number = table.getElementsByTagName("tr").length;
    while(number>0){
        table.deleteCell(0);
        number = number-1;
    }
    var cus =  window.sessionStorage.getItem("cusName");
    var cusName = cus.substr(0, cus.length - 1);
    var cusNameList = cusName.split(",");
    var i;
    for(i = 0; i<cusNameList.length; i++){
        addCustomLevel(cusNameList[i]);
    }
}
document.getElementById("control-customize-button3").addEventListener('click',function(){addCustomLevelCaller();});
/***********************************add by lead designer****************************************/