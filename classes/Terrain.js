import Tile from './Tile'
import perlinNoise3d from 'perlin-noise-3d'

export default class Terrain {
    constructor(surface, settings) {
        this.WIDTH = settings.width
        this.HEIGHT = settings.height
        this.surface = surface
        this.settings = settings

        this.countX = this.settings.x + 1
        this.tileSize = Math.round(this.WIDTH / this.countX)
        this.countY = Math.round(this.HEIGHT / this.tileSize) + 1


        this.GRID = []
        this.WATER = []

        this.createGrid()
    }
    
    createGrid() {
        const perlin = new perlinNoise3d()

        for(var x = 0; x < this.countX; x++){
            for(var y = 0; y < this.countY; y++){
                
                let noise = perlin.get(x/10 , y/10)

                if (noise < this.settings.water) {
                    let tile = new Tile(x, y, this.tileSize, this.surface, 'water')
                    this.GRID.push(tile)
                    this.WATER.push(tile)
                } else {
                    this.GRID.push(new Tile(x, y, this.tileSize, this.surface, 'ground'))
                }
            }
       }
    }

    update() {
        this.GRID.forEach((tile) => tile.draw())
    }
}

