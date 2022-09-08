export default class Tile {
    constructor(x, y, size, surface, type) {
        this.x = x
        this.y = y
        this.posX = x * size
        this.posY = y * size
        this.surface = surface
        this.size = size
        this.type = type
    }

    draw() {
        this.surface.beginPath()
        this.surface.fillStyle = this.type == 'ground' ? 'rgb(3, 153, 2)' : 'rgb(2, 2, 181)'
        this.surface.fillRect(this.posX, this.posY, this.size, this.size)
    }
}