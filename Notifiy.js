class Notification {
    constructor(Image,Title,desc,TimeUp=5,StayUp=false,color=70,intextSize=20) {
        this.Canvas=createGraphics(400,100)
        this.showingNote=false
        this.intextSize=intextSize
        this.Reset(Image,Title,desc,TimeUp,StayUp,color)
        this.resetQueue=[]
        this.currentID=0
        this.idBeingShown=null
    }
    Glide(INT,TAR,step,divT=5){
        return (INT*(((divT-1)/divT)**step))+(TAR*(1-(((divT-1)/divT)**step)))
    }
    queueReset(Image,Title,desc,TimeUp=5,StayUp=false,color=70){
        if (this.showingNote){
            this.resetQueue.push([Image,Title,desc,TimeUp,StayUp,color,this.currentID])
        }
        else{
            this.Reset(Image,Title,desc,TimeUp,StayUp,color)
        }
        this.currentID+=1
        
    }
    Reset(Image,Title,desc,TimeUp=5,StayUp=false,color=70){
        mySound.play()
        this.Nx = 100;
        this.Ny = 10;
        this.StartPoint=millis()
        this.millis=0
        this.NoteImage=Image
        this.color=70
        this.desc=desc
        this.showingNote=true
        this.Title=Title
        this.step=0;
        this.TimeUp=TimeUp*1000
        this.StayUp=StayUp
        this.AniStages={textA:0,Wait:-1,wait:0}
        this.ShowText=true
    }
    display() {
        this.ShowText=true
        this.millis=millis()-this.StartPoint
        this.step=Math.round(this.millis/(1000/30))
        if (this.AniStages.Wait==-1){
            if (this.Ny<99){
                this.Ny=this.Glide(50,100,this.step)

            }

            else if (this.Nx<399){
                this.Ny=100
                this.Nx=this.Glide(1,400,this.step-15)
            }
            else if(this.AniStages.wait==0) {
                this.AniStages.wait=this.millis
            }
            else{
                
                if (this.millis>this.TimeUp&&this.StayUp==false){
                this.AniStages.Wait=this.step
                }
            }
        }
        else{
            this.ShowText=false
            if (this.Nx>101){
                this.Nx=this.Glide(400,100,this.step-this.AniStages.Wait)
            }
            else if (this.Ny>2){
                this.Nx=100
                this.Ny=this.Glide(100,1,this.step-25-this.AniStages.Wait)
                
            }
            else{
                this.showingNote=false
                if (this.resetQueue.length>0){
                    let queueItem=this.resetQueue.shift()
                    this.idBeingShown=queueItem[6]
                    this.Reset(queueItem[0],queueItem[1],queueItem[2],queueItem[3],queueItem[4],queueItem[5])
                }
            }
        }

        this.Canvas.clear()
        this.Canvas.push()
        this.Canvas.text
        this.Canvas.pop()
        this.Canvas.fill(this.color)
        this.Canvas.rect(400-this.Nx,100-this.Ny,this.Nx,this.Ny,20,15,5,15)
        this.Canvas.image(this.NoteImage,400-this.Nx+7.5,100-this.Ny+7.5,85,85)
        if (this.ShowText){
            this.Canvas.push()
            this.Canvas.fill("white")
            this.Canvas.textSize(40)
            this.Canvas.text(this.Title,500-this.Nx,40)
            this.Canvas.pop()
        }
        if (this.ShowText){
            this.Canvas.push()
            this.Canvas.fill("white")
            this.Canvas.textSize(this.intextSize)
            this.Canvas.text(this.desc,500-this.Nx,50,300)
            this.Canvas.pop()
        }
    }
}