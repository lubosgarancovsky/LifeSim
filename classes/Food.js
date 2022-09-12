export default class Food {
    constructor(posX, posY, surface, tileSize) {
        this.posX = posX
        this.posY = posY
        this.surface = surface

        this.isEaten = false
        this.size = tileSize * 0.2

        this.growTimeout = null
    }

    draw() {
        if (!this.isEaten) {
            this.surface.beginPath()
            this.surface.fillStyle = 'rgb(1, 112, 6)'
            this.surface.arc(this.posX, this.posY, this.size, 0, Math.PI * 2)
            this.surface.fill()
        }
    }

    update() {
        this.draw()
    }

    getEaten() {
        this.isEaten= true
        this.growTimeout = setTimeout(()=>{
            this.isEaten = false
            clearTimeout(this.growTimeout)
            this.growTimeout = null
        },(Math.random() * (3000 - 1000) + 1000)*10)

        return () => {
            clearTimeout(this.growTimeout)
        }
    }
}