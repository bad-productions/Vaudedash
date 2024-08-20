let launcher={GameStarted:false}
let Notifier;
let testDude;
let Icons={};
let testLevel;
let rickRoll;
let updateFunctions=[];
let rickRolling=false
let thingsToLoad=0
let thingsLoaded=0
let isLoading=true;
let username;
let assetsLoadingBar;
let gamepad;
let failedToLoadAssets=false
function LoadingErrorCallBack(){
    assetsLoadingBar.barColor=color("#a00000")
    errorScreen("Failed to load assets.\n\n<Please Refresh your page>")
    failedToLoadAssets=true
}
function loadingCallBack(){
    if(!failedToLoadAssets){
    thingsLoaded+=1
    assetsLoadingBar.progress=thingsLoaded/thingsToLoad*100
    console.log("callback")}

}

function queueLoad(theValue,theType){
    thingsToLoad+=1
    console.log("laoding queued")
    if (theType=="IMG"){
        return loadImage(theValue,loadingCallBack,LoadingErrorCallBack)
    }
    else if (theType=="JSON"){
        return loadJSON(theValue,loadingCallBack,LoadingErrorCallBack)
    }
    else if(theType=="AUD"){
        return loadSound(theValue,loadingCallBack,LoadingErrorCallBack);
    }
    else{
        console.error("Cant load with type \""+theType+"\"")
    }
}
class roundBar{
  constructor(mywidth,myheight){
    this.Img=createGraphics(mywidth,myheight)
    this.progress=0
    this.barColor=color("#40c900")
    this.bgColor=color("#3b3b3b")
    this.showBg=true
  }
  drawMe(){
    this.Img.clear()
    this.Img.noStroke()
    push()
    this.Img.fill(this.bgColor)
    this.Img.rect(0,0,this.Img.width,this.Img.height,180)
    pop()
    push()
    this.Img.fill(this.barColor)
    let thingy=(this.progress/100)*this.Img.width
    if(thingy>this.Img.width){
      thingy=this.Img.width
    }
    this.Img.rect(0,0,thingy,this.Img.height,180)
    pop()
    return this.Img
  }
}
function startGameSetup(){
    assetsLoadingBar=new roundBar(200,10)
    background(0)
    startPreload()
}
function StartSetup(){
    isLoading=false
    if (!gamemode.online){
    
    Notifier=new Notification(Icons.Notifiy.Alert,"Start up1!","Notification Service Loaded")}else{
        clientPreload()
        Notifier=new Notification(Icons.Notifiy.Alert,"You're online!","You joined "+(partyGuests.length-1)+" other players!")
    }
    launcher.GameStarted=true;


    gameSetup(1)


}
function startPreload(){
    Icons.Notifiy={}
    Icons.Other={}
    if(!skipJSONload){
    testLevel=queueLoad(config.levelToLoad,"JSON")}else{
        testLevel=config.levelToLoad
    }
    gamePreload()
    if(gamemode.online){
        setupClient()
        rickRoll=queueLoad("rickroll-roll.gif","IMG")
    }

    
    Icons.Notifiy.Alert=queueLoad("assets/Notifiy.png","IMG")
    Icons.Notifiy.Trophy=queueLoad("assets/achivement.png","IMG")
    Icons.Other.spriteUnknown=queueLoad("unknown.png","IMG")
}
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Error:', message, 'Script:', source, 'Line:', lineno, 'Column:', colno, 'Error object:', error);
    errorScreen(message)
    // You can add additional handling/logging here, like sending errors to a server
};
function errorScreen(message){
    clear()
    background(40)
    fill(255)
    textAlign(LEFT,BASELINE)
    textSize(10)
    noStroke()
    text("B.A.D Crash Report",0,10)
    textAlign(CENTER)
    textSize(30)
    text("YOU TOTAL BOZO",width/2,height/4)
    textSize(15)
    text("You managed to break everything!!!\nError:"+message,width/2,height*0.75)
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0)
}
function lDraw(){
    
    if(isLoading){
        if(!failedToLoadAssets){
        if(thingsLoaded==thingsToLoad){
            StartSetup()
        }
        else{
            console.log(thingsLoaded+"/"+thingsToLoad)
        }
        background(40)
        image(assetsLoadingBar.drawMe(),width/2-(assetsLoadingBar.Img.width/2),height/2-(assetsLoadingBar.Img.height/2))
    }}
    else{
        mainDraw()
    }
}
function mainDraw(){

    background(0)
    if (launcher.GameStarted){
        if (gamemode.online){
            updateData()
        }
        gameDraw()
    }
    
  Notifier.display()
  if (rickRolling){
      image(rickRoll,0,0,width,height)
  }
  image(Notifier.Canvas,width-200,height-50,200,50);
  
}
function mousePressed(){
    if (launcher.GameStarted){
        gameMousePressed()
    }
}
function keyPressed(){
    if (launcher.GameStarted){
        gameKeyPressed()
    }
}