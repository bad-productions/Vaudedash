
class BaseObject{
  constructor(myClass,position,size,settings,sprite=null,collOveride=false,collValue=[]){
    this.position={}
    this.velocity={}
    this.collSize={}
    this.size={}
    this.position.x = position[0];
    this.position.y = position[1];
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.size.width=size[0]
    this.size.height=size[1]
    this.collSize.w=size[0]
    this.collSize.h=size[1]
    this.collideData={}
    this.settings=settings
    this.sprite=sprite
    this.updateCallBack=myClass;
    this.collisions={"Solids":{colliding:false,direction:"x"},"Other":[]}
    if (collOveride){
      this.collSize.w=collValue[0]
      this.collSize.h=collValue[1]
    }
  }
  display(){

    this.updateCallBack()
    this.collisions.Solids={colliding:false,direction:"x"}
    if (this.checkColl(this.x+this.velocity.x,this.y,this.collSize.w,this.collSize.h).Solids.length==0){
        this.position.x+=this.velocity.x
    }
    else{
      this.collisions.Solids={colliding:true,direction:"x"}
    }
    if (this.checkColl(this.x,this.y+this.velocity.y,this.collSize.w,this.collSize.h).Solids.length==0){
        this.position.y+=this.velocity.y
    }
    else{
      this.collisions.Solids={colliding:true,direction:"y"}
    }
    this.collisions.Other=this.checkColl(this.x,this.y,this.collSize.w,this.collSize.h).Other
    if (this.sprite!=null){
      image(this.sprite,this.position.x,this.position.y,this.size.width,this.size.height)
    }
    else{
      image(Icons.Other.spriteUnknown,this.position.x,this.position.y,this.size.width,this.size.height)
    }
    
    }
  checkColl(inx,iny,w=this.collSize.w*sizeScale,h=this.collSize.h*sizeScale){
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
      if (x+(w/2)>600){
          output.push(0)
      }
      if (x-(w/2)<0){
          output.push(0)
      }
      return {Solids:output,Other:output2}
  }
}
