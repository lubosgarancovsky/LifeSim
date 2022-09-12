import { Utils } from "./Utils"

export default class Person {
    constructor(gender, settings, surface, father, mother, data, population) {

        // Initial values
        this.posX = mother.posX
        this.posY = mother.posY
        this.gender = gender
        this.settings = settings
        this.surface = surface
        this.father = father
        this.mother = mother

        this.type = 'Person'

        this.age = this.father.type == 'Person' ? 0 : Math.floor(Math.random() * (30 - 10) + 10) + Math.random()
        this.prevAge = this.father.type == 'Person' ? 0 : this.age - 1

        this.size = (this.settings.width / this.settings.x) * 0.2
        this.adultSize = this.size * 1.2
        this.status = 'Wandering'

        this.data = data
        this.population = population

        if (this.gender == 'M') {
            this.color = 'rgb(0, 206, 237)'
        } else {
            this.color = 'rgb(227, 2, 77)'
        }

        this.pregnantColor = 'rgb(84, 0, 0)'

        this.destX = 0
        this.destY = 0

        this.isWaiting = false
        this.isPregnant = false
        this.isAdult = false
        this.isAlive = true
        this.isSick = false

        this.isEating = false
        this.isDrinking = false
        this.isMating = false

        this.lastGotSick = 0

        this.randomDestination()

        // GENES
        this.speed = (father.speed + mother.speed) / 2
       
        // Gene is a number between 0 and 1, higher number => better gene
        this.viewrangeGene = (father.viewrangeGene + mother.viewrangeGene) / 2
        this.hungerGene = (father.hungerGene + mother.hungerGene) / 2
        this.thirstGene = (father.thirstGene + mother.thirstGene) / 2
        this.matingGene = (father.matingGene + mother.matingGene) / 2
        this.healthGene = (father.healthGene + mother.healthGene) / 2


        
        this.viewrange = (this.viewrangeGene * this.adultSize * 10) + this.adultSize * 8

        this.atractivity = Math.round((this.viewrangeGene + this.hungerGene + this.thirstGene + this.matingGene + this.healthGene) * 2)


        // NEEDS
        this.hunger = 0
        this.thirst = 0
        this.matingUrge = 0
        this.sickness = 0

        // OBJECTS
        this.FOOD = null
        this.WATER = null
        this.MATE = null
        this.CHILDREN = []

        this.lastFood = null
        this.lastWater = null

        this.timer = null

    }

    update() {
        this.move()
        this.handleNeeds()
        this.handleAge()
        this.handleSickness()
        this.communicate()
        this.draw()
    }

    draw() {
        // VIEWRANGE
        if (this.settings.viewrange) {
            this.surface.beginPath()
            this.surface.arc(this.posX, this.posY, this.viewrange, 0, Math.PI * 2)
            this.surface.fillStyle = 'rgba(255, 255, 255, 0.1)'
            this.surface.strokeStyle = 'rgba(255, 255, 255, 0.5)'
            this.surface.fill()
            this.surface.stroke()
        }

        if (this.settings.hud) {
            // HUD background
            this.surface.beginPath()
            this.surface.fillStyle = this.isSick ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
            this.surface.fillRect(this.posX - 25, this.posY - this.size - 24, 50, 12)

            // HUNGER
            this.surface.beginPath()
            this.surface.fillStyle = 'rgba(250, 128, 52, 1)'
            this.surface.fillRect(this.posX - 25, this.posY - this.size - 24, (this.hunger / 2), 3)

            // THIRST
            this.surface.beginPath()
            this.surface.fillStyle = 'rgba(110, 245, 255, 1)'
            this.surface.fillRect(this.posX - 25, this.posY - this.size - 21, (this.thirst / 2), 3)

            // MATING
            this.surface.beginPath()
            this.surface.fillStyle = 'rgba(247, 54, 151, 1)'
            this.surface.fillRect(this.posX - 25, this.posY - this.size - 18, (this.matingUrge / 2), 3)

            // SICKNESS
            this.surface.beginPath()
            this.surface.fillStyle = 'rgba(64, 255, 54, 1)'
            this.surface.fillRect(this.posX - 25, this.posY - this.size - 15, (this.sickness / 2), 3)

            // STATUS
            this.surface.font = '1rem Arial'
            this.surface.fillStyle = 'black'
            this.surface.textAlign = 'center'
            this.surface.fillText(`${this.atractivity} ${this.status}  ${Math.floor(this.age)}`, this.posX, this.posY + this.size*2 + 10)
        }

        // BODY
        this.surface.beginPath()
        this.surface.arc(this.posX, this.posY, this.size, 0, Math.PI * 2)
        this.surface.fillStyle = this.isPregnant ? this.pregnantColor : this.color
        this.surface.fill()

        if (this.settings.dot) {
            // DOT
            this.surface.beginPath()
            this.surface.arc(this.destX, this.destY, 1, 0, Math.PI * 2)
            this.surface.fillStyle = 'yellow'
            this.surface.fill()
        }
    }

    move() {
        if (!this.isWaiting) {
            var distance = +Math.hypot(this.posX - this.destX, this.posY - this.destY)
            var radians = Math.atan2(this.destY - this.posY, this.destX - this.posX)

            var dx = Math.cos(radians) * this.speed
            var dy = Math.sin(radians) * this.speed

            if (distance > 1 && !this.waterCheck()) {
                this.posX += dx
                this.posY += dy
            } else {
                this.randomDestination()
            }
        }
    }

    waterCheck() {
        if (this.WATER == null) {
            for (let watercell of this.data.water) {
                if (this.destX <= watercell.posX + watercell.size && this.destY <= watercell.posY + watercell.size) {
                    if (this.destX >= watercell.posX && this.destY >= watercell.posY) {
                        return true
                    }
                }
            }
        }

        return false
    }

    randomDestination() {
        let x = this.posX + (Math.random() * (this.viewrange + this.viewrange) - this.viewrange)
        let y = this.posY + (Math.random() * (this.viewrange + this.viewrange) - this.viewrange)


        // boundaries, so person doesnt leave screen
        if (x > this.settings.width) x = this.settings.width
        if (x < 0) x = 0
        if (y > this.settings.height) y = this.settings.height
        if (y < 0) y = 0

        this.destX = x
        this.destY = y

        this.status = 'Wandering'
    }

    handleNeeds() {

        // Increasing needs after every frame
        this.hunger += (1 - this.hungerGene) / 10
        this.thirst += (1 - this.thirstGene) / 10

        if (this.isAdult)
            this.matingUrge += ((Math.sqrt(this.matingGene) / (this.age/15))) / 10

        // boundaries at 100%
        if (this.hunger > 100) {
            this.hunger = 100
            this.isAlive = false
        }

        if (this.thirst > 100) {
            this.thirst = 100
            this.isAlive = false
        }

        if (this.matingUrge > 100) this.matingUrge = 100


        // boundaries at 0%
        if (this.hunger < 0) this.hunger = 0
        if (this.thirst < 0) this.thirst = 0
        if (this.matingUrge < 0) this.matingUrge = 0

            if (this.isEating) {
                this.hunger -= 1
            }

            if (this.isDrinking) {
                this.thirst -= 1
            }

            if (this.isMating) {
                this.matingUrge -= 0.7
            }



        this.findFood()
        this.goEat()

        this.findWater()
        this.goDrink()

        this.goMate()
    }

    findFood() {

        // If is hungry but didnt find food yet
        if (this.hunger > 50 && this.isEating == false) {

            let closestFood = this.data.foodmap[0]
            let minDistance = 10000

            // Iterates through all food items and finds the closest one within viewrange
            for (let item of this.data.foodmap) {
                if (!item.isEaten) {
                    let distance = Math.hypot(this.posX - item.posX, this.posY - item.posY)

                    if (distance < minDistance) {
                        minDistance = distance
                        closestFood = item
                    }
                }
            }

            if (minDistance <= this.viewrange + this.size) {
                this.FOOD = closestFood
                return
            }
        }

        if (this.hunger >= 75 && this.FOOD == null) {
            if (this.lastFood != null) {
                if (!this.lastFood.isEaten) {
                    this.FOOD = this.lastFood
                }
            }
        }
    }

    goEat() {
        if (this.FOOD && !this.FOOD.isEaten) {
            this.destX = this.FOOD.posX
            this.destY = this.FOOD.posY

            let distance = Math.hypot(this.posX - this.FOOD.posX, this.posY - this.FOOD.posY)
            this.status = 'Going to eat'

            if (distance < 1) {
                this.lastFood = this.FOOD

                this.isEating = true
                this.status = 'Eating'

                this.FOOD.getEaten()
                this.FOOD = null
                this.getSick(2)

                this.wait(2000)


            }
        }

        if (this.FOOD && this.FOOD.isEaten) {
            this.FOOD = null
        }
    }

    findWater() {
        // If is thirsty but didnt find water yet
        if (this.thirst > 50 && this.isDrinking == false) {

            let closestWater = this.data.water[0]
            let minDistance = 10000

            // Iterates through all water cells and finds the closest one within viewrange
            for (let item of this.data.water) {
                let topLeft = Math.hypot(this.posX - item.posX, this.posY - item.posY)
                let topRight = Math.hypot(this.posX - item.posX + item.size, this.posY - item.posY)
                let bottomLeft = Math.hypot(this.posX - item.posX, this.posY - item.posY + item.size)
                let bottomRight = Math.hypot(this.posX - item.posX  + item.size, this.posY - item.posY  + item.size) 

                let distance = Utils.min([topLeft, topRight, bottomLeft, bottomRight]) 

                if (distance < minDistance) {
                    minDistance = distance
                    closestWater = item
                }
            }

            // if cell is within viewrange, it remebers it in WATER variable
            if (minDistance <= this.viewrange + this.size) {
                this.WATER = closestWater
                return
            }
        }
        
        if(this.thirst >= 70 && this.WATER == null) {
            if(this.lastWater != null) {
                this.WATER = this.lastWater
            }
        }
    }

    goDrink() {
        if (this.WATER) {
            let centerX = this.WATER.posX + this.WATER.size / 2
            let centerY = this.WATER.posY + this.WATER.size / 2

            this.destX = centerX
            this.destY = centerY

            let distance = Math.hypot(this.posX - centerX, this.posY - centerY)

            this.status = 'Going to drink'

            if (distance < 1) {
                this.lastWater = this.WATER
                this.WATER = null
                this.isDrinking = true
                this.status = 'Drinking'

                this.getSick(3)
                this.wait(2000)


            }
        }
    }

    goMate() {
        if (this.MATE) {
            // if partner died on the way, it removes him as mate
            if(!this.MATE.isAlive) {
                this.MATE = null
                return
            }

            this.destX = this.MATE.posX
            this.destY = this.MATE.posY

            let distance = Math.hypot(this.posX - this.destX, this.posY - this.destY)

            this.status = 'Going to mate'

            if (distance < 1) {
                this.status = 'Mating'

                this.isMating = true

                if (this.gender == 'F') {
                    this.getPregnant(this.MATE)
                } else {
                    this.MATE.getPregnant(this)
                }

                this.MATE = null
                this.wait(2000)
            }
        }
    }

    answearMatingRequest(partner) {
        let modificator = this.matingUrge >= 100 - (this.settings.mating * partner.atractivity) 
        return modificator
    }

    getPregnant(father) {
        if (!this.isPregnant) {

            let changeToGetPregnant = Math.random()
            let numberOfChildrenChance = Math.random()
            let numberOfChildren = 1

            if (changeToGetPregnant > 0.3) {
                this.isPregnant = true

                if (numberOfChildrenChance < 0.2) {
                    numberOfChildren = 2
                }

                if (numberOfChildrenChance < 0.08) {
                    numberOfChildren = 3
                }

                const pregnancyTimer = setTimeout(() => {
                    for (let i = 0; i < numberOfChildren; i++) {
                        let childGenderChance = Math.random()
                        let gender = childGenderChance >= 0.5 ? 'M' : 'F'

                        this.CHILDREN.push(new Person(gender, this.settings, this.surface, father, this, this.data, this.population))
                    }

                    this.isPregnant = false
                    clearTimeout(pregnancyTimer)
                }, this.settings.pregnancyDuration)
            }
        }
    }

    handleAge() {
        // AGE handling
        this.age += 0.004

        if (this.age >= 15) {
            this.isAdult = true
        }

        if (this.isAdult) {
            this.size = this.adultSize
        }

        if (Math.floor(this.age) > this.prevAge) {
             // DEATH FROM OLD AGE
            let chanceToDie = Math.random()
            let formula = (this.age/100) / (100-(this.sickness/5) - this.age)


            if (chanceToDie <= formula) {
                this.isAlive = false
            }
    
            this.prevAge = Math.floor(this.age)
        }
    }

    handleSickness() {
        if (this.isSick) {
            this.sickness += (1 - this.healthGene) / 10

            if (this.sickness > 100) {
                this.sickness = 100
                this.isAlive = false
            }

            for (let person of this.population) {
                let distance = Math.hypot(this.posX - person.posX, this.posY - person.posY)

                if (distance <= this.size*5 + this.size) {
                    person.getSick(40)
                }
            }

            

            let chanceToHeal = Math.random()
            if (chanceToHeal < (this.sickness/100000)) {
                this.isSick = false
                this.sickness = 0
            }
        }

    }

    getSick(chance) {
        if (this.age - this.lastGotSick >= 2) {
            let chanceToGetSick = Math.random()

            if (chanceToGetSick < ((this.healthGene * chance) / 100)) {
                this.isSick = true
                this.lastGotSick = this.age
            }
        }
    }

    communicate() {
        for (let person of this.population) {
            let distance = Math.hypot(this.posX - person.posX, this.posY - person.posY)

            if (distance <= this.viewrange + this.size) {

                // Ask for last food position
                if (this.lastFood == null) {
                    this.lastFood = person.lastFood
                }

                // Ask for last water position
                if (this.lastWater == null) {
                    this.lastWater = person.lastWater
                }

                // handle searching for mate
                if (person.gender != this.gender) {
                    let result_one = this.answearMatingRequest(person)
                    let result_two = person.answearMatingRequest(this)

                    if (result_one && result_two) {
                        this.MATE = person
                        person.MATE = this
                    }  
                }
            }
        }
    }

    wait(time) {
        this.isWaiting = true
        this.timer = setTimeout(() => {
            this.isWaiting = false
            this.isMating = false
            this.isEating = false
            this.isDrinking = false
            clearTimeout(timer)
            this.timer = null
        }, time)

        return () => {
            clearTimeout(this.timer)
        }
    }
}
