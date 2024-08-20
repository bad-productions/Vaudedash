let ObjectBases=[]
let sprites={}
// class Script{
//     constructor(position)
// }
class TriggerBox{
    constructor(myX,myY,myW,myH,scriptLink){
        this.position={}
        console.log("trigger box made with ID:"+scriptLink)
        this.x=myX+myW
        this.y=myY+myH
        this.width=myW
        this.height=myH
        this.collideData={width:myW,height:myH,trigger:"Custom",collideID:scriptLink}
    }
    display(){
        game.push()
            game.rectMode(CENTER)
                game.rect(this.x*sizeScale,this.y*sizeScale,this.width*sizeScale,this.height*sizeScale)
        game.pop()
    }
}
class Bug {
    constructor(position,settings) {
        this.x = position[0];
        this.y = position[1];
        if ("Right"==settings.Direction){
            this.facing=1;
        }
        else{
            this.facing=-1;
        }
        
        this.diameter=30
        this.speed=settings.Speed
        this.collideData={width:30,height:30,trigger:"Hit"}
    }

    display(Freeze=true) {
        if (!Freeze){
        if (this.checkColl(this.x,this.y+5,this.diameter*sizeScale,this.diameter*sizeScale).Solids.length==0){
            this.y+=5
        }
        if (this.checkColl(this.x+this.facing*this.speed,this.y,this.diameter*sizeScale,this.diameter*sizeScale).Solids.length==0){
            this.x+=this.facing*this.speed
        }
        else {
            this.facing*=-1
        }
        }
        game.push()
        game.fill(255,0,0)
        game.square(this.x*sizeScale, this.y*sizeScale, this.diameter*sizeScale)
        game.pop()
    }
    checkColl(inx,iny,w=30*sizeScale,h=60*sizeScale){
        let output=[]
        let output2=[]
        let x=inx*sizeScale
        let y=iny*sizeScale
        let px;
        let py;
        if (config.OptimizeCollisions){
            let startInd=getIndexOfTile(x-(80*sizeScale),y-(80*sizeScale))
            let endInd=getIndexOfTile(x+(80*sizeScale),y+(80*sizeScale))
            thingX=startInd
            thingY=endInd
            for (let i=startInd;i<endInd;i++){
                if (collison[i]==1){
                    px=((i%15)*(40*sizeScale))+(20*sizeScale)
                    py=(Math.floor(i/15)*(40*sizeScale))+(20*sizeScale)
                    if (Math.abs(px-x)<(20*sizeScale)+(w/2)&&Math.abs(py-y)<(20*sizeScale)+(h/2)){
                        output.push(i)
                    }
                }

            }
        }
        else{
            for (i=0;i<collison.length;i++){
                if (collison[i]==1){
                    px=((i%15)*(40*sizeScale))+(20*sizeScale)
                    py=(Math.floor(i/15)*(40*sizeScale))+(20*sizeScale)
                    if (Math.abs(px-x)<(20*sizeScale)+(w/2)&&Math.abs(py-y)<(20*sizeScale)+(h/2)){
                        output.push(i)
                    }
                }
                else if(0<collison[i]){
                    px=((i%15)*(40*sizeScale))+(20*sizeScale)
                    py=(Math.floor(i/15)*(40*sizeScale))+(20*sizeScale)
                    if (Math.abs(px-x)<(20*sizeScale)+(w/2)&&Math.abs(py-y)<(20*sizeScale)+(h/2)){
                        output2.push(collison[i])
                    }
                }

            }
        }
        if (x+(w/2)>game.width){
            output.push(0)
        }
        if (x-(w/sizeScale)<0){
            output.push(0)
        }
        return {Solids:output,Other:output2}
    }
}





class LittleDude extends BaseObject{
    constructor(position,settings){
        super(null,position,[30,30],settings)
        this.velocity.y=2
        this.velocity.x=2
        this.updateCallBack=this.frameUpdate
    }
    frameUpdate(){
        
        
    }
}
ObjectBases.push(Bug)