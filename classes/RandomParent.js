
import { Utils} from "./Utils"

export default class RandomParent{
    constructor(settings, data) {
        this.settings = settings
        this.data = data

        this.posX = 0
        this.posY = 0

        this.createSpawnPositions()

        this.type = 'RandomParent'


        // GENES
        this.speed = Utils.randomize(0.8, 1.2)
        this.viewrangeGene = Utils.randomize()
        this.hungerGene = Utils.randomize()
        this.thirstGene = Utils.randomize()
        this.matingGene = Utils.randomize()
        this.healthGene = Utils.randomize()
    }

    createSpawnPositions() {
        let ground = this.data.terrain.filter(cell => cell.type == 'ground')
        let randomCellIndex = Math.floor(Math.random() * ground.length)

        this.posX = ground[randomCellIndex].posX + ground[randomCellIndex].size
        this.posY = ground[randomCellIndex].posY + ground[randomCellIndex].size
    }
}