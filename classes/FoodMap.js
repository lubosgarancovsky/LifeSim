import Food from './Food.js'

export default class FoodMap {
    constructor(surface, settings , grid) {
        this.settings = settings
        this.surface = surface
        this.GRID = grid

        this.WIDTH = settings.width
        this.HEIGHT = settings.heigth
        this.tileSize = Math.round(this.WIDTH / settings.x)
        this.FOOD = []

        this.createFood()
    }

    createFood() {
        var density = this.settings.food

        for (let i = 0, size = this.GRID.length; i < size; i++){
            let tile = this.GRID[i]
            var randomNumber = Math.random()
            if (tile.type === 'ground' && randomNumber < density) {
                let x = tile.posX + Math.round(tile.size/2)
                let y = tile.posY + Math.round(tile.size/2)
                this.FOOD.push(new Food(x, y, this.surface, this.tileSize))
            }
        }
    }

    update() {
        for (let i = 0; i < this.FOOD.length; i++) {
            this.FOOD[i].update()
        }
    }
}