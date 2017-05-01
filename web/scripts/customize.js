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

//%%% new added
// var startx;
// var starty;
// var endx;
// var endy;
// var formatedArray;
// var movingPathReady;
// var movingPath;
// var easystar
//%%% new added

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
    //%%%% change here
    i = this.param1.getPosition()[0];
    j = this.param1.getPosition()[1];

    //******   add by Jun *****////
    // this below is for customize

    // 6 is start grid
    //%%%% change here
    if (selectedTower === 6){
        if (uniqueStart() === true){
            this.param1.getImage().destroy();
            this.param1 = new mapBase(this.param1.getPosition()[0], this.param1.getPosition()[1],game.add.image(this.param1.getPosition()[0], this.param1.getPosition()[1],'start'),'grid');
            this.param1.getImage().scale.setTo(size/10/100,size/10/100);
            this.param1.mapBaseBg.scale.setTo(size/10/100,size/10/100);
            this.param1.getImage().inputEnabled = true;
            this.param1.getImage().events.onInputDown.add(MapBaseListener, {param1: this.param1 , param2:this.param2});
            defaultMap[this.param2] = 5;
        }
        else{
            changeAlert(true,"You can only have one start");
            showAlert();
        }


    }
    // 7 is path
    //%%%% change here
    else if (selectedTower === 7){
        this.param1.getImage().destroy();
        this.param1 = new mapBase(this.param1.getPosition()[0], this.param1.getPosition()[1],game.add.image(this.param1.getPosition()[0], this.param1.getPosition()[1],'path'),'grid');
        this.param1.getImage().scale.setTo(size/10/100,size/10/100);
        this.param1.mapBaseBg.scale.setTo(size/10/100,size/10/100);
        this.param1.getImage().inputEnabled = true;
        this.param1.getImage().events.onInputDown.add(MapBaseListener, {param1: this.param1 , param2:this.param2});
        defaultMap[this.param2] = 1;
    }

    // 8 is end
    //%%%% change here
    else if (selectedTower === 8){
        if (uniqueEnd() === true){
            this.param1.getImage().destroy();
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
        else{
            changeAlert(true,"You can only have one end")
            showAlert()
        }
    }
    //%%%% change here
    else if (selectedTower === 9){
        this.param1.getImage().destroy();
        this.param1 = new mapBase(this.param1.getPosition()[0], this.param1.getPosition()[1],game.add.image(this.param1.getPosition()[0], this.param1.getPosition()[1],'grid'),'grid');
        this.param1.getImage().scale.setTo(size/10/100,size/10/100);
        this.param1.mapBaseBg.scale.setTo(size/10/100,size/10/100);
        defaultMap[this.param2] = 0;
        this.param1.getImage().inputEnabled = true;
        this.param1.getImage().events.onInputDown.add(MapBaseListener, {param1: this.param1 , param2:this.param2});




    }
    //******   add by Jun *****////

}
//%%%%% new add %%%%//
function uniqueStart() {
    if (defaultMap.indexOf(5) != -1){
        return false;
    }
    else
        return true;
}

function uniqueEnd(){
    if (defaultMap.indexOf(4) != -1){
        return false;
    }
    else
        return true;
}

function validateMap(){
    movingPathReady = false;
    movingPath = new Array();
    formatedArray = formatTo2DArray(defaultMap);
    easystar = new EasyStar.js();
    easystar.setGrid(formatedArray);
    easystar.setAcceptableTiles([1,4,5]);

    easystar.findPath(starty, startx, endy, endx, function( path ) {
        //alert("2q3qweqwd");
        if (path === null) {
            console.log("The path to the destinatio point was not found.");
        } else {
            //alert(path.length);
            for (var i = 0; i < path.length; i++)
            {
                console.log("P: " + i + "X: " + path[i].x + "Y: " + path[i].y);
                //pathFind.push([path[i].x ,path[i].y]);
                var row = path[i].x;
                var column = path[i].y;
                var index = row*8+column;
                var position = customizeMap[index].getPosition();
                movingPath.push([position[1],position[0]]);

            }
            movingPath.reverse();
            movingPathReady=true;
            //alert("movingpath ready");

        }
        console.log("check 1 "  + movingPathReady)
    });
    setTimeout(null,5000);
    easystar.calculate();
    findingPath= movingPath.reverse();
    console.log(movingPath);
    console.log("validate movepath = " + movingPathReady)
}

function formatTo2DArray(array){

    var newArr = [];
    while(array.length) newArr.push(array.splice(0,8));

    console.log(newArr);

    return newArr;
}
//%%%%% new add %%%%//

function actionOnClick () {

    selectedTower = this.param1;

}
function saveAction(){
    var id = window.sessionStorage.getItem("UserId");
    var username = window.sessionStorage.getItem("UserName");
    money = getCustomMoney();
    var content = JSON.stringify({Id: id, Name: username, Map : defaultMap, Monster: monsterStack, Money : money});
    mapName = getLevelName();
    var Id = window.sessionStorage.getItem("UserId");
    var Name = window.sessionStorage.getItem("UserName");
    if(Id === "Guest"){
        changeAlert(true,"Please Login First!");
        showAlert();
    }else{
        var cuslist = window.sessionStorage.getItem("cusName");
        if(cuslist.indexOf(mapName+",") === -1){
            shareMyWork(mapName,defaultMap,monsterStack,money,Id,Name);
            cuslist = cuslist+mapName+",";
            window.sessionStorage.setItem("cusName",cuslist);
            window.localStorage.setItem(mapName,content);
            changeAlert(false,"save success");
            showAlert();
        }else{
            var temp = window.localStorage.getItem(mapName);
            var data = JSON.parse(temp);
            var authorId = data.Id;
                //getIdFromCus(mapName);
            var currentId = window.sessionStorage.getItem("UserId");
            if (currentId === authorId){
                shareMyWork(mapName,defaultMap,monsterStack,money,Id,Name);
                window.localStorage.setItem(mapName,content);
                changeAlert(false,"save success");
                showAlert();
            }else{
                changeAlert(true,"Level Name was already taken,Please select another name");
                showAlert();
            }
        }
    }
}

function loadLevel(levelname){
    resetmap();
    mapName = levelname;
    var temp = window.localStorage.getItem(levelname);
    var data = JSON.parse(temp);
    money = data.Money;
    document.getElementById("money-text").innerHTML= money.toString();
    defaultMap = data.Map;
    monsterStack = data.Monster;
    addMonsterUIForLoad(monsterStack);
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
                customizeMap[k].getImage().inputEnabled = true;
                customizeMap[k].getImage().events.onInputDown.add(MapBaseListener, {param1: customizeMap[k] , param2:k});

                //%%% new add
                startx = Math.floor(k/8);
                starty = k%8;
                //%%% new add
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

                //%%% new add
                endx = Math.floor(k/8);
                endy = k%8;
                //%%% new add

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
};


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
        defaultMap =[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        var bg = game.add.sprite(0, 0, 'background');
        bg.scale.setTo(window.innerWidth/1800,window.innerHeight/1199);
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

    }
};






/***********************************add by lead designer*****************************************/
function clickCustomButton(num){
    selectedTower = num;
}

function getLevelName(){
    //window.alert(document.getElementById("levelname").value);
    return document.getElementById("levelname").value;
}

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
        changeAlert(true,"Please save first!");
        showAlert();
    }

});
document.getElementById("control-customize-button2").addEventListener('click',function(){saveAction()});
document.getElementById("control-customize-button4").addEventListener('click',function(){window.location.href="game.html"});

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
function removeAllRow(){
    var table = document.getElementById("selected-monster-table");
    var number = table.getElementsByTagName("tr").length;
    while(number>0){
                table.deleteRow(0);
                number = number-1;
    }
}

function addMonsterUIForLoad(list){
    removeAllRow();
    var i;
    var monstername = ["Fei Lian","Red Boy","Huo Dou","Kirin","Mob","Ci Tie"];
    for(i = 0; i<list.length; i++){
        addMonsterUI(monstername[list[i]]);
    }
}

document.getElementById("feilian-button").addEventListener('click',function(){addMonsterUI("Fei Lian");addMonster(0);});
document.getElementById("citie-button").addEventListener('click',function(){addMonsterUI("Ci Tie");addMonster(5);});
document.getElementById("kirin-button").addEventListener('click',function(){addMonsterUI("Kirin");addMonster(3);});
document.getElementById("redboy-button").addEventListener('click',function(){addMonsterUI("Red Boy");addMonster(1);});
document.getElementById("huodou-button").addEventListener('click',function(){addMonsterUI("Huo Dou");addMonster(2);});
document.getElementById("mob-button").addEventListener('click',function(){addMonsterUI("Mob");addMonster(4);});



var levelCount = 0;
var row = null;
function addCustomLevel(name,author){
    readShareLevel();
    var table = document.getElementById("custom-level-table");
    if(levelCount%6==0){
        row = table.insertRow(-1);
    }
    var col1 = row.insertCell(levelCount%6);
    levelCount = levelCount+1;
    var col3 = row.insertCell(levelCount%6);
    levelCount = levelCount+1;
    var col2 = row.insertCell(levelCount%6);
    levelCount = levelCount+1;
    col1.className = "load-td1";
    col3.className = "load-td1";
    col2.className = "load-td2";
    var span1 = document.createElement("SPAN");
    var span2 = document.createElement("SPAN");
    span1.className = "load-span1";
    span1.innerHTML = name;
    span2.className = "load-span2";
    span2.innerHTML = "Created By "+author;
    col1.appendChild(span1);
    col3.appendChild(span2);
    var button = document.createElement("BUTTON");

    button.addEventListener('click',function(){loadLevel(name);});
    button.innerHTML="Load";
    button.setAttribute("data-dismiss", "modal");
    col2.appendChild(button);
}

var isMyLevelGlobal = false;

function addCustomLevelCaller(isMyLevel){
    readShareLevel();
    // add
    document.getElementById("search-box").value = "";
    var table = document.getElementById("custom-level-table");
    var number = table.getElementsByTagName("tr").length;
    while(number>0){
        table.deleteRow(0);
        number = number-1;
    }
    levelCount = 0;
    row = null;
    isMyLevelGlobal = isMyLevel;

    if(isMyLevel){
        /*chage here for my level*/
        var cus =  window.sessionStorage.getItem("cusName");
        var cusName = cus.substr(0, cus.length - 1);
        var cusNameList = cusName.split(",");
        /*************add author name list*************/
        var currentId = window.sessionStorage.getItem("UserId");
        var i;
        for(i = 0; i<cusNameList.length; i++){
            var temp = window.localStorage.getItem(cusNameList[i]);
            var data = JSON.parse(temp);
            if(currentId === data.Id){
                var authorName = data.Name;
                addCustomLevel(cusNameList[i],authorName);
            }
        }
    }
    else{
        var cus =  window.sessionStorage.getItem("cusName");
        var cusName = cus.substr(0, cus.length - 1);
        var cusNameList = cusName.split(",");
        /*************add author name list*************/
        var i;
        for(i = 0; i<cusNameList.length; i++){
            var temp = window.localStorage.getItem(cusNameList[i]);
            var data = JSON.parse(temp);
            var authorName = data.Name;
            addCustomLevel(cusNameList[i],authorName);
        }
    }
}
document.getElementById("control-customize-button3").addEventListener('click',function(){addCustomLevelCaller(false);});
document.getElementById("control-customize-button10").addEventListener('click',function(){addCustomLevelCaller(true);});


function disableOriginButton(){
    document.getElementById("origin-button").disabled = true;
}
function enableOriginButton(){
    document.getElementById("origin-button").disabled = false;
}
function disableEndButton(){
    document.getElementById("end-button").disabled = true;
}
function enableEndButton(){
    document.getElementById("end-button").disabled = false;
}
function getSideBarWidth(){
    return document.getElementById('game-side-bar').clientWidth+10;
}

var alert1 = document.getElementById("alert-normal");
function hideAlert(){
    alert1.style.display="none";
}
function showAlert(){
    alert1.style.display="inline-block";
    setTimeout("hideAlert()",3000);
}
function changeAlert(isDanger,text){
    if(isDanger){
        alert1.className="alert alert-danger";
    }
    else{
        alert1.className="alert alert-success";
    }
    alert1.innerHTML = text;
}
document.getElementById("control-customize-button2").addEventListener('click',function(){showAlert();});



function searchLevel(isMyLevel){
    var text = document.getElementById("search-box").value.toLowerCase();
    var table = document.getElementById("custom-level-table");
    var number = table.getElementsByTagName("tr").length;
    while(number>0){
        table.deleteRow(0);
        number = number-1;
    }
    levelCount = 0;
    row = null;
    if(isMyLevel){
        /*chage here for my level*/
        var cus =  window.sessionStorage.getItem("cusName");
        var cusName = cus.substr(0, cus.length - 1);
        var cusNameList = cusName.split(",");
        var currentId = window.sessionStorage.getItem("UserId");
        /*************add author name list*************/
        var i;
        for(i = 0; i<cusNameList.length; i++){
            var text2 = cusNameList[i].toLowerCase();
            var temp = window.localStorage.getItem(cusNameList[i]);
            var data = JSON.parse(temp);
            if(text2.indexOf(text)>=0){
                if(currentId === data.Id){
                    var authorName = data.Name;
                    addCustomLevel(cusNameList[i],authorName);
                }
            }
        }
    }
    else{
        var cus =  window.sessionStorage.getItem("cusName");
        var cusName = cus.substr(0, cus.length - 1);
        var cusNameList = cusName.split(",");
        /*************add author name list*************/
        var i;
        for(i = 0; i<cusNameList.length; i++){
            var text2 = cusNameList[i].toLowerCase();
            var temp = window.localStorage.getItem(cusNameList[i]);
            var data = JSON.parse(temp);
            if(text2.indexOf(text)>=0){
                var authorName = data.Name;
                addCustomLevel(cusNameList[i],authorName);
            }
        }
    }
    
}

document.getElementById("search-box").addEventListener('input',function(){searchLevel(isMyLevelGlobal);});


function hideMyCustomLevelsButton(){
    document.getElementById("control-customize-button10").style.display="none";
}
/***********************************add by lead designer***************************************/



/***********************************Database control function ***************************************/
/* udpate cust level into data base*/
function shareMyWork(MapName,map,monster,balance,id,name){
    firebase.database().ref('share/'+MapName).set({UserId: id, UserName: name, Map : map, Monster : monster,Balance:balance});
}

/*return author of map by mapName*/
function getIdFromCus(MapName){
    var query = firebase.database().ref('share/'+ MapName+'/UserId');
    query.on("value",function(snapshot) {
        window.sessionStorage.setItem("authorId",snapshot.val());
    });
    var Id = window.sessionStorage.getItem("authorId");
    return Id;
}

/* read share cust level from firebase*/
function readShareLevel(){
    var cusName = "";
    var query = firebase.database().ref("share");
    query.on("value",function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            // key will be "ada" the first time and "alan" the second time
            var key = childSnapshot.key;
            cusName = cusName+key + ",";
            window.sessionStorage.setItem("cusName",cusName);
            //childData will be the actual contents of the child, and load cus level info to storage
            var Data = childSnapshot;
            var balance = Data.child("Balance").val();
            var map = Data.child("Map").val();
            var monster = Data.child("Monster").val();
            var id = Data.child("UserId").val();
            var name = Data.child("UserName").val();
            var content = JSON.stringify({Id: id, Name: name, Map : map, Monster: monster, Money : balance});
            window.localStorage.setItem(key,content);
        });
    });
}




