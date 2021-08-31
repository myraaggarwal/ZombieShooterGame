
var bg,backgroundImg;
var player;
var shooterImg,shooter_shooting;
var zombie, zombieImg,zombieDyingImg;
var zombieGroup,bulletGroup;
var heart1,heart2,heart3;
var heart1Img,heart2Img,heart3Img;
var gameOverImg;

var bullet;
var bullets=50;

var score=0;
var life=3;

var gameState="fight";

var lostSound,wonSound;
var lifelineLost,bulletReleased,zombieHit;

function preload(){

//1. Zombie hand image should disappear and bullet should not be deleted in front of it.
//2. zombies should not reach end of the house .. Code written in spawn function 

// bullet Trajectory

    shooterImg= loadImage("images/human.png");
    shooter_shooting= loadImage("images/humanShooting.png");
    zombieImg=loadImage("images/zombie.png");
    backgroundImg = loadImage("images/bg.png");
    heartImg1 = loadImage("images/heart1.png");
    heartImg2= loadImage("images/heart2.png");
    heartImg3 = loadImage("images/heart3.png");
    zombieDyingImg=loadImage("images/zombieDying.png");
    gameOverImg=loadImage("images/GameOver.png");
   
    bulletImg=loadImage("images/bullet.png");


    lostSound=loadSound("sounds/GameLost.mp3");
    wonSound=loadSound("sounds/GameWon.mp3");
    bulletReleased=loadSound("sounds/bulletReleased.mp3");
    lifelineLost=loadSound("sounds/LifelineDeduct.mp3");
    zombieHit=loadSound("sounds/ZombieHit.mp3");
}

function setup(){
    var canvas = createCanvas(windowWidth,windowHeight);
    bg= createSprite(730,300,80,400);
    bg.addImage(backgroundImg);
    bg.scale=1.5;

    player = createSprite(displayWidth-1250,displayHeight-746,20,20);
    player.addImage(shooterImg);
    player.scale=0.3;
    player.setCollider("rectangle",0,0,145,465);
    player.debug= false;

    heart1= createSprite(180,65,20,20);
    heart1.addImage("heart1",heartImg1);
    heart1.scale=0.4;
    heart1.visible= false;

    heart2= createSprite(180,65,20,20);
    heart2.addImage("heart2",heartImg2);
    heart2.scale=0.4;
    heart2.visible= false;

    heart3= createSprite(180,65,20,20);
    heart3.addImage("heart3",heartImg3);
    heart3.scale=0.4;
 
    zombieGroup = new Group();
    bulletGroup = new Group();
 

}

function draw(){
    background(0);

    if(gameState === "fight"){

        if(life === 3){
            heart3.visible=true;
            heart2.visible=false;
            heart1.visible=false;
        }

        if(life === 2){
            heart2.visible=true;
            heart3.visible=false;
            heart1.visible=false;
        }

        if(life ===1 ){
            heart1.visible=true;
            heart2.visible=false ;
            heart3.visible=false;
        }

        if(life ===0 ){
            gameState="over";
            heart1.visible=false;
            heart2.visible=false ;
            heart3.visible=false;
        }

    }

    fill("white");
    textSize(24);
    text("Score:"+ score,25,35);
    text("Lives:"+life,25,70);
    text("Bullets:"+ bullets,1200,60);

    if(score===100){
        gameState==="won"
        wonSound.play();
    }

    if(keyDown("RIGHT_ARROW")){
        player.x =player.x+30;
    }

    if(keyDown("LEFT_ARROW")){
        player.x = player.x-30;
    }

    if(keyDown("UP_ARROW") && player.y >= 176){
        player.y =player.y-30;
    }

    if(keyDown("DOWN_ARROW") && player.y <= 419){
        player.y = player.y+30;
    }

    if(keyWentDown("space")){
      
       bullet = createSprite(displayWidth-1000,player.y-30,15,15);
       bullet.addImage("bullet1",bulletImg);
       bullet.shapeColor ="black";
       bullet.velocityX=15;
       bullet.scale=1;
       
       bulletGroup.add(bullet);
       player.depth=bullet.depth;
       player.depth=player.depth+5;
       player.addImage(shooter_shooting);
       bullet.depth=bg.depth+1;

       bullets=bullets-1;
       bulletReleased.play();
    }
    else if(keyWentUp("space")){
        player.addImage(shooterImg);
    }

    if(bullets===0){
        gameState="bulletover";
    }

    if(zombieGroup.isTouching(bulletGroup)){
        for(i=0; i< zombieGroup.length;i++){
            if(zombieGroup[i].isTouching(bulletGroup)){
                //zombieGroup[i].addImage(zombieDyingImg);
                zombieGroup[i].velocityX=0;
                
                zombieGroup[i].destroy();
               
                bulletGroup.destroyEach();
                score++;
                zombieHit.play();
            }
        }
    }
    
    if(zombieGroup.isTouching(player)){
        for(i=0; i< zombieGroup.length;i++){
            if(zombieGroup[i].isTouching(player)){
                zombieGroup[i].destroy();
                life=life-1;
                lifelineLost.play();
            }
        }
    }

    spawnZombies();

    drawSprites();

    if(gameState === "over"){
        textSize(30);
        text(" game over :(   reset the game",600,70);
        gameOver = createSprite(400,400,50,50);
        score =0;
        gameOver.addImage(gameOverImg);
        bullets=0;
        zombieGroup.destroyEach();
        player.destroy();
        lostSound.play();

    }

    else if(gameState === "won"){
        textSize(30);
        text("YOU WON !!",600,70);
        zombieGroup.destroyEach();
        player.destroy();
    }

    else if(gameState === "bulletover"){
        textSize(30);
        text(" you ran out of bullets :(",600,70);
        zombieGroup.destroyEach();
        player.destroy();
        bulletGroup.destroyEach();
    }
}

function spawnZombies(){
    if(frameCount%60 === 0){
        zombie = createSprite(random(500,2000),random(200,445),10,10);
        zombie.addImage(zombieImg);
        zombie.Visiblity=255;
        zombie.scale=0.35;
        zombie.velocityX = -3;
        zombie.setCollider("rectangle",0,0,100,300);
        zombie.debug= false;
        zombie.lifetime = 700;
        zombieGroup.add(zombie);

       /* if(zombie.x === displayWidth-1250){
            zombie.destroy();
        }
        */
    }
}