
let scribble;
let testBut
let updateClock=0
let listOfLines = [[0, 0]]
let currentScreen=null;
let comicSans
let startingGame=false
let UiLayer=null
let userData;
let skipJSONload=false
const urlParams = new URLSearchParams(window.location.search);
console.log("%cB.A.D Productions","color:yellow;font-size:30px;font-family:Comic Sans MS;background:red")
console.log("%cGaming Division","color:yellow;font-size:10px;font-family:Comic Sans MS;background:red")




function setup() {

  createCanvas(windowWidth, windowHeight)
  // console.log('%c * Changing all console logs to Comic Sans... * \n(you actually thought you could escape the Comic Sans by going to the console?) ', 'color: red;background:black;font-family:Comic Sans MS');
  // text("BAD DEMO SERVICE  Authorizing...\n\nYou must be authorized to access this software",0,10)
  // getUserInfo().then(result => {
  //   userData=result
  //   if(userData==null){
  //     LoginWithReplit().then(function(){console.log("got user login successfully refreshing..");location.refresh()})
  //   }
  //  console.log("logged in with data:",userData)
  //   postAuth()
  // }).catch(error => {
  //   clear() 
  //   text("Failed to AUTH",0,10)
  //   console.error('Error in async function:', error);
  //   postAuth()
  // });
  postAuth()
  
  
}
function postAuth(){
  if(urlParams.get("level")!==null){
    config.quickLaunch=true
    config.levelToLoad=urlParams.get("level")
    skipJSONload=true
  }
  if(!config.quickLaunch){
    scribble = new Scribble();
    currentScreen=new startScreen()

    console.log("starting")
    updateClock=millis()
    try{
      myAchivements=getItem("achivements").list
    }
    catch{

    }
    }
    else{
      startingGame=true
      gamemode.online=config.quickLaunchOnline
      startGameSetup()
    }
}
function preload(){
  comicSans=loadFont("assets/ComicSansMS.ttf")
  screenBg=loadImage("assets/screenBg.png")
  controlsThing=loadImage("assets/controls.png")
}
class guiTextBox{
  constructor(x,y,w,h){
    this.textBox = createInput();
    this.width=w
    this.posx=x
    this.height=h
    this.posy=y
    this.textBox.position(x, y);
    this.textBox.size(w,h)
    this.textBox.style('font-family', 'Comic Sans MS');
    this.textBox.style('background', 'transparent');
    this.textBox.style('border', 'none');
    this.textBox.style('outline', 'none');
    this.textBox.style('color', 'black');
  }
}
function showCaption(px,py,name,Color,Text,textColor="white"){
  console.log("sigma")
  game.push()
  game.textAlign(LEFT)
  let x=(px-(game.textWidth(name+":")+game.textWidth(Text))/2)
  let y=py
  game.fill(Color)
  game.text(name+":",x,y)
  game.fill(textColor)
  game.text(Text,x+game.textWidth(name+":"),y)
  game.pop()
}
class guiButton {
  constructor(x, y, w, h,pressCallback=function(){}) {
    this.width = w
    this.height = h
    this.posx = x
    this.posy = y
    this.isHovered = false
    this.isPressed = false
    this.pressLock=false
    this.pressCallback=pressCallback
  }
  getTouches() {
    for (let i = 0; i < touches.length; i++) {
      let ct = touches[i]
      if (this.posx < ct.x && ct.x < this.posx + this.width && this.posy < ct.y && ct.y < this.posy + this.height) {
        return true
      }
    }
    return false

  }
  update(xMouse = mouseX, yMouse = mouseY, mDown = mouseIsPressed) {
    this.isHovered = this.posx < mouseX && mouseX < this.posx + this.width && this.posy < mouseY && mouseY < this.posy + this.height
    this.isPressed = (this.isHovered && mDown) || this.getTouches()
    if(this.pressLock&&this.isPressed==false){
      this.pressCallback()
    }
    this.pressLock=this.isPressed
    

  }
}
function drawButton(bO,inText,strokeC=color("blue"),fillC=color(255,0,0),hoverColor=color(255,100,100),textColor=color("yellow")){
  let thingCol=color("red")
  if(bO.isHovered){
    thingCol=color(255,100,100)
  }
  drawRect(bO.posx, bO.posy, bO.width, bO.height, strokeC, thingCol);
  push()
  stroke(textColor)
  textAlign(CENTER, CENTER)
  textFont(comicSans)
  text(inText, (bO.width / 2)+bO.posx, (bO.height / 2)+bO.posy)

  pop()
}
function drawRect(x, y, w, h, strokeC = color(0, 0, 0), fillC = color(0, 0, 0)) {
  stroke(fillC)
  scribble.scribbleFilling([x, x + w, x + w, x], [y, y, y + h, y + h], 2, 45);
  stroke(strokeC)
  scribble.scribbleLine(x, y, x + w, y)
  scribble.scribbleLine(x, y + h, x + w, y + h)
  scribble.scribbleLine(x, y, x, y + h)
  scribble.scribbleLine(x + w, y, x + w, y + h)
}
class startScreen{

  constructor(){
    this.usernameBox=new guiTextBox(0,0,100,50)
    this.sPos={x:(width / 2)-(50),y:height / 2}
    this.usernameBox.textBox.value("Person#" + Math.round(Math.random() * 100))
    
    this.startButton=new guiButton(this.sPos.x, height / 4, 100, 50,this.startCallBack.bind(this))

    this.achivementButton=new guiButton(this.sPos.x, height / 4+70, 100, 50)
    this.settingsButton=new guiButton(this.sPos.x, height / 4+140, 100, 50,function(){this.usernameBox.textBox.remove();currentScreen=new settingsScreen();}.bind(this))
    this.achivementButton.pressCallback=function(){
      this.usernameBox.textBox.remove();
      currentScreen=new achivementScreen();
      
    }.bind(this)
  }
  startCallBack(){
      this.usernameBox.textBox.remove();
    currentScreen=new gameSelectScreen(this.usernameBox.textBox.value())
  }
  draw(){
    this.startButton.update()
    this.achivementButton.update()
    this.settingsButton.update()
    username=this.usernameBox.textBox.value()
    drawButton(this.startButton,"Play")
    drawButton(this.achivementButton,"Achivements")
    drawButton(this.settingsButton,"Settings")
    drawRect(0,18,100,15,color("blue"),color("red"))
  }
}
class settingsScreen{

  constructor(){
    this.backButton=new guiButton(0, 0, 50, 20,function(){currentScreen=new startScreen()})
    this.FPSmoniter=new guiButton(50, 50, 100, 40,function(){config.ShowFps=!config.ShowFps})
    this.res=new guiButton(200, 50, 100, 40,function(){config.Resolution+=600;if(config.Resolution>1800){config.Resolution=600};sizeScale=config.Resolution/600})
  }
  draw(){
    this.backButton.update()
    this.FPSmoniter.update()
    this.res.update()
    drawButton(this.backButton,"Back")
    drawButton(this.FPSmoniter,`show FPS(${config.ShowFps})`)
    drawButton(this.res,`Resolution(${config.Resolution})`)
  }
}
class gameSelectScreen{
  constructor(){
    this.joinGameButton=new guiButton(width / 4, height / 4, 100, 50,function(){startingGame=true;startGameSetup(),currentScreen=null})
    this.backButton=new guiButton(0, 0, 50, 20,function(){currentScreen=new startScreen()})
  }
  draw(){
    this.joinGameButton.update()
    this.backButton.update()
    drawButton(this.joinGameButton,"Join Game")
    drawButton(this.backButton,"Back")
    image(controlsThing,0,height/2,200,100)
  }
}
class achivementScreen{
  constructor(){
    this.backButton=new guiButton(0, 0, 50, 20,function(){currentScreen=new startScreen()})
  }
  drawCard(row,inText){
    push()
    drawRect(10,30+(row*60),width-20,50,color(25,0,0),color(250,0,0))
    textAlign(LEFT)
    stroke(color("black"))
    textFont(comicSans)
    text(inText,20,60+(row*60))
    pop()
  }
  draw(){
    this.backButton.update()
    drawButton(this.backButton,"Back")
    for (let i = 0; i < myAchivements.length; i++){
      console.log("E")
      this.drawCard(i,Achivements[myAchivements[i]])
    }
  }
}

function draw(){
  if(startingGame){
    lDraw()
  }else{
  if(millis()-updateClock>1000/10){
    updateClock=millis()
    if(userData){
    scribbleDraw()}
  }}
}
function scribbleDraw() {
  clear()
  image(screenBg,0,0,width,height)
  currentScreen.draw()
}
