
export default class RandomParent{
    constructor(settings, data) {
        this.settings = settings
        this.data = data

        this.posX = 0
        this.posY = 0

        this.createSpawnPositions()

        this.type = 'RandomParent'


        // GENES
        this.speed = Math.random() * (1.2 - 0.8) + 0.8
        this.viewrangeGene = Math.random()
        this.hungerGene = Math.random()
        this.thirstGene = Math.random()
        this.matingGene = Math.random()
        this.healthGene = Math.random()
    }

    createSpawnPositions() {
        let ground = this.data.terrain.filter(cell => cell.type == 'ground')
        let randomCellIndex = Math.floor(Math.random() * ground.length)

        this.posX = ground[randomCellIndex].posX + ground[randomCellIndex].size
        this.posY = ground[randomCellIndex].posY + ground[randomCellIndex].size
    }
}