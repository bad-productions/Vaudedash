class textButton {
    constructor(posX, posY, Width, Height, text, textColor, bgColor, showBg = false, callBack = function() {
    }) {
        this.position = {}
        this.position.x = posX
        this.position.y = posY
        this.width = Width
        this.height = Height
        this.Text = text
        this.textColor = textColor
        this.bgColor = bgColor
        this.showBg = showBg
        this.isPresssed = false
        this.isHover = false
        this.isReset = true
        this.sReset = true
        this.callBackFunc = callBack
    }
    Reset() {
        this.isReset = true
    }
    updateMe() {
        uiLayer.push()
        if (this.showBg) {
            uiLayer.fill(this.bgColor)
            uiLayer.rect(this.position.x, this.position.y, this.width, this.height)
        }
        uiLayer.fill(this.textColor)
        uiLayer.textAlign(CENTER)
        uiLayer.text(this.Text, this.position.x + (this.width / 2), this.position.y + (this.height / 2))
        uiLayer.pop()
        this.isHover = (this.position.x < mouseX < this.width && this.position.y < mouseY < this.height)
        this.isPresssed = (this.position.x < mouseX < this.width && this.position.y < mouseY < this.height && mouseIsPressed)
        if (!mouseIsPressed) {
            this.sReset = true
        }
        if (this.isPresssed && this.isReset && this.sReset) {
            this.isReset = false
            this.sReset = false
            this.callBackFunc()
        }
    }
}
class imageButton {
    constructor(posX, posY, Width, Height, myImage, callBack = function() {
    }) {
        this.position = {}
        this.position.x = posX
        this.position.y = posY
        this.width = Width
        this.height = Height
        this.Image = myImage
        this.isPressed = false
        this.isHover = false
        this.isReset = true
        this.sReset = true
        this.callBackFunc = callBack
    }
    Reset() {
        this.isReset = true
    }
    updateMe() {
        push()
        image(this.Image, this.position.x, this.position.y, this.width, this.height)
        pop()
        this.isHover = (this.position.x < mouseX < this.width && this.position.y < mouseY < this.height)
        this.isPressed = (this.position.x < mouseX < this.width+this.position.x && this.position.y < mouseY < this.height+this.position.y && mouseIsPressed)

        for (let touch of touches) {
            if (this.position.x < touch.x < this.width+this.position.x && this.position.y < touch.y < this.height+this.position.y) this.isPressed = true;
        }
        if (!this.isPressed) {
            this.sReset = true
        }
        if (this.isPressed && this.isReset && this.sReset) {
            this.isReset = false
            this.sReset = false
            this.callBackFunc()
        }
    }
}