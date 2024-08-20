let levelLoader={tileMaps:[],collMaps:[],classes:[],levelMap:[],levelIds:{}}
let scriptFunctions={}
function loadFieldInstances(fieldList){
    let outputOfThis={}
    for (let i=0;i<fieldList.length;i++){
        outputOfThis[fieldList[i].__identifier]=fieldList[i].__value
    }
    return outputOfThis
}
function loadLevelPart(levelPart,indexOfPartLoaded){
    let newTileMap=[]
    let newCollMap=[]
    let newClasses=[]
    let layers={}
    for (let i=0;i<gridSize.h*gridSize.w;i++){
       newTileMap.push(0)
    }
    for (let i=0;i<levelPart.layerInstances.length;i++){
        
        if (levelPart.layerInstances[i].__identifier=="Collisons"){
            
        layers[levelPart.layerInstances[i].__identifier]=levelPart.layerInstances[i].intGridCsv;
        }
        else if(levelPart.layerInstances[i].__identifier=="Tiles"){
            
            layers[levelPart.layerInstances[i].__identifier]=levelPart.layerInstances[i].gridTiles
        }
        else if(levelPart.layerInstances[i].__type=="Entities"){
            layers[levelPart.layerInstances[i].__identifier]=levelPart.layerInstances[i].entityInstances
        }
        
    }
    for (let i=0;i<layers["Tiles"].length;i++){
        newTileMap[layers["Tiles"][i].d[0]]=layers["Tiles"][i].t+1
    }
    let myNeighbours={}
    for (let i=0;i<levelPart.__neighbours.length;i++){
        if(levelPart.__neighbours[i].dir.length==1){

            myNeighbours[levelPart.__neighbours[i].dir]=levelPart.__neighbours[i].levelIid
        }
    }
    for (let i=0;i<layers["Objects"].length;i++){
        // if (layers["Objects"][i].__identifier=="Bug"){
        //     let cool=0;
        //     if (layers["Objects"][i].fieldInstances[1].__value=="Right"){
        //         cool=1
                
        //     }
        //     //layers["Objects"][i].fieldInstances[0].__value
        //     newClasses.push(new Bug(layers["Objects"][i].px[0],layers["Objects"][i].px[1],cool,2))
        // }
        if (layers["Objects"][i].__identifier=="SpawnPoint"){
        startPoint=layers["Objects"][i].px
        levelSelected=indexOfPartLoaded
            startLevel=indexOfPartLoaded
        }
        else if(layers["Objects"][i].__identifier=="StartScript"){
            eval(layers["Objects"][i].fieldInstances[0].__value)
        }
        else if(layers["Objects"][i].__identifier=="TriggerBox"){
            newClasses.push(new TriggerBox(layers["Objects"][i].px[0],layers["Objects"][i].px[1],layers["Objects"][i].width,layers["Objects"][i].height,layers["Objects"][i].fieldInstances[0].__value))
        }
        else{
            for (let o=0;o<ObjectBases.length;o++){
                if(ObjectBases[o].name==layers["Objects"][i].__identifier){
                    newClasses.push(new ObjectBases[o](layers["Objects"][i].px,loadFieldInstances(layers["Objects"][i].fieldInstances)))
                }
            }
        }
    }
    newCollMap=layers["Collisons"]
    console.log("lenth of tile map",newTileMap.length)
    return {coll:newCollMap,tiles:newTileMap,classes:newClasses,data:{idd:levelPart.iid,Neighbours:myNeighbours}}
}
function loadTheFuckingLevel(){
    let testLevelLoad;
    console.log(testLevel)
    for(let i=0;i<testLevel.levels.length;i++){
        testLevelLoad=loadLevelPart(testLevel.levels[i],i)
        levelLoader.tileMaps.push(testLevelLoad.tiles)
        levelLoader.collMaps.push(testLevelLoad.coll)
        levelLoader.classes.push(testLevelLoad.classes)
        levelLoader.levelMap.push(testLevelLoad.data.Neighbours)
        levelLoader.levelIds[testLevelLoad.data.idd]=i
    }
//    collison=testLevelLoad.coll
//    tiles=testLevelLoad.tiles
    console.log(levelLoader.tileMaps)
}