import Person from "./Person.js";
import RandomParent from "./RandomParent.js";

export default class Population {
    constructor(surface, settings, data) {
        this.surface = surface
        this.settings = settings
        this.data = data

        this.population = []

        this.createPopulation()

        this.maleAddButton = document.querySelector('#addMale').addEventListener('click', ()=>{this.addMale()})
        this.femaleAddButton = document.querySelector('#addFemale').addEventListener('click', ()=>{this.addFemale()})
        this.clearButton = document.querySelector('#clearPop').addEventListener('click', ()=>{this.population = []})
    }

    update() {

        this.population = this.population.filter((person) => person.isAlive)

        this.population.forEach((person) => {
            person.update()
            if (person.CHILDREN.length > 0) {
                this.population = this.population.concat(person.CHILDREN)
                person.CHILDREN = []
                person.isPregnant = false
            }
        })
        return this.population
    }

    createPopulation() {
        for (let i = 0; i < this.settings.male; i++) {
            const randomParent = new RandomParent(this.settings, this.data)
            this.population.push(new Person('M', this.settings, this.surface, randomParent, randomParent, this.data, this.population))
        }

        for (let i = 0; i < this.settings.female; i++) {
            const randomParent = new RandomParent(this.settings, this.data)
            this.population.push(new Person('F', this.settings, this.surface, randomParent, randomParent, this.data, this.population))
        }
    }

    addMale() {
        const randomParent = new RandomParent(this.settings, this.data)
        this.population.push(new Person('M', this.settings, this.surface, randomParent, randomParent, this.data, this.population))
    }

    addFemale() {
        const randomParent = new RandomParent(this.settings, this.data)
        this.population.push(new Person('F', this.settings, this.surface, randomParent, randomParent, this.data, this.population))
    }
}