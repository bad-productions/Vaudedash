triggerBoxes={}
varibles={}
class Player {
    constructor(Stats, startPoint = [0, 0], controllerMap = { jump: 32, walk_left: 65, walk_right: 68,action:16,down:83}) {
        this.px = startPoint[0];
        this.py = startPoint[1];
        this.velocity = { x: 0, y: 0 }
        this.canJump = false
        this.canWallJump = false;
        this.isHit = false
        this.isRunning = false
        this.FROZE = false;
        this.triggerBoxesTouched=[]
        this.hitbox={width:30,height:60}
        this.cont={right:false,left:false,jump:false,action:false,down:false}
        //KEEP THIS LESS THAN 1
        this.controlStat = 0.9;
        this.maxSpeed = 0.7
        this.hitHandler = { stun: 0, safe: 0 }
        this.controller = controllerMap
        this.Stats = { spd: Stats[0], mas: Stats[1], jmp: Stats[2], str: Stats[3] }
        this.AniDat = { facing: 1, walking: 0, falling: 0, jumping: 0, punching: 0 }
    }
    getPositionTile(x, y) {
        return { x: Math.round((x - (20 * sizeScale)) / (40 * sizeScale)), y: Math.round((y - (20 * sizeScale)) / (40 * sizeScale)) }
    }
    getIndexOfTile(x, y) {
        return (getPositionTile(x, y).y * gridSize.w) + getPositionTile(x, y).x
    }
    checkColl(inx, iny, w = this.hitbox.width * sizeScale, h = this.hitbox.height * sizeScale) {
        let output = []
        let output2 = []
        let output3 = []
        let x = inx * sizeScale
        let y = iny * sizeScale
        let px;
        let py;
        let output4=[]
        if (config.OptimizeCollisions) {
            let startInd = getIndexOfTile(x - (80 * sizeScale), y - (80 * sizeScale))
            let endInd = getIndexOfTile(x + (80 * sizeScale), y + (80 * sizeScale))
            thingX = startInd
            thingY = endInd
            for (i = startInd; i < endInd; i++) {
                if (collison[i] == 1) {
                    px = ((i % gridSize.w) * (40 * sizeScale)) + (20 * sizeScale)
                    py = (Math.floor(i / gridSize.w) * (40 * sizeScale)) + (20 * sizeScale)
                    if (Math.abs(px - x) < (20 * sizeScale) + (w / 2) && Math.abs(py - y) < (20 * sizeScale) + (h / 2)) {
                        output.push(i)
                        output3.push(i)
                    }
                }
                else if (0 < collison[i]) {
                    px = ((i % gridSize.w) * (40 * sizeScale)) + (20 * sizeScale)
                    py = (Math.floor(i / gridSize.w) * (40 * sizeScale)) + (20 * sizeScale)
                    if (Math.abs(px - x) < (20 * sizeScale) + (w / 2) && Math.abs(py - y) < (20 * sizeScale) + (h / 2)) {
                        output2.push(Funcs[collison[i]])
                    }
                }

            }
        }
        else {
            for (i = 0; i < collison.length; i++) {
                if (collison[i] == 1) {
                    px = ((i % gridSize.w) * (40 * sizeScale)) + (20 * sizeScale)
                    py = (Math.floor(i / gridSize.w) * (40 * sizeScale)) + (20 * sizeScale)
                    if (Math.abs(px - x) < (20 * sizeScale) + (w / 2) && Math.abs(py - y) < (20 * sizeScale) + (h / 2)) {
                        output.push(i)
                    }
                }
                else if (0 < collison[i]) {
                    px = ((i % gridSize.w) * (40 * sizeScale)) + (20 * sizeScale)
                    py = (Math.floor(i / gridSize.w) * (40 * sizeScale)) + (20 * sizeScale)
                    if (Math.abs(px - x) < (20 * sizeScale) + (w / 2) && Math.abs(py - y) < (20 * sizeScale) + (h / 2)) {
                        output2.push(collison[i])
                    }
                }

            }
        }
        for (let i = 0; i < Classes.length; i++) {

            if (Classes[i].collideData.trigger == "Solid") {
                px = Classes[i].x
                py = Classes[i].y
                
                let tarW = Classes[i].collideData.width / 2
                let tarH = Classes[i].collideData.height / 2
                if (Math.abs(px - x) < (tarW * sizeScale) + (w / 2) && Math.abs(py - y) < (tarH * sizeScale) + (h / 2)) {
                    output.push(Classes[i])
                }
            }
            else if(Classes[i].collideData.trigger=="Custom"){
                px = Classes[i].x*sizeScale
                py = Classes[i].y*sizeScale
                let tarW = Classes[i].collideData.width / 2
                let tarH = Classes[i].collideData.height / 2
                if (Math.abs(px - x) < (tarW * sizeScale) + (w / 2) && Math.abs(py - y) < (tarH * sizeScale) + (h / 2)) {
                    output4.push(Classes[i].collideData.collideID)
            }
            }
            else {
                px = Classes[i].x*sizeScale
                py = Classes[i].y*sizeScale
                let tarW = Classes[i].collideData.width / 2
                let tarH = Classes[i].collideData.height / 2
                if (Math.abs(px - x) < (tarW * sizeScale) + (w / 2) && Math.abs(py - y) < (tarH * sizeScale) + (h / 2)) {
                    
                    output2.push(Classes[i].collideData.trigger)
                }
            }
        }
        if (!this.checkLevelMove(x, y)) {
            output.push(0)
        }
        //    if (<x<)
        return { Solids: output, Other: output2, RealSolids: output3,triggerBoxes:output4 }
    }
    checkLevelMove(inx, iny) {
        let lastLevelIn = levelSelected
        let lastPosX = this.px
        let lastPosY = this.py
        if (inx < 0) {
            console.log("problem")
            if (levelLoader.levelMap[levelSelected].w) {
                console.log("test:" + levelLoader.levelMap[levelSelected].w)
                levelSelected = levelLoader.levelIds[levelLoader.levelMap[levelSelected].w]
                this.px = gameSize.w - inx


            } else { return false };

        }
        else if (inx > sizeScale * gameSize.w) {
            console.log("problem1")
            if (levelLoader.levelMap[levelSelected].e) {
                console.log("test:" + levelLoader.levelMap[levelSelected].e)
                levelSelected = levelLoader.levelIds[levelLoader.levelMap[levelSelected].e]
                this.px = inx - sizeScale * gameSize.w

            } else { return false };


        }
        else if (iny < 0) {
            console.log("problem2")
            if (levelLoader.levelMap[levelSelected].n) {
                console.log("test:" + levelLoader.levelMap[levelSelected].n)
                levelSelected = levelLoader.levelIds[levelLoader.levelMap[levelSelected].n]
                this.py = gameSize.h - iny
            } else { return false };

        }
        else if (iny > sizeScale * gameSize.h) {
            console.log("problem3")
            if (levelLoader.levelMap[levelSelected].s) {
                console.log("test:" + levelLoader.levelMap[levelSelected].s)
                levelSelected = levelLoader.levelIds[levelLoader.levelMap[levelSelected].s]
                this.py = iny - sizeScale * gameSize.h

            } else { return false };

        }
        return true
    }
    renderMe() {
        game.rect(this.px * sizeScale, this.py * sizeScale, this.hitbox.width * sizeScale, this.hitbox.height * sizeScale)
    }
    playerReset() {
        this.px = startPoint[0]
        this.py = startPoint[1]
        levelSelected = startLevel
    }
    handleHit(thomg) {
        if (thomg.includes("Hit")) {
            if (!this.isHit) {
                this.isHit = true
                this.stun = millis() + 1000
                this.velocity.x = Math.random() * 10
                this.velocity.y = Math.random() * 10 - 5
                this.playerReset()
                deathCount+=1
                
                Notifier.Reset(Icons.Notifiy.Alert, "You ded", "get bozoed")
                achiveCheck()
            }
        }
        else {
            Notifier.StayUp = false
            this.isHit = false
        }
    }
    frameUpdate() {

        if (!EVERYONEFREEZE){
            if(this.checkColl(this.px, this.py).Solids.length>0){
                
            }
            if (touchMode) {
                this.cont = { 
                    right: touchBtns.right.isPressed, 
                    left: touchBtns.left.isPressed, 
                    jump: touchBtns.jump.isPressed, 
                    action: touchBtns.action.isPressed 
                }
                
            }else if(gamepad){
            this.cont = { 
                right: gamepad.buttons[15].pressed, 
                left: gamepad.buttons[14].pressed, 
                jump: gamepad.buttons[0].pressed, 
                action: gamepad.buttons[2].pressed,
                down: gamepad.buttons[13].pressed
            }
            }
            else {
                this.cont = {
                    right: keyIsDown(this.controller.walk_right),
                    left: keyIsDown(this.controller.walk_left),
                    jump: keyIsDown(this.controller.jump),
                    action: keyIsDown(this.controller.action),
                    down: keyIsDown(this.controller.down)
                }
            }
        let frameCheck = frameCount
        let stuffTouched=this.checkColl(this.px, this.py)
        this.triggerBoxesTouched=stuffTouched.triggerBoxes
        let thingsTouched = this.checkColl(this.px, this.py).Other
        if (thingsTouched.includes("End") && gamemode.online) {
            sendEndMessage()
        }
        if(thingsTouched.includes("Hit")){
            console.log("AAA")
        }
        if(stuffTouched.Solids.length>0){
            console.log("resolving collisions...")
            let tw=this.hitbox.width/2
            let th=this.hitbox.height/2
            let xVelo=0
            let yVelo=0
            let downRight=this.checkColl(this.px+tw,this.py+th,1,1).Solids
            if (downRight.length>0){
                xVelo-=1
                yVelo-=1
            }
            let upRight=this.checkColl(this.px+tw,this.py-th,1,1).Solids
            if (upRight.length>0){
                xVelo-=1
                yVelo+=1
            }
            let downLeft=this.checkColl(this.px-tw,this.py+th,1,1).Solids
            if (downLeft.length>0){
                xVelo+=1
                yVelo-=1
            }
            let upLeft=this.checkColl(this.px-tw,this.py-th,1,1).Solids
            if (upLeft.length>0){
                xVelo+=1
                yVelo+=1
            }
            this.px+=10*xVelo
            this.py+=10*yVelo
        }
        //start of stuff
        if (this.cont.jump && (this.canJump || thingsTouched.includes("Climb"))) {
            this.canJump = false
            this.velocity.y = -11
        }
        if(this.cont.down){
            this.hitbox.height=30
        }
        else{
            this.hitbox.height=60
        }
        //end of stuff
        this.handleHit(thingsTouched)
        if (!this.FROZE) {
            for (let U = 0; U < Math.round(deltaTime); U++) {
                if (!this.cont.jump) {
                    this.canWallJump = true
                }
                if (this.checkColl(this.px, this.py + (this.velocity.y*gravity)).Solids.length == 0) {
                    this.py += this.velocity.y*gravity

                    if (this.velocity.y < 10) {
                        this.velocity.y += 1
                    }

                }
                else {

                    if (this.velocity.y >0) {
                        this.canJump = true
                    }
                    this.velocity.y = 0
                }
                if (this.checkColl(this.px + (this.velocity.x), this.py).Solids.length == 0) {
                    this.px += this.velocity.x

                }
                else if (this.cont.action) {
                    this.velocity.y = 0.5;
                    this.velocity.x = 0;
                    if (this.cont.jump && this.canWallJump) {
                        this.canWallJump = false
                        if (this.checkColl(this.px - 10, this.py).Solids.length == 0) {
                            this.velocity.y = -15
                            this.velocity.x = -15
                        }
                        else {
                            this.velocity.y = -15
                            this.velocity.x = 15
                        }
                    }
                }


                if (this.canJump) {
                    if (this.cont.right && Math.abs(this.velocity.x) < 10 * this.maxSpeed) {
                        this.velocity.x += 1
                    }
                    else if (this.cont.left && Math.abs(this.velocity.x) < 10 * this.maxSpeed) {
                        this.velocity.x -= 1
                    }
                    else {
                        this.velocity.x *= 0.85 * this.controlStat
                    }
                }
                else {
                    if (this.cont.right && Math.abs(this.velocity.x) < 10 * this.maxSpeed) {
                        this.velocity.x += 0.2
                    }
                    else if (this.cont.left && Math.abs(this.velocity.x) < 10 * this.maxSpeed) {
                        this.velocity.x -= 0.2
                    }
                    else {
                        this.velocity.x *= 0.9 * this.controlStat
                    }
                }


            }
        }}
        
        this.renderMe()
    }
}