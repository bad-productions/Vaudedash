document.addEventListener('contextmenu', event => event.preventDefault());
let tiles = []
let collison = []
let customColl = {};
let pwidth = 30;
let pheight = 60;
let gravity = 1;
let myPunch={x:0,y:0,cooldown:0}
let plx = 0;
let gameSize={w:15*40,h:10*40}
let gamemode={online:true,racing:false}
let ply = 0;
let player;
let EVERYONEFREEZE=false;
let ope = true;
let textures = {};
let game;
let weirdAhhPit;
let levelSelected = 0;
let startLevel = 0;
let scriptFuncs={}
let tileSize = 40 * sizeScale;
let canvasScale;
let canvasScaling = { scaledWidth: 0, scaledHeight: 0, offsetX: 0, offsetY: 0 }
let mousePos = { x: 0, y: 0 }
let charactorsSpawned = false;
let players = [];
let mySound
let Classes = [];
let startPoint = [0, 0]
let textureSelect;
let touchMode=false;
let gamepadOn=false
let playerAnis={test:{walk:null,wallSlide:null,jump:null,fall:null,crouch:{walk:null,idle:null}}}
let pAni={}
let racism;
let Funcs = ["Air", "Solid", "Hit", "End", "Climb"]
function flipImageHorizontally(image) {
  let flipped = createGraphics(image.width, image.height);
  flipped.translate(image.width, 0);
  flipped.scale(-1, 1);
  flipped.image(image, 0, 0);
  return flipped;
}
function loadPlayerAnimations(){
    console.log(Object.keys(playerAnis))
}
let texturePack=["basic","train"]
let packsLoaded={}
let texturePacks=
{"basic":
    {
        textures:["assets/Crate.png","assets/spike.gif","assets/ShinyCrate.gif","assets/ladder.png","assets/spikeLeft.png","assets/spikeRight.png","assets/spikeTop.png",]
        ,
        names:["Crate","Spike","ShinyCrate","ladder","spikeLeft","spikeRight","spikeTop"]
    },
 "train":
 {
     textures:["assets/achivement.png","assets/train/01.png", "assets/train/02.png", "assets/train/03.png", "assets/train/04.png", "assets/train/05.png", "assets/train/06.png", "assets/train/07.png", "assets/train/08.png", "assets/train/09.png", "assets/train/10.png", "assets/train/11.png", "assets/train/12.png", "assets/train/13.png", "assets/train/14.png", "assets/train/15.png"]
     ,
     names:["0","1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]
 }
}
function gamePreload() {
    
    console.log("Notice:Loading \""+texturePack+"\" textures...")
    let ez={}
    for (let y=0;y<texturePack.length;y++){
        ez={}
        ez.Air = createImage(1, 1)
    for (let i=0;i<texturePacks[texturePack[y]].textures.length;i++){
        ez[texturePacks[texturePack[y]].names[i]]=queueLoad(texturePacks[texturePack[y]].textures[i],"IMG")
    }
        console.log(ez)
        
        packsLoaded[texturePack[y]]=ez
        console.log(packsLoaded[texturePack[y]])
    }
    textures=packsLoaded["basic"]
    loadPlayerAnimations()

      soundFormats('mp3', 'ogg');
      mySound = queueLoad('assets/Notification',"AUD");
      racism = queueLoad('assets/racism.mp3',"AUD");
      
    rickRollSound=queueLoad
    touchBtnImg.left=queueLoad("assets/Arrow/arrow_0.png","IMG")
    touchBtnImg.right=queueLoad("assets/Arrow/arrow_1.png","IMG")
    
touchBtnImg.action=queueLoad("assets/Arrow/arrow_3.png","IMG")
    touchBtnImg.jump=queueLoad("assets/Arrow/arrow_2.png","IMG")

}
function touchStarted() {
    touchMode=true
}
let touchBtns={}
let levelsFinished=0
let deathCount=0;

let touchBtnImg={}
let myAchivements=[]
let gridSize={w:15,h:10}
let Achivements={"dead10":"ouch: Die 10 times","dead20":"Ouch : Die 20 times","dead50":"OWWWWW : Die 50 times","dead100":"STOP DYING : die 100- how did you die that many times?","win":"#1 VICTORY ROYALE : finish a level","win10":"GAMING : finish 10 levels","win20":"SIGMA GAMING : finish 20 levels"}
function getAchivement(theID){
    if(!myAchivements.includes(theID)){
    Notifier.Reset(Icons.Notifiy.Trophy,"Trophy Earned",Achivements[theID])
    myAchivements.push(theID)
    storeItem("achivements",{list:myAchivements})
    }
}
function gameSetup(playerCount) {
    //  for(let i=0;i<10;i++){
    //  Classes.push(new Bug(200,200))}
    touchBtns["left"]=new guiButton(0,height-45,45,45)
    touchBtns["right"]=new guiButton(45,height-45,45,45)
    touchBtns["action"]=new guiButton(width-45,height-45,45,45)
    touchBtns["jump"]=new guiButton(width-90,height-45,45,45)
    // touchBtns["right"]=
    // touchBtns["action"]=
    // touchBtns["jump"]=
    if (config.MaxFrameRate) {
        frameRate(config.MaxFrameRate)
        console.log("Max frame rate set")
    }
    myPunch.cooldown=millis()
    //  checkbox = createCheckbox('white');
    //  checkbox.position(0, 100);

    game = createGraphics(gameSize.w * sizeScale, gameSize.h * sizeScale)
    UiLayer=createGraphics(game.width,game.height)
    //  Notifier=new Notification(Icons.Notifiy.Alert,"Loading options","loading...",0,1)
    Notifier.StayUp = 0
    console.log(Object.keys(textures))
    game.background(40)
    game.pixelDensity(sizeScale)
    for (i = 0; i < gridSize.w * gridSize.h; i++) {
        tiles.push(0)
        collison.push(0)
    }
    loadTheFuckingLevel()
    for (i = 0; i < playerCount; i++) { players.push(new Player([1, 1, 1, 1], startPoint)) }

}

function checkColl(x, y, w, h) {
    let output = []
    for (i = 0; i < collison.length; i++) {
        if (collison[i] == 1) {
            px = ((i % 15) * (40 * sizeScale)) + (20 * sizeScale)
            py = (Math.floor(i / 15) * (40 * sizeScale)) + (20 * sizeScale)
            if (Math.abs(px - x) < (20 * sizeScale) + (w / 2) && Math.abs(py - y) < (20 * sizeScale) + (h / 2)) {
                output.push(i)
            }
        }

    }
    return output
}
function achiveCheck(){
    if(deathCount==10){
        getAchivement("dead10")
    }
    if(deathCount==20){
        getAchivement("dead20")
    }
    if(deathCount==50){
        getAchivement("dead50")
    }
    if(deathCount==100){
        getAchivement("dead100")
    }
    if(levelsFinished==1){
        getAchivement("win")
    }
    if(levelsFinished==10){
        getAchivement("win10")
    }
    if(levelsFinished==20){
        getAchivement("win20")
    }
}
function renderTouchButton(inKey){
    image(touchBtnImg[inKey],touchBtns[inKey].posx,touchBtns[inKey].posy,touchBtns[inKey].width,touchBtns[inKey].height)
}
function filterMessage(message){
    if(message.lowercase().includes("nigger")){
        racism.play()
    }
    else if(message.lowercase().includes("fag")){
      sendChatMessage("I don't like gay people for some reason")
    }
    else{
        sendChatMessage(message)
    }
}

function gameKeyPressed() {
    if (gamemode.online&&key=="c"){
        filterMessage(prompt("message:"))
    }
    if (gamemode.online&&key=="l"){
        changeLevel(prompt("level:"))
    }
    
}
function handlePunch(){
    if(gamemode.online){
        console.log("sending punch")
        partyEmit("sendPunch",{x:myPunch.x,y:myPunch.y,username:partyMe.username,level:levelSelected})
    }
}
function gameDraw() {
    gamepad = navigator.getGamepads()[0];
    if(gamepad && gamepadOn==false){
        Notifier.Reset(Icons.Notifiy.Alert,"Gamepad On","Your gamepad has been connected")
        gamepadOn=true
    }
    if(gamepad==false && gamepadOn){
        Notifier.Reset(Icons.Notifiy.Alert,"Gamepad Off","Your gamepad has been disconnected")
        gamepadOn=false
    }
    Classes = levelLoader.classes[levelSelected]
    tiles = levelLoader.tileMaps[levelSelected]
    collison = levelLoader.collMaps[levelSelected]
    deltaTime = 60 / frameRate()
    mousePos.x = (mouseX - canvasScaling.offsetX) / (canvasScaling.scaledWidth / game.width)
    mousePos.y = (mouseY - canvasScaling.offsetY) / (canvasScaling.scaledHeight / game.height)

    
    if (deltaTime > 10) {
        deltaTime = 1
    }
    if (touchMode){
        touchBtns.left.update()
        touchBtns.right.update()
        touchBtns.jump.update()
        touchBtns.action.update()
    }
    game.clear()
    game.background(40)
    for (i=0;i<updateFunctions.length;i++){
        updateFunctions[i]()
    }
    //    print(Classes[0].constructor.name)
    if (gamemode.online){
        for (i = 0; i < partyGuests.length; i++){
            if(partyGuests[i].level==levelSelected&&partyGuests[i]!==partyMe){
                push()
                
                game.fill(200)
                    game.textAlign(CENTER)
                        .text(partyGuests[i].username,partyGuests[i].x*sizeScale,(partyGuests[i].y-40)*sizeScale)
                game.fill(0,0,255)
                game.rect(partyGuests[i].x * sizeScale, partyGuests[i].y * sizeScale, 30 * sizeScale, 60 * sizeScale)
                pop()
            }
        }
    }
    game.fill(255)
    game.rectMode(CORNER)
    if (config.showGrid) {
        for (i = 0; i < gridSize.h; i++) {
            game.line(i * 40 * sizeScale, 0, i * 40 * sizeScale, game.height)
        }
        for (i = 0; i < gridSize.w; i++) {
            game.line(0, i * 40 * sizeScale, game.width, i * 40 * sizeScale)
        }
    }
    renderTiles()
    game.rectMode(CENTER)
    game.fill(255, 0, 0)
    if (ope) {
        for (i = 0; i < players.length; i++) players[i].frameUpdate();
        for (i = 0; i < levelLoader.classes[levelSelected].length; i++) levelLoader.classes[levelSelected][i].display(false);
    }
    else {
        for (i = 0; i < Classes.length; i++) Classes[i].display();
    }
    plx = mouseX
    ply = mouseY

    //    image(game,0,0)
    if (config.ShowFps) {
        game.textAlign(RIGHT)
        game.textSize(10 * sizeScale)
        game.fill(255)
        game.text('FPS:' + Math.round(frameRate()), game.width, 10 * sizeScale);
        // try {
        //     game.text('Position:' + players[0].px + "," + players[0].py, game.width, 20 * sizeScale);
        // }
        // catch {
        //     console.log("filed to get player pos")
        // }
    }

    if (config.ShowDeltaTime) {
        game.textAlign(RIGHT)
        game.textSize(10 * sizeScale)
        game.fill(255)
        game.text('DeltaTime:' + Math.round(deltaTime * 100) / 100, game.width, 20 * sizeScale);

    }
    if (gamemode.online&&keyIsDown(80)){
    showPlayerList()}
    if (touchMode){
        renderTouchButton("left")
        renderTouchButton("right")
        renderTouchButton("action")
        renderTouchButton("jump")
    }
    // game.push()
    // game.ellipseMode(CENTER)
    // game.circle(players[0].x,players[0].y,30)
    // game.pop()
    // game.circle(players[0].x,players[0].y,30)
    // game.circle((players[0].px-15)*sizeScale,(players[0].py-30)*sizeScale,20)
    // game.circle((players[0].px+15)*sizeScale,(players[0].py-30)*sizeScale,20)
    // game.circle((players[0].px-15)*sizeScale,(players[0].py+30)*sizeScale,20)
    // game.circle((players[0].px+15)*sizeScale,(players[0].py+30)*sizeScale,20)
    drawHitCircle()
    resizeAndDraw()

}
function drawHitCircle(){
  let centerY=players[0].py*sizeScale
  let centerX=players[0].px*sizeScale
  let progress=map(millis(),myPunch.cooldown,myPunch.cooldown+1000,0,100)
  if(progress>100){
      progress=100
  }

  game.push()

  // game.stroke("#D1D1D1DB")
  // game.strokeWeight(2*sizeScale)
  game.fill("#FFFFFF6D")
  game.noStroke()
  
    let angle = atan2(mousePos.y - centerY, mousePos.x- centerX);

  // Position of the follow circle
    myPunch.x=(centerX + cos(angle) * (50*sizeScale))/sizeScale
    myPunch.y=(centerY + sin(angle) * (50*sizeScale))/sizeScale
      if (progress==100&&mouseIsPressed){
          myPunch.cooldown=millis()
          handlePunch()
      }
    game.ellipse((centerX + cos(angle) * (50*sizeScale)), (centerY + sin(angle) * (50*sizeScale)), 25*sizeScale, 25*sizeScale);
      let angle2 = map(progress, 0, 100, 0, TWO_PI);

      // Draw the loading bar background
      // Draw the loading bar progress
      game.noFill();
      game.stroke("#D1D1D1DB")
      game.strokeWeight(4*sizeScale);
      game.arc((centerX + cos(angle) * (50*sizeScale)),  (centerY + sin(angle) * (50*sizeScale)), 25*sizeScale, 25*sizeScale, -HALF_PI, angle2 - HALF_PI);
  game.pop()
}
function showPlayerList(){
  game.push()
  game.fill(100,100,255)
  game.textSize(30)
  game.textAlign(LEFT)
  game.text("Players Online:",0,30)
  game.fill(255)
  for (let i=0;i<partyGuests.length;i++){
    game.text(partyGuests[i].username,0,i*30+60)
  }
  game.pop()
}
function resizeAndDraw() {
    let canvasAspect = width / height;
    let gameAspect = game.width / game.height;

    // Calculate the scaled width and height while maintaining aspect ratio
    if (canvasAspect > gameAspect) {
        canvasScaling.scaledHeight = height;
        canvasScaling.scaledWidth = game.width * (height / game.height);
    } else {
        canvasScaling.scaledWidth = width;
        canvasScaling.scaledHeight = game.height * (width / game.width);
    }

    // Center the game graphics on the canvas
    canvasScaling.offsetX = (width - canvasScaling.scaledWidth) / 2;
    canvasScaling.offsetY = (height - canvasScaling.scaledHeight) / 2;

    // Draw the game graphics on the canvas with the calculated size
    image(game, canvasScaling.offsetX, canvasScaling.offsetY, canvasScaling.scaledWidth, canvasScaling.scaledHeight);

}
function renderTiles() {
    for (ix = 0; ix < gridSize.w; ix++) {
        for (iy = 0; iy < gridSize.h; iy++) {
            tileid = (iy * gridSize.w) + ix
            if (0 < tiles[tileid]) {
                game.image(textures[Object.keys(textures)[tiles[tileid]]], ix * 40 * sizeScale, iy * 40 * sizeScale, 40 * sizeScale, 40 * sizeScale)
            }
        }
    }
}
function getPosition(x, y) {
    return { x: Math.round((x - (20 * sizeScale)) / (40 * sizeScale)) * (40 * sizeScale), y: Math.round((y - (20 * sizeScale)) / (40 * sizeScale)) * (40 * sizeScale) }
}
function getPositionTile(x, y) {
    return { x: Math.round((x - (20 * sizeScale)) / (40 * sizeScale)), y: Math.round((y - (20 * sizeScale)) / (40 * sizeScale)) }
}
function getIndexOfTile(x, y) {
    return (getPositionTile(x, y).y * gridSize.w) + getPositionTile(x, y).x
}
function gameMousePressed() {

}
