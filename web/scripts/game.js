var game;
// colors is actually the array of level pages
var colors = ["0xFF8C00","0xff0000","0x4ca14c","0x3399ff","0xffff00"];
// columns of thumbnails in each page
var columns = 5;
// rows of thumbnails in each page
var rows = 2;
// thumbnail width, in pixels
var thumbWidth = 60;
// thumbnail height, in pixels
var thumbHeight = 60;
// empty space between two thumbnails, in pixels
var spacing = 20;

var defaultMap;

//*************************************data set******************************************
var dataSet = JSON.parse(window.sessionStorage.getItem("MyData"));
var balanceArray = dataSet.BalanceSet;
var monsterArray = dataSet.MonsterSet;
var MapArray = dataSet.MapSet;
//*************************************data set******************************************
// stars array
var stars = [];
// local storage name
var localStorageName;
var player = window.sessionStorage.getItem("auth");
if (player == "1"){
     localStorageName = "player";
}else{
     localStorageName = "stars";
}

// level we are currently playing
var level;
//get the window_size
var window_width = window.innerWidth;
var window_height = window.innerHeight;


//the mapBase Object, which contains the positions, background image, and it can wrap a game object(tower/path)
var mapBase = function(positionX, positionY, gameImage ,bgimage){
     // the position of the mapbase
     this.positionX = positionX;
     this.positionY = positionY;
     //the game object it wraps
     this.gameImage = gameImage;
     //add the background to the mapbase
     this.mapBaseBg = game.add.sprite(positionX,positionY,bgimage);
     //enable the physics
     game.physics.enable(this.mapBaseBg, Phaser.Physics.ARCADE);
     //not movable object
     this.mapBaseBg.body.immovable = true;
     //the value we check if is a tower put on the mapbase
     this.isTowerSet  = false;
}
//getPosition of a mapbase, return a position x and position y
mapBase.prototype.getPosition = function(){
     var position = new Array();
     position[0] = this.positionX;
     position[1] = this.positionY;
     return position;
}
//get the object placed on mapBase
mapBase.prototype.getImage = function(){
     return this.gameImage;
}
//set the object on the mapbase
mapBase.prototype.setImage = function(gameImage){
     this.gameImage = gameImage;
};

function onclick () {
     alert('hhhhh');
}
//the tower object which can be place on the mapbase object
var towerObj = function(index, imageStr, windowSize , health, firerate, game ,bullets,positionX, positionY, target , bulletspeed ,mapBase , isHealing){
     //the postion
     this.positionX = positionX;
     this.positionY = positionY;
     //the current HP of a tower
     this.health = health;
     //the initial HP of a tower
     this.originalHealth = health;
     //the target of a the tower to shoot to
     this.target = target;
     //the game singleton
     this.game = game;
     //the rate of fire
     this.fireRate = firerate;
     //the timer for shoot next bullet
     this.nextFire = 0;
     //is the tower alive
     this.alive = true;
     //the kind of bullet this tower shoots
     this.bullets = bullets;
     //the speed of bullet this tower shoot
     this.bulletspeed = bulletspeed;
     //the mapbase object the tower place on it
     this.mapBase = mapBase;
     //is the tower a healing tower(healing tower doesn't shoot bullets, it healing the towers besides it)
     this.isHealing = isHealing;
     //add the actual tower body to the game on a position
     this.tower = game.add.sprite(positionX,positionY,imageStr);
     //scale the tower
     this.tower.scale.setTo(windowSize / 10 / 100, windowSize / 10 / 100);
     //give the tower an id
     this.tower.name = index.toString();
     //enable the body physic for the tower
     this.game.physics.enable(this.tower, Phaser.Physics.ARCADE);
     //the tower is not movebel
     this.tower.body.immovable = false;
     //check the world bound
     this.tower.body.collideWorldBounds = true;
     //set the bounce
     this.tower.body.bounce.setTo(1, 1);

}
//the tower damage function, being called when a tower intake damage
towerObj.prototype.damage = function(damageAmount) {
     //subtract the damage amount from health
     this.health -= damageAmount;
     //check if the health of a tower position
     if (this.health <= 0)
     {
          //alert("enter destory" + this.isHealing;
          //outlive a tower
          this.alive = false;
          //kill the tower object
          this.tower.kill();
          //reset the mapbase
          this.mapBase.setImage(game.add.image(this.positionX,this.positionY,'blank'));
          this.mapBase.getImage().scale.setTo(size/10/100,size/10/100);
          this.mapBase.isTowerSet=false;
          //this.mapBase.mapBaseBg.scale.setTo(size/10/100,size/10/100);
          this.mapBase.getImage().inputEnabled = true;
          this.mapBase.getImage().events.onInputDown.add(MapBaseListener, {param1: this.mapBase , param2:0});
          return true;
     }

     return false;

}
//this update function being called to shoot bullets to enemy
towerObj.prototype.update = function() {

     //check if the tower is a healing tower
     if(this.isHealing === false){
          /*search the enemy nearby*/
          var nearestTarget = null;
          var nearestDistance = 10000;
          var aliveCounter = 0;
          for(var i=0; i<this.target.length; i++){
               //alert('enter this');
               if(this.target[i].alive===true) {
                    aliveCounter++;
                    var Distance = this.game.physics.arcade.distanceBetween(this.target[i].monster, this.tower);
                    if (Distance < nearestDistance) {
                         nearestDistance = Distance;
                         nearestTarget = this.target[i];
                    }
               }
          }

          //check the fire rate timer, and shoot bullets to nearest monster
          if (this.game.time.now > this.nextFire && nearestTarget!=null) {
               this.nextFire = this.game.time.now + this.fireRate;
               var bullet = this.bullets.getFirstDead();
               bullet.reset(this.positionX + size/20, this.positionY+size/20);
               bullet.rotation = this.game.physics.arcade.moveToXY(bullet,nearestTarget.monster.x,nearestTarget.monster.y,this.bulletspeed+1000);

          }
          //if the tower is a healing tower
     }else if (this.isHealing === true){
          //firerate timer
          if (this.game.time.now > this.nextFire ) {
               this.nextFire = this.game.time.now + this.fireRate;
               var bullet = this.bullets.getFirstExists(false);
               bullet.reset(this.positionX + size/20, this.positionY+size/20);
               //this.game.add.image(this.positionX + size/20,this.positionY + size/20, bullet);

               //bullet.play('healing', 12, false, true);

               //the healing bullets
               var bullet1 = this.bullets.getFirstExists(false);
               bullet1.reset(this.positionX + size/20 - size/10, this.positionY+size/20);

               var bullet2 = this.bullets.getFirstExists(false);
               bullet2.reset(this.positionX + size/20  , this.positionY+size/20 - size/10);


               var bullet3 = this.bullets.getFirstExists(false);
               bullet3.reset(this.positionX + size/20 , this.positionY+size/20 + size/10);

               var bullet4 = this.bullets.getFirstExists(false);
               bullet4.reset(this.positionX + size/20 + size/10, this.positionY+size/20 );

               //bullet1.play('healing', 12, false, true);
               //create the animation and play it
               var animation = healingAnimationGroup.getFirstExists(false);
               animation.reset(this.positionX + size/20, this.positionY+size/20);
               animation.play('healing', 12, false, true);


          }

     }

};
//the monster object
var eliteMonster = function(index, game ,bullets,positionX,positionY,target ,name , fireRate , health , speed ,bulletDirection ){
     //the position
     this.positionX = positionX;
     this.positionY = positionY;
     //the HP of a monster
     this.health = health;
     //the bullets the monster shoots
     this.bullets = bullets;
     //the target the monster moves to
     this.target = target;
     //the game singleton
     this.game = game;
     //fire rate
     this.fireRate = fireRate;
     //fire rate timer
     this.nextFire = 0;
     //is the monster alive
     this.alive = true;
     this.movingTowardX = null;
     this.movingTowardY = null;
     //the speed of the monster
     this.speed = speed;
     //the monster moves to
     this.moveTo = null;
     this.currentOverlap = false;
     //the direction of bullets
     this.bulletDirection =  bulletDirection;
     //the id of the monster
     this.name  = name;
     //add the actual monster body
     this.monster = game.add.sprite(positionX, positionY,name);
     //scale the monster
     this.monster.scale.setTo(size/11/600,size/11/600);
     //set the anchor
     this.monster.anchor.setTo(0.5,0.5);
     //create the walking animation
     var walk = this.monster.animations.add('walk');
     //play the walking animation
     this.monster.animations.play('walk', 8, true);
     //the name of the animation
     this.monster.name = index.toString();
     //enable the body of the monster
     this.game.physics.enable(this.monster, Phaser.Physics.ARCADE);
     //set not movable
     this.monster.body.immovable = false;

     this.pathFinding = findingPath.slice(0);

     this.currentMovetoX = 0;
     this.currentMovetoY = 0;
     this.distanceToTarget = size;

};

//the function being called whe  a monster intakes damage
eliteMonster.prototype.damage = function(damageAmount) {
     //decrease the hp a monster
     this.health -= damageAmount;
     //check if the monster is alive
     if (this.health <= 0)
     {
          this.alive = false;
          //kill the monster object
          this.monster.kill();
          //check the type of the monster and update the money
          if(this.name === 'feiLian'){
               money+=160;
          }else if(this.name === 'eye'){
               money+=80;
          }else if(this.name === 'huoDou'){
               money+=200;
          }else if(this.name === 'qiLin'){
               money+=240;
          }else if(this.name === 'hong'){
               money+=280;
          }

          console.log(money);


          return true;
     }

     return false;

}
//the update function fot a monster
eliteMonster.prototype.update = function() {
     //alert("second clause");
//check the firerate timer and determin if to shoot a bullet
     if (this.game.time.now > this.nextFire ) {
          this.nextFire = this.game.time.now + this.fireRate;
          //check the direction type of the bullet
          if(this.bulletDirection === 1) {
               var bullet = this.bullets.getFirstExists(false);
               bullet.reset(this.monster.x, this.monster.y);
               bullet.rotation = this.game.physics.arcade.moveToXY(bullet, this.monster.x + 1, this.monster.y+1, 200);

               var bullet1 = this.bullets.getFirstExists(false);
               bullet1.reset(this.monster.x, this.monster.y);
               bullet1.rotation = this.game.physics.arcade.moveToXY(bullet1, this.monster.x-1, this.monster.y + 1, 200);

               var bullet2 = this.bullets.getFirstExists(false);
               bullet2.reset(this.monster.x, this.monster.y);
               bullet2.rotation = this.game.physics.arcade.moveToXY(bullet2, this.monster.x - 1, this.monster.y-1, 200);

               var bullet3 = this.bullets.getFirstExists(false);
               bullet3.reset(this.monster.x, this.monster.y);
               bullet3.rotation = this.game.physics.arcade.moveToXY(bullet3, this.monster.x+1, this.monster.y - 1, 200);

          }else if(this.bulletDirection ===0){
               var bullet = this.bullets.getFirstExists(false);
               bullet.reset(this.monster.x, this.monster.y);
               bullet.rotation = this.game.physics.arcade.moveToXY(bullet, this.monster.x + 1, this.monster.y, 200);
          }


     }

     if(this.currentMovetoX === 0 && this.currentMovetoY ===0 ){
          var position_array = this.pathFinding.pop();
          if(position_array!=null) {
               this.currentMovetoX = position_array[0] + size / 20;
               this.currentMovetoY = position_array[1] + size / 20;
          }
          game.physics.arcade.moveToXY(this.monster,this.currentMovetoX,this.currentMovetoY,this.speed);
          console.log( this.currentMovetoX +" "+ this.currentMovetoY );
     }else if(game.physics.arcade.distanceToXY(this.monster,this.currentMovetoX,this.currentMovetoY)>this.distanceToTarget && game.physics.arcade.distanceToXY(this.monster,this.currentMovetoX,this.currentMovetoY)<(size/20)){
          this.distanceToTarget = size;
          this.monster.body.velocity.x = 0;
          this.monster.body.velocity.y = 0;
          var position_array = this.pathFinding.pop();
          if(position_array!=null) {
               this.currentMovetoX = position_array[0]+size/20;
               this.currentMovetoY = position_array[1]+size/20;
          }
          console.log( this.monster.name+""+this.currentMovetoX +" ~~~"+ this.currentMovetoY );
          game.physics.arcade.moveToXY(this.monster,this.currentMovetoX,this.currentMovetoY,this.speed);
     }

     console.log("id"+this.monster.name+"moveto "+this.currentMovetoX +" "+this.currentMovetoY);

     this.distanceToTarget  = game.physics.arcade.distanceToXY(this.monster,this.currentMovetoX,this.currentMovetoY);

};

var player;
var platforms;
var cursors;
//lose icon
var lose;
// the status of tip
var enteredTipsPause = false;
var enteredTowerTipsPause = false;

var mons_start_position_x = 0;
var mons_start_position_y = 0;
var mons_end_position_x = 0;
var mons_end_position_y = 0;
var mons_start_tip;
var mons_end_tip;


var bannerWidth = 0;
//the tips images
var tower_select_tip;
var tower_place_tip;

var stars;
//different type of bullets
var healingBullets;
var enemyBullets;
var Bullets277;
//current selected tower
var selectedTower = 0;
//score
var score = 0;
var scoreText;
var timerText;
var timerKilled = false;
var money = balanceArray[0];
/*new for search*/
var startx;
var starty;
var endx;
var endy;
var movingPathReady = false;
var movingPath = new Array();
var findingPath ;
/*new for search*/

var towerButton1;
var towerButton2;
var towerButton3;
var towerButton4;
var towerButton5;
var backstart;

var timer = 0;
var size  = Math.min(window.innerHeight,window.innerWidth);

//data set
var mapBaseArray = new Array();
var gameIndexArray = new Array();
gameIndexArray= MapArray[0];
var monsterLoadArray = monsterArray[0];


//the number of monster remaining for a level
var monsterRemaining = monsterLoadArray.length;
console.log(monsterRemaining);



//this movingPath array is used for store the path

//the interval between time
var time_til_spawn =  10000;  //Random time between 2 and 5 seconds.
var last_spawn_time = 0 ;
var countDown = 0;




var home;
//the number of tower
var numberOfTowers = 0;
//explostion animation
var explosions;
//healing animation
var healingAnimationGroup;
var gameboradBounds;
//the bound of gameboard
var lowerBound;
var rightBound;
//the towerArray and enemy aray
var enemyArray = new Array();
var towerArray = new Array();
//bullet instances
var windBullets;
var enemyArrayIndex =0;
var winner;

//when bullets hit walls kill the bullets
function bulletHitWall (wall, bullet) {

     bullet.kill();
}
//lose the game when the enemy reaches the destination
function enemyReachDestination(somethong, monster){

     lose = game.add.sprite(window.innerWidth/2,window.innerHeight/2, 'defeat');
     lose.anchor.setTo(0.5,0.5);
     game.paused = true;
     game.input.onDown.add(removeLogo2, this);
     game.state.start("LevelSelect");

     /*
      game.paused = true;
      game.input.onDown.add(removeLogo1, this);
      game.state.start("LevelSelect");          }
      //game.paused = false;
      */

}


//when bullets overlaps the enmeies kill the bullet, make damage to the monster and check if the monster is alive, if dead play the animation
function bullet227HitEnemy (enemy, bullet) {
     bullet.kill();
     var destroyed = enemyArray[enemy.name].damage(2);
     if (destroyed)
     {
          var explosionAnimation = explosions.getFirstExists(false);
          explosionAnimation.reset(enemy.x, enemy.y);
          explosionAnimation.play('kaboom', 30, false, true);
          score += 10;
          scoreText.setText("Score: " + score +" ");
     }
}
//when windbullets hit the enemy drop the velocity
function windBulletsHitEnemy (enemy, bullet) {
     bullet.kill();
     game.physics.arcade.moveToXY(enemyArray[enemy.name].monster,enemyArray[enemy.name].currentMovetoX,enemyArray[enemy.name].currentMovetoY,enemyArray[enemy.name].speed*0.6);

}


//when bullets hit enemy
function bullet74HitEnemy (enemy, bullet) {
     bullet.kill();
     var destroyed = enemyArray[enemy.name].damage(0.5);
     if (destroyed)
     {
          var explosionAnimation = explosions.getFirstExists(false);
          explosionAnimation.reset(enemy.x, enemy.y);
          explosionAnimation.play('kaboom', 30, false, true);
          score += 10;
     }
}
//when bullets hit enemy
function bullet224HitEnemy (enemy, bullet) {
     bullet.kill();
     var destroyed = enemyArray[enemy.name].damage(5);
     if (destroyed)
     {
          var explosionAnimation = explosions.getFirstExists(false);
          explosionAnimation.reset(enemy.x, enemy.y);
          explosionAnimation.play('kaboom', 30, false, true);
          score += 10;

     }
}
//when bullets hit tower
function enemyBulletsHitTower (tower, bullet) {
     bullet.kill();
     var destroyed = towerArray[tower.name].damage(20);
     if (destroyed)
     {

          var explosionAnimation = explosions.getFirstExists(false);
          explosionAnimation.reset(tower.x, tower.y);
          explosionAnimation.play('kaboom', 30, false, true);

     }
}
//when healing the tower
function healingBulletsHitTower (tower, bullet) {
     bullet.kill();
     //console.log(towerArray[tower.name]);
     if (typeof towerArray[tower.name] != 'undefined') {
          towerArray[tower.name].damage(-11);
          if (towerArray[tower.name].originalHealth < towerArray[tower.name].health) {
               towerArray[tower.name].health = towerArray[tower.name].originalHealth;
          }
          //console.log(towerArray[tower.name].name + " "+towerArray[tower.name].health);
     }
}

function actionOnClick () {

     selectedTower = this.param1;

}


function monsterReach(enemy ,grid){
     //alert(enemy.name);
     //alert(grid.name);
     //alert(movingPath.pop())
     enemyArray[grid.name].moveTo = mapBaseArray[20].mapBaseBg;
     //this.currentOverlap = true;

}

//remove the logo
function removeLogo () {

     game.input.onDown.remove(removeLogo, this);
     mons_end_tip.kill();
     mons_start_tip.kill();
     game.paused = false;
     enteredTipsPause = true;
     last_spawn_time = game.time.time;

}
//remove the tips
function removeTowerTips () {

     game.input.onDown.remove(removeTowerTips, this);
     tower_place_tip.kill();
     tower_select_tip.kill();
     game.paused = false;
     enableGameButton();
     last_spawn_time = game.time.time;

}

function removeLogo1 () {
     /*user win the game*/
     /***********************************add by lead designer*****************************************/
     hideSideBar();
     /***********************************add by lead designer*****************************************/
     game.input.onDown.remove(removeLogo1, this);
     winner.kill();
     game.paused = false;
     last_spawn_time = game.time.time;

     //***********************data set*****************************************
     var MaxLevel = parseInt(window.sessionStorage.getItem("UserLevel"));
     var CurrentLevel = (level+2);
     /*check if next level greater than maxlevel, if so, update*/
     if(CurrentLevel > MaxLevel && MaxLevel !== -1){
          window.sessionStorage.setItem("UserLevel",CurrentLevel.toString());
          var Id = window.sessionStorage.getItem("UserId");
          var Name = window.sessionStorage.getItem("UserName");
          // firebase.database().ref('user/'+Id).update({Level : CurrentLevel});
     }
     window.location.replace("level.html");
     //*************************data set ***************************************

}

function removeLogo2 () {
     /*user lost the game*/
     /***********************************add by lead designer*****************************************/
     hideSideBar();
     /***********************************add by lead designer*****************************************/
     game.input.onDown.remove(removeLogo2, this);
     lose.kill();
     game.paused = false;
     last_spawn_time = game.time.time;
     //***********************data set*****************************************
     window.location.replace("level.html");
     //*************************data set ***************************************

}
//the listener for the mapbase, click on the mapbase puts tower on the mapbase
function MapBaseListener(){

     i = this.param1.getPosition()[0];
     j = this.param1.getPosition()[1];

     if(selectedTower === 0) {
          if(money>=100) {
               this.param1.getImage().destroy();
               this.param1.setImage(new towerObj(numberOfTowers, 'eyetower', size, 20, 500, game, Bullets277, this.param1.getPosition()[0], this.param1.getPosition()[1], enemyArray, 500, this.param1, false));
               this.param1.isTowerSet = true;
               towerArray.push(this.param1.getImage());
               numberOfTowers++;
               money-=100;
          }
     }else if(selectedTower === 1){
          if(money>=100) {
               this.param1.getImage().destroy();
               this.param1.setImage(new towerObj(numberOfTowers, 'eyetower', size, 20, 500, game, Bullets277, this.param1.getPosition()[0], this.param1.getPosition()[1], enemyArray, 500, this.param1, false));
               this.param1.isTowerSet = true;
               towerArray.push(this.param1.getImage());
               numberOfTowers++;
               money-=100;
          }
     }else if(selectedTower === 2){
          if(money>=150) {
               this.param1.getImage().destroy();
               this.param1.setImage(new towerObj(numberOfTowers, 'xueyoutower', size, 40, 1000, game, Bullets224, this.param1.getPosition()[0], this.param1.getPosition()[1], enemyArray, 300, this.param1, false));
               this.param1.isTowerSet = true;
               towerArray.push(this.param1.getImage());
               numberOfTowers++;
               money-=150;
          }
     }else if(selectedTower === 3) {
          if(money>=80) {
               this.param1.getImage().destroy();
               this.param1.setImage(new towerObj(numberOfTowers, 'javatower', size, 100, 400, game, Bullets74, this.param1.getPosition()[0], this.param1.getPosition()[1], enemyArray, 800, this.param1, false));
               this.param1.isTowerSet = true;
               towerArray.push(this.param1.getImage());
               numberOfTowers++;
               money-=80;
          }
     }else if(selectedTower === 4){
          if(money>=200) {
               this.param1.getImage().destroy();
               this.param1.setImage(new towerObj(numberOfTowers, 'fantower', size, 20, 400, game, windBullets, this.param1.getPosition()[0], this.param1.getPosition()[1], enemyArray, 800, this.param1, false));
               this.param1.isTowerSet = true;
               towerArray.push(this.param1.getImage());
               numberOfTowers++;
               money-=200;
          }
     }else if(selectedTower === 5){
          if(money>=120) {
               this.param1.getImage().destroy();
               this.param1.setImage(new towerObj(numberOfTowers, 'geartower', size, 30, 3000, game, healingBullets, this.param1.getPosition()[0], this.param1.getPosition()[1], enemyArray, 4000, this.param1, true));
               this.param1.isTowerSet = true;
               towerArray.push(this.param1.getImage());
               numberOfTowers++;
               money-=120;
          }
     }

     //******   add by Jun *****////
     // this below is for customize

     // 6 is start grid
     else if (selectedTower === 6){

          this.param1 = new mapBase(this.param1.getPosition()[0], this.param1.getPosition()[1],game.add.image(this.param1.getPosition()[0], this.param1.getPosition()[1],'start'),'start');
          this.param1.getImage().scale.setTo(size/10/100,size/10/100);
          this.param1.mapBaseBg.scale.setTo(size/10/100,size/10/100);
          defaultMap[this.param2] = 5;

     }
     // 7 is path
     else if (selectedTower === 7){
          this.param1 = new mapBase(this.param1.getPosition()[0], this.param1.getPosition()[1],game.add.image(this.param1.getPosition()[0], this.param1.getPosition()[1],'path'),'path');
          this.param1.getImage().scale.setTo(size/10/100,size/10/100);
          this.param1.mapBaseBg.scale.setTo(size/10/100,size/10/100);
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

          game.physics.enable(home, Phaser.Physics.ARCADE);
          home.body.immovable = false;
          defaultMap[this.param2] = 4;
     }

     //******   add by Jun *****////
     console.log(money);
}


window.onload = function() {
     // creating a 320x480 pixels game and executing PlayGame state
     game = new Phaser.Game(window_width, window_height, Phaser.AUTO, "");
     game.state.add("LevelSelect", playGame);
     game.state.add("PlayLevel", playLevel);
     game.state.add("gameScreen", gameScreen);
     game.state.start("LevelSelect");
}

var gameScreen =  function (game){};
gameScreen.prototype ={
     preload: function(){
          game.load.image('background', 'assets/background.png');
          game.load.image('ground', 'assets/platform.png');
          game.load.image('star', 'assets/star.png');
          game.load.image('grid', 'assets/blank.png');
          game.load.image('blank', 'assets/blank.png');
          game.load.image('path', 'assets/path/pathnew2.png');
          game.load.image('start', 'assets/path/start_stage.png');

          game.load.image('xueyoutower', 'assets/towers/xueyou_tower.png');
          game.load.image('eyetower', 'assets/towers/eye_tower.png');
          game.load.image('javatower', 'assets/towers/java_tower.png');
          game.load.image('fantower', 'assets/towers/fan_tower.png');
          game.load.image('geartower', 'assets/towers/gear_tower.png');

          game.load.image('bullet228', 'assets/bullets/bullet228.png');
          game.load.image('bullet74', 'assets/bullets/bullet74.png');
          game.load.image('bullet277', 'assets/bullets/bullet277.png');
          game.load.image('bullet224', 'assets/bullets/bullet224.png');
          game.load.image('windbullet', 'assets/bullets/windbullet.png');


          game.load.spritesheet('eyetowerButton', 'assets/buttons/eye_tower.png', 200, 100);
          game.load.spritesheet('xueyoutowerButton', 'assets/buttons/xueyou_tower.png', 200, 100);
          game.load.spritesheet('javatowerButton', 'assets/buttons/java_tower.png', 200, 100);
          game.load.spritesheet('windtowerButton', 'assets/buttons/wind_tower.png', 200, 100);
          game.load.spritesheet('geartowerButton', 'assets/buttons/gear_tower.png', 200, 100);

          game.load.spritesheet('home', 'assets/path/home.png', 400, 400);

          game.load.spritesheet('kaboom', 'assets/explosion.png', 64, 64, 23);
          game.load.spritesheet('healing', 'assets/bullets/healing_ani.png', 900, 900, 6);
          game.load.image('logo', 'assets/menu_button.png');
          /*edit by liwen fan*/
          game.load.image('mons_end','assets/mons_end2.png');
          game.load.image('mons_start','assets/mons_start.png');
          game.load.image('place_tower','assets/place_tower.png');
          game.load.image('select_tower','assets/select_tower.png');
          /*edit by liwen fan*/
          game.load.image('high_way','assets/basic_map.png');
          game.load.spritesheet('feiLian', 'assets/monsters/feiLian.png',600,600,7);
          game.load.spritesheet('huoDou', 'assets/monsters/dou_ani.png',599,599,7);
          game.load.spritesheet('hong', 'assets/monsters/hong_ani.png',599,599,7);
          game.load.spritesheet('qiLin', 'assets/monsters/qilin_ani.png',599,599,7);
          game.load.spritesheet('tie', 'assets/monsters/tie_ani.png',599,599,7);
          game.load.spritesheet('eye', 'assets/monsters/mob_mov_2.png', 300, 300, 5);
          game.load.spritesheet('bull','assets/bullets/BULL.png',70,70,4);
          game.load.image('victory','assets/victory.png');
          game.load.image('defeat','assets/Defeat.png');


     },



//var rightBound;

     create: function() {
          monsterLoadArray.reverse();


          //  We're going to be using physics, so enable the Arcade Physics system
          game.physics.startSystem(Phaser.Physics.ARCADE);




          //  A simple background for our game
          var bg = game.add.sprite(0, 0, 'background');
          bg.scale.setTo(window.innerWidth/1800,window.innerHeight/1199)
          var boardBg = game.add.sprite(size/20*2,size/20*2,'high_way');
          boardBg.scale.setTo(size/20*16/1000,size/20*16/1000);



          var k = 0;
          var i = 0;
          var j = 0;



          //set the gameboard according to the maparry
          for(i=size/20*2;i<size/20*17;i=i+(size/10)){
               for(j=size/20*2;j<size/20*17;j=j+(size/10)) {
                    if(gameIndexArray[k] ===0) {

                         mapBaseArray[k] = new mapBase(j,i,game.add.image(j,i,'grid'),'grid');
                         mapBaseArray[k].getImage().scale.setTo(size/10/100,size/10/100);
                         mapBaseArray[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);
                         mapBaseArray[k].getImage().inputEnabled = true;
                         mapBaseArray[k].getImage().events.onInputDown.add(MapBaseListener, {param1: mapBaseArray[k] , param2:k});
                         //mapBaseArray[k]..events.onInputDown.add(MapBaseListener, {param1: mapBaseArray[k]});
                    }else if(gameIndexArray[k]===1){

                         mapBaseArray[k] = new mapBase(j,i,game.add.image(j,i,'path'),'path');
                         mapBaseArray[k].getImage().scale.setTo(size/10/100,size/10/100);
                         mapBaseArray[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);


                    }else if(gameIndexArray[k]===5){

                         mons_start_position_x = j;
                         mons_start_position_y = i;
                         mapBaseArray[k] = new mapBase(j,i,game.add.image(j,i,'start'),'start');
                         mapBaseArray[k].getImage().scale.setTo(size/10/100,size/10/100);
                         mapBaseArray[k].mapBaseBg.scale.setTo(size/10/100,size/10/100);
                         startx = Math.floor(k/8);
                         starty = k%8;
                         console.log(startx,starty);


                    }else if(gameIndexArray[k]===4){
                         //alert("ture7");

                         mons_end_position_x = j;
                         mons_end_position_y = i;

                         mapBaseArray[k] = new mapBase(j,i,game.add.sprite(j,i,'home'),'grid');
                         mapBaseArray[k].getImage().frame = 1;
                         mapBaseArray[k].getImage().scale.setTo(size/10/400,size/10/400);
                         mapBaseArray[k].mapBaseBg.scale.setTo(size/10/400,size/10/400);
                         mapBaseArray[k].getImage().animations.add('homeAnimation',[0,1,2,3,4,5,6,7,8,9],10,true);
                         mapBaseArray[k].getImage().animations.play('homeAnimation');
                         home = mapBaseArray[k].getImage();

                         game.physics.enable(home, Phaser.Physics.ARCADE);
                         home.body.immovable = false;
                         endx = Math.floor(k/8);
                         endy = k%8;
                         console.log(endx,endy);
                    }
                    k++;
               }
          }



          var formatedArray = formatTo2DArray(gameIndexArray);
          console.log("q23sdfsdf"+formatedArray);

          var easystar = new EasyStar.js();


          console.log(formatedArray);

          easystar.setGrid(formatedArray);
          easystar.setAcceptableTiles([1,4,5]);
          //easystar.enableDiagonals();


          //easystar.enableCornerCutting();

          var pathFind = new Array();
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
                         var position = mapBaseArray[index].getPosition();
                         movingPath.push([position[1],position[0]]);

                    }
                    movingPath.reverse();
                    movingPathReady=true;
                    //alert("movingpath ready");

               }
          });

          easystar.calculate();
          findingPath= movingPath.reverse();




//set the bounds for the game board
          gameboradBounds = game.add.group();
          gameboradBounds.enableBody = true;


          rightBound = gameboradBounds.create(size/20*18, size/20*2, 'ground');
          rightBound.scale.setTo(32/400, size/20*16/32);

          rightBound.body.immovable = true;


          var leftBound = gameboradBounds.create(size/20*2-32, size/20*2, 'ground');
          leftBound.scale.setTo(32/400, size/20*16/32);

          leftBound.body.immovable = true;

          var upperBound = gameboradBounds.create(size/20*2-32,size/20*2-32, 'ground');
          upperBound.scale.setTo((size/20*16+64)/400, 1);
          upperBound.body.immovable = true;


          lowerBound = gameboradBounds.create(size/20*2-32,size/20*18, 'ground');
          lowerBound.scale.setTo((size/20*16+64)/400, 1);
          lowerBound.body.immovable = true;


          /*
           towerButton1 = game.add.button(size/20*19, size/3, 'eyetowerButton', actionOnClick, {param1:1}, 0, 0, 0);

           towerButton2 = game.add.button(size/20*19 , size/3+150, 'xueyoutowerButton', actionOnClick, {param1:2}, 0, 0, 0);

           towerButton3 = game.add.button(size/20*19, size/3+300, 'javatowerButton', actionOnClick, {param1:3}, 0, 0, 0);

           towerButton4 = game.add.button(window.innerWidth - 250,size/2+150, 'windtowerButton', actionOnClick, {param1:4}, 0, 0, 0);

           towerButton5 = game.add.button(size/20*19, size/2+300, 'geartowerButton', actionOnClick, {param1:5}, 0, 0, 0);

           towerButton1.scale.setTo(1,1);
           towerButton2.scale.setTo(1,1);
           towerButton3.scale.setTo(1,1);
           towerButton4.scale.setTo(1,1);
           towerButton5.scale.setTo(1,1);
           */
          //create a game timer
          timer = game.time.create(false);
          //start the game timer
          timer.start();

          //scoreText = game.add.text(size/20*19, size/20*5, 'score: 0', { fontSize: '50px', fill: '#000' });

          timerText = game.add.text(size/20*19, size/20*5, 'timer: 0', { fontSize: '50px', fill: '#000' });



//create the healingBullets instance
          healingBullets = game.add.group();
          healingBullets.enableBody = true;
          healingBullets.physicsBodyType = Phaser.Physics.ARCADE;
          healingBullets.createMultiple(1000, 'blank');
          healingBullets.setAll('scale.x',size/60000);
          healingBullets.setAll('scale.y',size/60000);
          healingBullets.setAll('anchor.x', 0.5);
          healingBullets.setAll('anchor.y', 0.5);

//create the windBullets instance
          windBullets = game.add.group();
          windBullets.enableBody = true;
          windBullets.physicsBodyType = Phaser.Physics.ARCADE;
          windBullets.createMultiple(1000, 'windbullet');
          windBullets.setAll('scale.x',size/160/10);
          windBullets.setAll('scale.y',size/160/10);
          windBullets.setAll('anchor.x', 0.5);
          windBullets.setAll('anchor.y', 0.5);
          //windBullets.setAll('angle', 180);




//create enemy bullets instance
          enemyBullets = game.add.group();
          enemyBullets.enableBody = true;
          enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
          enemyBullets.createMultiple(1000, 'bull');
          enemyBullets.setAll('scale.x',1/3);
          enemyBullets.setAll('scale.y',1/3);
          enemyBullets.setAll('anchor.x', 0.5);
          enemyBullets.setAll('anchor.y', 0.5);
          enemyBullets.callAll('animations.add', 'animations', 'fire', [0,1,2,3], 5, true);enemyBullets.callAll('play', null, 'fire');

//create enemy bullets instance
          Bullets277 = game.add.group();
          Bullets277.enableBody = true;
          Bullets277.physicsBodyType = Phaser.Physics.ARCADE;
          Bullets277.createMultiple(1000, 'bullet277');
          Bullets277.setAll('scale.x',2);
          Bullets277.setAll('scale.y',2);
          Bullets277.setAll('anchor.x', 0.5);
          Bullets277.setAll('anchor.y', 0.5);

//create enemy bullets instance
          Bullets74 = game.add.group();
          Bullets74.enableBody = true;
          Bullets74.physicsBodyType = Phaser.Physics.ARCADE;
          Bullets74.createMultiple(1000, 'bullet74');
          Bullets74.setAll('scale.x',2);
          Bullets74.setAll('scale.y',2);
          Bullets74.setAll('anchor.x', 0.5);
          Bullets74.setAll('anchor.y', 0.5);

//create enemy bullets instance
          Bullets224 = game.add.group();
          Bullets224.enableBody = true;
          Bullets224.physicsBodyType = Phaser.Physics.ARCADE;
          Bullets224.createMultiple(1000, 'bullet224');
          Bullets224.setAll('scale.x',2);
          Bullets224.setAll('scale.y',2);
          Bullets224.setAll('anchor.x', 0.5);
          Bullets224.setAll('anchor.y', 0.5);



//create explosion animation
          explosions = game.add.group();

          for (var i = 0; i < 1000; i++)
          {
               var explosionAnimation = explosions.create(0, 0, 'kaboom', [0], false);
               explosionAnimation.anchor.setTo(0.5, 0.5);
               explosionAnimation.animations.add('kaboom');
          }

//create healing animations
          healingAnimationGroup = game.add.group();
          healingAnimationGroup.enableBody = true;
          healingAnimationGroup.physicsBodyType = Phaser.Physics.ARCADE;

          for (var i = 0; i < 1000; i++)
          {
               var healingAnimation = healingAnimationGroup.create(0, 0, 'healing', [0], false);
               healingAnimation.anchor.setTo(0.5, 0.5);
               healingAnimation.scale.setTo(size/10/300,size/10/300);
               healingAnimation.animations.add('healing');
          }



          /*Edit by Liwen Fan*/
          //var mons_start = game.add.sprite(window.innerHeight/2,window.innerHeight/2,'mons_start');
          // mons_start.anchor.setTo(0.5,0.5);
          // mons_start.scale.setTo(0.5,0.5);



          /*Edit by Liwen Fan*/


     },
//the update function called by phaser
     update: function() {
          /*Edit by Liwen Fan*/
          if(enteredTipsPause === false) {
               disableGameButton();
               mons_start_tip = game.add.sprite(mons_start_position_x+size/10, mons_start_position_y+size/20, 'mons_start');
               mons_start_tip.anchor.setTo(0, 0.5);
               mons_start_tip.scale.setTo(size*6/10/600, size*2/10/200);



               mons_end_tip = game.add.sprite(mons_end_position_x+size/10, mons_end_position_y+size/20, 'mons_end');
               mons_end_tip.anchor.setTo(0, 0.5);
               mons_end_tip.scale.setTo(size*6/10/600, size*2/10/200);


               game.input.onDown.add(removeLogo, this);
               game.paused = true;
               //enteredTipsPause = true;
          }

          if(enteredTowerTipsPause === false && enteredTipsPause === true){
               tower_select_tip = game.add.sprite(window.innerWidth-getSideBarWidth(),window.innerHeight/2,'select_tower');
               tower_select_tip.anchor.setTo(1, 0.5);
               tower_select_tip.scale.setTo(size*6/10/600, size*2/10/200);

               tower_place_tip = game.add.sprite(size/2,size/4,'place_tower');
               tower_place_tip.anchor.setTo(0, 0.5);
               tower_place_tip.scale.setTo(size*6/10/600, size*2/10/200);

               game.input.onDown.add(removeTowerTips, this);
               game.paused = true;
               enteredTowerTipsPause = true;



          }

          /*Edit by Liwen Fan*/

          var initialPositionX = 0;
          var initialPositionY = 0;


          var current_time = game.time.time;


          var countdownnumber = -(current_time - last_spawn_time - time_til_spawn);
          timer = Math.floor(countdownnumber/1000);
          if(timer<=0 ) {
               timerText.destroy();
               if(timerKilled === false) {
                    scoreText = game.add.text(size / 20 * 19, size / 20 * 5, '', {fontSize: '50px', fill: '#000'});

                    timerKilled = true;
               }

          }else{

               timerText.text = 'enemies coming in : ' + timer;
          }
          if(movingPathReady===true) {

               if (current_time - last_spawn_time > time_til_spawn) {

                    time_til_spawn = 4000;
                    last_spawn_time = current_time;
                    //spawnCustomer();
                    if (monsterLoadArray.length != 0) {

                         var popedValue = monsterLoadArray.pop();
                         initialPositionX = size / 20 * 2;
                         initialPositionY = size / 20 * 2;


                         if (popedValue === 0) {
                              enemyArray[enemyArrayIndex] = new eliteMonster(enemyArrayIndex, game, enemyBullets, mons_start_position_x + size / 20, mons_start_position_y + size / 20, home, 'feiLian', 5000, 50, 35, 1);
                              //initialPositionX += 20;
                              //initialPositionY += 20;
                         } else if (popedValue === 1) {
                              enemyArray[enemyArrayIndex] = new eliteMonster(enemyArrayIndex, game, enemyBullets, mons_start_position_x + size / 20, mons_start_position_y + size / 20, home, 'hong', 5000, 30, 50, 1);
                              //initialPositionX += 20;
                              //initialPositionY += 20;
                         } else if (popedValue === 2) {
                              enemyArray[enemyArrayIndex] = new eliteMonster(enemyArrayIndex, game, enemyBullets, mons_start_position_x + size / 20, mons_start_position_y + size / 20, home, 'huoDou', 5000, 100, 20, 1);
                              //initialPositionX += 20;
                              //initialPositionY += 20;
                         } else if (popedValue === 3) {
                              enemyArray[enemyArrayIndex] = new eliteMonster(enemyArrayIndex, game, enemyBullets, mons_start_position_x + size / 20, mons_start_position_y + size / 20, home, 'qiLin', 5000, 30, 50, 1);
                              //initialPositionX += 20;
                              //initialPositionY += 20;
                         } else if (popedValue === 4) {
                              //alert("reached"+enemyArrayIndex);
                              enemyArray[enemyArrayIndex] = new eliteMonster(enemyArrayIndex, game, enemyBullets, mons_start_position_x + size / 20, mons_start_position_y + size / 20, home, 'eye', 5000, 10, 40, 0);
                              //alert("reached1"+enemyArrayIndex);
                              //initialPositionX += 20;
                              //initialPositionY += 20;
                         }else if (popedValue === 5){
                              enemyArray[enemyArrayIndex] = new eliteMonster(enemyArrayIndex, game, enemyBullets, mons_start_position_x + size / 20, mons_start_position_y + size / 20, home, 'tie', 5000, 50, 20, 1);
                         }
                         enemyArrayIndex++;

                    }
               }
          }



          //make diffenet types of bullets overlap event
          game.physics.arcade.overlap(gameboradBounds, enemyBullets, bulletHitWall, null ,this);
          game.physics.arcade.overlap(gameboradBounds, Bullets277, bulletHitWall, null ,this);

          //let each enemy has overlap property with bullets
          for(var i=0; i<enemyArray.length ; i++) {
               game.physics.arcade.overlap(Bullets277, enemyArray[i].monster, bullet227HitEnemy, null, this);
               game.physics.arcade.overlap(Bullets74, enemyArray[i].monster, bullet74HitEnemy, null, this);
               game.physics.arcade.overlap(Bullets224, enemyArray[i].monster, bullet224HitEnemy, null, this);
               game.physics.arcade.overlap(windBullets, enemyArray[i].monster, windBulletsHitEnemy, null, this);
               game.physics.arcade.collide(enemyArray[i].monster, lowerBound);
               game.physics.arcade.overlap(enemyArray[i].monster, home,enemyReachDestination,null,this);
          }

          for(var i=0; i<mapBaseArray.length ; i++) {
               if(mapBaseArray[i].isTowerSet === true){
                    game.physics.arcade.overlap(enemyBullets,mapBaseArray[i].getImage().tower,enemyBulletsHitTower,null,this);
                    game.physics.arcade.overlap(healingBullets,mapBaseArray[i].getImage().tower,healingBulletsHitTower,null,this);
               }
               //game.physics.arcade.overlap(enemyBullets, m)

          }


          for(var i=0 ; i<enemyArray.length ; i++){
               for(var j=0 ; j<64; j++){
                    if(gameIndexArray[j]===0){
                         game.physics.arcade.collide(enemyArray[i].monster, mapBaseArray[j].mapBaseBg);
                    }
               }

               /*
                if(enemyArray[i].moveTo != null ) {
                alert("enter the moveTo != null");

                game.physics.arcade.overlap( enemyArray[i].moveTo,enemyArray[i].monster,  monsterReach , null, this);

                }
                */

          }


          //update all towerObject on the tower base
          for(var i = 0; i < mapBaseArray.length;i++){
               if(mapBaseArray[i].getImage().alive === true) {
                    mapBaseArray[i].getImage().update();
               }
          }

          //update all alive enemies

          var aliveenemy = 0;
          for(var i = 0;i<enemyArray.length;i++) {
               if (enemyArray[i].alive === true) {
                    if(enemyArray[i].moveTo === null) {
                         enemyArray[i].moveTo = mapBaseArray[3].mapBaseBg;

                    }
                    enemyArray[i].update();
                    aliveenemy++;

               }
          }



          if(monsterLoadArray.length===0){
               if(aliveenemy===0){
                    winner = game.add.sprite(window.innerWidth/2,window.innerHeight/2, 'victory')
                    winner.anchor.setTo(0.5,0.5);
                    game.paused = true;
                    game.input.onDown.add(removeLogo1, this);
                    stars[level] = Math.max(stars[level], 1);
                    if(stars[level + 1] != undefined && stars[level + 1] == -1){
                         stars[level + 1] = 0;
                    }
                    var player = window.sessionStorage.getItem("UserLevel");
                    if(player == "-1"){
                         localStorage.setItem(localStorageName, stars.toString());
                    }
                    game.state.start("LevelSelect");
               }
          }

          monsterRemaining = monsterLoadArray.length+aliveenemy;
          updateRemainingMonstersText(monsterRemaining);

          updateMoneyText(money);

          console.log(monsterRemaining);

     }


}

var playGame = function(game){};
playGame.prototype = {
     preload: function(){
          /*data set show the level side bar*/
          showTopBar();
          showLevelSideBar();
          // level thumbnail
          game.load.spritesheet("levelthumb", "img/level_lock.png", 60, 60);
          // level pages at the bottom
          game.load.image("levelpages", "img/levelpages.png");
          // transparent background used to scroll
          game.load.image("transp", "img/transp.png");
          game.load.image("background" ,"img/background.png" );
          game.load.image('menu', 'img/popup_menu_new.png', 600, 700);


          //*****************************data set*******************************************
          var levellocal = window.sessionStorage.getItem("UserLevel");
          // if not guest player
          if(levellocal != -1) {
               function getLevelString() {
                    var levellocal = window.sessionStorage.getItem("UserLevel");
                    var stars = "";
                    for (var i = 1; i < levellocal; i++) {
                         stars = stars + "1,";
                    }
                    stars = stars + "0,";
                    for (var i = levellocal; i < 50; i++) {
                         stars = stars + "-1,";
                    }
                    var starLevel = stars.substr(0, stars.length - 1);
                    return starLevel;
               }
               var star = getLevelString();
               localStorage.setItem(localStorageName, star);
          }
          //*****************************data set*******************************************



     },
     create: function(){
          // can the player change page? Useful to prevent double swipes
          this.canChangePage = true;

          // the first level has zero stars, to it's playable although not finished
          stars[0] = 0
          // the remaining levels have -1 stars, this means they are still locked
          for(var l = 1; l < columns * rows * colors.length; l++){
               stars[l] = -1;
          }

          // retrieving stars string from local storage or converting stars array to a string
          this.savedData = localStorage.getItem(localStorageName)==null?stars.toString():localStorage.getItem(localStorageName);
          // finally, no matter how we retrieved the string, splitting the string to form an array again
          stars = this.savedData.split(",");

          // setting game background color
          game.stage.backgroundColor = "#222222";

          game.add.tileSprite(0, 0, window_width, window_height, 'background');


          // just a text placed on the top of the stage to show level page
          //this.pageText = game.add.text(game.width / 2, 16, "Swipe to select level page (1 / " + colors.length + ")", {font: "18px Arial", fill: "#000000"})
          //this.pageText.anchor.set(0.5);
          // the tiled transparent sprite, covering the entire scrollable area which width is (number of pages) * (game width)
          this.scrollingMap = game.add.tileSprite(0, 0, colors.length * game.width, game.height, "transp");
          // this is how we tell Phaser the sprite can receive inputs
          this.scrollingMap.inputEnabled = true;
          // the sprite can be dragged
          this.scrollingMap.input.enableDrag(false);
          // the sprite can't be dragged vertically
          this.scrollingMap.input.allowVerticalDrag = false;
          // this is the bounding box which defines dragging limits
          this.scrollingMap.input.boundsRect = new Phaser.Rectangle(game.width - this.scrollingMap.width, game.height - this.scrollingMap.height, this.scrollingMap.width * 2 - game.width, this.scrollingMap.height * 2 - game.height);
          // we start at page zero, that is the first page
          this.currentPage = 0;
          // this will be the array of page thumbnails
          this.pageSelectors = [];
          // determining row length according to thumbnail width, spacing and number of columns
          var rowLength = thumbWidth * columns + spacing * (columns - 1);
          // left margin is set to every row is centered in the stage
          var leftMargin = (game.width - rowLength) / 2;
          // same concept applies to column height and top margin
          var colHeight = thumbHeight * rows + spacing * (rows - 1);
          var topMargin = (game.height - colHeight) / 2;
          // looping through all pages
          for(var k = 0; k < colors.length; k++){
               // looping through all columns
               for(var i = 0; i < columns; i++){
                    // looping through all rows
                    for(var j = 0; j < rows; j++){
                         // adding level thumbnail
                         var thumb = game.add.image(k * game.width + leftMargin + i * (thumbWidth + spacing), topMargin + j * (thumbHeight + spacing), "levelthumb");
                         // setting tint color according to page cumber
                         //thumb.tint = colors[k];
                         // each level has a number...
                         thumb.levelNumber = k * (rows * columns) + j * columns + i;
                         // assigning each thumbnail a frame according to its stars value
                         thumb.frame = parseInt(stars[thumb.levelNumber]) + 1;
                         // which we are going to write inside the thumbnail
                         var levelText = game.add.text(0, 0, thumb.levelNumber+1, {font: "bold 24px Arial", fill: "0x4ca14c"})
                         // level number is added as a child of level thumbnail
                         thumb.addChild(levelText);
                         // level thumbnail is added as a child of scrolling map
                         this.scrollingMap.addChild(thumb);
                    }
               }
               // now it's time to place page thumbnail selectors, in a way they are centered on the stage
               this.pageSelectors[k] = game.add.button(game.width / 2 + (k - Math.floor(colors.length / 2) + 0.5 * (1 - colors.length % 2)) * 100, game.height - 40, "levelpages", function(e){
                    // each page thumbnail once clicked will scroll the map by "difference" pages
                    var difference = e.pageIndex - this.currentPage;
                    // changePage will handle scrolling
                    this.changePage(difference);
               }, this);
               // each page selector is anchored on its center point
               this.pageSelectors[k] .anchor.set(0.5);
               // each page selector has a page index according to the page it refers to
               this.pageSelectors[k].pageIndex = k;
               // adding a tint color so we can see we will move to "red" levels if we click or "red" page, to "green" levels if we click on "green" page and so on
               this.pageSelectors[k].tint = colors[k];
               // this is just to highlight current page, making it bigger (actually we are making other pages smaller)
               if(k == this.currentPage){
                    this.pageSelectors[k].height = 30;
               }
               else{
                    this.pageSelectors[k].height = 15;
               }
          }
          // when we start dragging, we just save horizontal map position and pointer position
          this.scrollingMap.events.onDragStart.add(function(sprite, pointer){
               this.scrollingMap.startPointerPosition = new Phaser.Point(pointer.x, pointer.y);
               this.scrollingMap.startPosition = this.scrollingMap.x;
          }, this);
          // the core of the script is when we STOP dragging
          this.scrollingMap.events.onDragStop.add(function(sprite, pointer){
               // if there wasn't any scroll, and the pointer remains on the same coordinate, we can say it wasn't a drag so the player clicked a level
               if(this.scrollingMap.startPosition == this.scrollingMap.x && this.scrollingMap.startPointerPosition.x == pointer.x && this.scrollingMap.startPointerPosition.y == pointer.y){
                    // now we just have to check for all bounding boxes to see which level thumbnail has been clicked
                    // sadly, we can't use buttons or they won't allow to detect scrolling
                    for(i = 0; i < this.scrollingMap.children.length; i++){
                         var bounds = this.scrollingMap.children[i].getBounds();
                         // before we start a level, let's check the level is not locked that means it's not on frame zero
                         if(bounds.contains(pointer.x, pointer.y)){
                              if(this.scrollingMap.children[i].frame > 0){
                                   level = this.scrollingMap.children[i].levelNumber;
                                   /***********************************add by lead designer*****************************************/
                                   resetControlGameButton1();
                                   showSideBar();
                                   /***********************************add by lead designer*****************************************/


                                   /***********data set*************/

                                   document.getElementById("currentLevel").setAttribute("value",level.toString());
                                   // gameIndexArray = MapArray[level].split(",");
                                   money = balanceArray[level];
                                   monsterLoadArray = monsterArray[level];
                                   gameIndexArray = MapArray[level];
                                   hideLevelSideBar();
                                   hideTopBar();
                                   /***********data set*************/
                                   game.state.start("gameScreen");
                              }
                              // if the level is locked, then shake the button
                              else{
                                   var buttonTween = game.add.tween(this.scrollingMap.children[i])
                                   buttonTween.to({
                                        x: this.scrollingMap.children[i].x + thumbWidth / 15
                                   }, 20, Phaser.Easing.Cubic.None);
                                   buttonTween.to({
                                        x: this.scrollingMap.children[i].x - thumbWidth / 15
                                   }, 20, Phaser.Easing.Cubic.None);
                                   buttonTween.to({
                                        x: this.scrollingMap.children[i].x + thumbWidth / 15
                                   }, 20, Phaser.Easing.Cubic.None);
                                   buttonTween.to({
                                        x: this.scrollingMap.children[i].x - thumbWidth / 15
                                   }, 20, Phaser.Easing.Cubic.None);
                                   buttonTween.to({
                                        x: this.scrollingMap.children[i].x
                                   }, 20, Phaser.Easing.Cubic.None);
                                   buttonTween.start();
                              }
                              break;
                         }
                    }
               }
               else{
                    // we define 1/8 of the width of the page as the minimum amount of pixels scrolled to say the player
                    // wanted to swipe the page
                    if(this.scrollingMap.startPosition - this.scrollingMap.x > game.width / 8){
                         this.changePage(1);
                    }
                    else{
                         if(this.scrollingMap.startPosition - this.scrollingMap.x < - game.width / 8){
                              this.changePage(-1);
                         }
                         else{
                              this.changePage(0);
                         }
                    }
               }
          }, this);
     },
     changePage: function(page){
          // can the player change a page?
          if(this.canChangePage){
               // while a page is changing, you can't change it again
               this.canChangePage = false;
               // here we move the scrolling map according to selected page
               this.currentPage += page;
               for(var k = 0; k < colors.length; k++){
                    if(k == this.currentPage){
                         this.pageSelectors[k].height = 30;
                    }
                    else{
                         this.pageSelectors[k].height = 15;
                    }
               }
               // this.pageText.text = "Swipe to select level page (" + (this.currentPage + 1).toString() + " / " + colors.length + ")";

               var tween = game.add.tween(this.scrollingMap).to({
                    x: this.currentPage * -game.width
               }, 300, Phaser.Easing.Cubic.Out, true);
               // when the tween is completed, player can change page again
               tween.onComplete.add(function(){
                    this.canChangePage = true;
               }, this);
          }
     }
}

var playLevel = function(game){};

playLevel.prototype = {
     create: function(){
          var w = game.width, h = game.height;
          pause_label = game.add.text(w - 100, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
          pause_label.inputEnabled = true;
          pause_label.events.onInputUp.add(function () {
               // When the paus button is pressed, we pause the game
               game.paused = true;

               // Then add the menu
               menu = game.add.sprite(w/2, h/2, 'menu');
               menu.anchor.setTo(0.5, 0.5);

               // And a label to illustrate which menu item was chosen. (This is not necessary)
               choiseLabel = game.add.text(w/2, h-50, 'Click outside menu to continue', { font: '30px Arial', fill: '#000000' });
               choiseLabel.anchor.setTo(0.5, 0.5);
          });

          // Add a input listener that can help us return from being paused
          game.input.onDown.add(unpause, self);

          // And finally the method that handels the pause menu
          function unpause(event){
               // Only act if paused
               if(game.paused){
                    // Calculate the corners of the menu
                    var x1 = w/2 - 600/2, x2 = w/2 + 600/2,
                        y1 = h/2 - 700/2, y2 = h/2 + 700/2;

                    // Check if the click was inside the menu
                    if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                         // The choicemap is an array that will help us see which item was clicked
                         var choisemap = ['Audio', 'Exit to Splash'];

                         // Get menu local coordinates for the click
                         var x = event.x - x1,
                             y = event.y - y1;
                         // Calculate the choice
                         var choise = Math.floor(y / 90);

                         // Display the choice
                         choiseLabel.text = 'You chose menu item: ' + choisemap[choise];

                         if (choise == 1){
                              game.state.start("LevelSelect");
                              menu.destroy();
                              choiseLabel.destroy();

                              // Unpause the game
                              game.paused = false;
                         }
                    }
                    else{
                         // Remove the menu and the label
                         menu.destroy();
                         choiseLabel.destroy();

                         // Unpause the game
                         game.paused = false;
                    }
               }
          };


          game.add.text(game.width / 2, 20, "Play level " + (level+1).toString(), {
               font: "32px Arial",
               fill: "#ffffff"
          }).anchor.set(0.5);
          // if we fail a level, we simply return to level select screen
          var failLevel = game.add.text(20, 60, "Fail level", {
               font: "48px Arial",
               fill: "#ff0000"
          });
          failLevel.inputEnabled = true;
          failLevel.events.onInputDown.add(function(){
               game.state.start("LevelSelect");
          }, this)
          // if we complete the level with one star, we set star item to 1 if it was less than 1
          // at the same time, if next level exists and it's locked (-1) we unlock it (0)
          // then return to level selection screen, but before we save the progress on the local storage
          var oneStarLevel = game.add.text(20, 160, "pass the level", {
               font: "48px Arial",
               fill: "#ff8800"
          });
          oneStarLevel.inputEnabled = true;
          oneStarLevel.events.onInputDown.add(function(){
               stars[level] = Math.max(stars[level], 1);
               if(stars[level + 1] != undefined && stars[level + 1] == -1){
                    stars[level + 1] = 0;
               }
               localStorage.setItem(localStorageName, stars.toString());
               game.state.start("LevelSelect");
          }, this)


     }
}


/***********************************add by lead designer*****************************************/
function controlGameButton1(){
     if(!game.paused){
          document.getElementById("game-control-span1").className = "glyphicon glyphicon-play";
          //document.getElementById("game-control-span1").setAttribute("title", "Continue");
          //isGameStop = true;
          game.paused = true;
     }
     else{
          document.getElementById("game-control-span1").className = "glyphicon glyphicon-pause";
          //document.getElementById("game-control-span1").setAttribute("title", "Pause");
          //isGameStop = false;
          game.paused = false;
     }
     /*}*/
}
document.getElementById("control-game-button1").addEventListener('click',controlGameButton1);

function resetControlGameButton1(){
     //isGameStarted = false;
     //isGameStop = false;
     document.getElementById("game-control-span1").className = "glyphicon glyphicon-pause";
     //document.getElementById("game-control-span1").className = "glyphicon glyphicon-play";
     //document.getElementById("game-control-span2").innerHTML="Start The Game";
}
function clickTowerButton(num){
     selectedTower = num;
}
document.getElementById("eye-tower-button").addEventListener('mouseover',function(){updateTowerInfo("Eye","20","500","None");});
document.getElementById("xueyou-tower-button").addEventListener('mouseover',function(){updateTowerInfo("Xueyou","40","1000","None");});
document.getElementById("java-tower-button").addEventListener('mouseover',function(){updateTowerInfo("Java","100","400","None");});
document.getElementById("fan-tower-button").addEventListener('mouseover',function(){updateTowerInfo("Fan","20","0","-45% Movement");});
document.getElementById("gear-tower-button").addEventListener('mouseover',function(){updateTowerInfo("Gear","20","0","HP Regen");});
document.getElementById("eye-tower-button").addEventListener('click',function(){clickTowerButton(1);});
document.getElementById("xueyou-tower-button").addEventListener('click',function(){clickTowerButton(2);});
document.getElementById("java-tower-button").addEventListener('click',function(){clickTowerButton(3);});
document.getElementById("fan-tower-button").addEventListener('click',function(){clickTowerButton(4);});
document.getElementById("gear-tower-button").addEventListener('click',function(){clickTowerButton(5);});
function showSideBar(){
     document.getElementById("game-side-bar").style.display="flex";
}
function hideSideBar(){
     document.getElementById("game-side-bar").style.display="none";
}
function updateMoneyText(num){
     document.getElementById("money-text").innerHTML=num;
}
function updateRemainingMonstersText(num){
     document.getElementById("remaining-monsters-text").innerHTML=num;
}
function backToChapter(){
     hideSideBar();
     game.paused = false;
     window.location.href = "level.html";
     // game.state.start("LevelSelect");
}
document.getElementById("control-game-button2").addEventListener('click',backToChapter);

function updateTowerInfo(name,hp,attack,effect){
     document.getElementById("tower-name-text").innerHTML=name;
     document.getElementById("tower-hp-text").innerHTML=hp;
     document.getElementById("tower-attack-text").innerHTML=attack;
     document.getElementById("tower-effect-text").innerHTML=effect;
}

function disableGameButton(){
     document.getElementById("control-game-button1").disabled = true;
}
function enableGameButton(){
     document.getElementById("control-game-button1").disabled = false;
}




function disableEyeTowerButton(){
     document.getElementById("eye-tower-button").disabled = true;
}
function enableEyeTowerButton(){
     document.getElementById("eye-tower-button").disabled = false;
}
function disableFanTowerButton(){
     document.getElementById("fan-tower-button").disabled = true;
}
function enableFanTowerButton(){
     document.getElementById("fan-tower-button").disabled = false;
}
function disableGearTowerButton(){
     document.getElementById("gear-tower-button").disabled = true;
}
function enableGearTowerButton(){
     document.getElementById("gear-tower-button").disabled = false;
}
function disableJavaTowerButton(){
     document.getElementById("java-tower-button").disabled = true;
}
function enableJavaTowerButton(){
     document.getElementById("java-tower-button").disabled = false;
}
function disableXueyouTowerButton(){
     document.getElementById("xueyou-tower-button").disabled = true;
}
function enableXueyouTowerButton(){
     document.getElementById("xueyou-tower-button").disabled = false;
}
function getSideBarWidth(){
     return document.getElementById('game-side-bar').clientWidth+10;
}

var isCurrentMute = false;
function resetMuteButton(){
     var muteButton = document.getElementById("game-control-span3");
     if(isCurrentMute){
          isCurrentMute = false;
          muteButton.className = "glyphicon glyphicon-volume-up";
     }else{
          isCurrentMute = true;
          muteButton.className = "glyphicon glyphicon-volume-off";
     }
}
function showTopBar(){
     document.getElementById("top-title-bar").style.display="block";
}
function hideTopBar(){
     document.getElementById("top-title-bar").style.display="none";
}
document.getElementById("control-game-button3").addEventListener('click',function(){resetMuteButton();});
/***********************************add by lead designer*****************************************/



/* show the button when user in level selection*/
function showLevelSideBar(){
     document.getElementById("level-button-container").style.display="block";
}

/*  the button when user in level game screen*/
function hideLevelSideBar(){
     document.getElementById("level-button-container").style.display="none";
}

function formatTo2DArray(array){

     var newArr = [];
     while(array.length) newArr.push(array.splice(0,8));

     console.log(newArr);


     return newArr;
}