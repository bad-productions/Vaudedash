
let partyGuests;
let partyMe;
let rickRollTime;
function setupClient(){
  thingsToLoad+=2
partyConnect(
    "wss://demoserver.p5party.org",
    "bad-productions-train",
    "room_id=1",function(){thingsLoaded+=1}
  )
  partyMe = partyLoadMyShared({ x: 200, y: 200, level: 0, username: "..." },function(){thingsLoaded+=1});
}
function clientPreload() {
  let tempUser = username
  if (tempUser == null || tempUser == undefined || tempUser == "") {
    tempUser = "DumbPerson#" + Math.round(Math.random() * 100)
  }
  partyMe.username=tempUser

  partyGuests = partyLoadGuestShareds()
  partySubscribe("sendChatMessage", handleChatMessage)
  partySubscribe("sendEndMessage", handleEndMessage)
  partySubscribe("changeLevel", handleLevelChange)
  partySubscribe("sendPunch", handleRPunch)
}
function updateData() {
  partyMe.x = players[0].px
  partyMe.y = players[0].py
  partyMe.level = levelSelected
   if (!partyIsHost()){
    partyToggleInfo(false);
   }
}
function handleRPunch(inDat){
  console.log("GOT PUNCH")
  if(levelSelected!==inDat.level){
    console.log("bro im not even close")
    return
  }
  let punchX=inDat.x
  let punchY=inDat.y
  console.log("oh no")
  if(Math.abs(punchX-players[0].px)<13+(players[0].hitbox.width/2)&&Math.abs(punchY-players[0].py)<13+(players[0].hitbox.height/2)){
    console.log("AEAEAEAEAEAE")
    Notifier.Reset(Icons.Notifiy.Alert,"OW","you got punched by "+inDat.username)
  }
}
function handleChatMessage(inDat) {
  Notifier.Reset(Icons.Notifiy.Alert, inDat.username + ":", inDat.message)
  if(inDat.message=="English or Spanish?"){
    EVERYONEFREEZE=true
  }
  if(inDat.message=="Spanish or English?"){
    EVERYONEFREEZE=false
  }
  if(inDat.message=="Never gonna give you up"){
    rickRolling=true
  }
}
function handleEndMessage(inDat) {
  Notifier.Reset(Icons.Notifiy.Alert, "WINNER!!!", inDat + " beat the level!")

}
function sendChatMessage(inStr) {
  if (inStr == null || inStr == undefined || inStr == "") {
    partyEmit("sendChatMessage", { username: partyMe.username, message: "What the sigma?" })
  }
  else {
    partyEmit("sendChatMessage", { username: partyMe.username, message: inStr })
  }
}
function sendEndMessage() {
  levelSelected = startLevel
  players[0].px = startPoint[0]
  players[0].py = startPoint[1]
  partyEmit("sendEndMessage", partyMe.username)
}

function changeLevel(inStr) {
  partyEmit("changeLevel", inStr)
}
function handleLevelChange(inStr) {
  testLevel = loadJSON(inStr, completeLevelChange)
}
function completeLevelChange() {
  Notifier.Reset(Icons.Notifiy.Alert, "WHERE AM I?", "you've teleported to a new level")
  levelLoader = { tileMaps: [], collMaps: [], classes: [], levelMap: [], levelIds: {} }
  loadTheFuckingLevel()
  players[0].px = startPoint[0]
  players[0].py = startPoint[1]
  levelSelected = startLevel
}