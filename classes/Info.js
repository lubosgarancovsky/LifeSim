export default class Info {
    constructor(WIDTH, HEIGHT) {

        this.isOpen = false
        this.WIDTH = WIDTH
        this.HEIGHT = HEIGHT



        this.populationText = document.querySelector('#population')
        this.maleText = document.querySelector('#male')
        this.femaleText = document.querySelector('#female')

        this.settingsButton = document.querySelector('#settingsBtn').addEventListener('click', ()=>{this.toggleSettings()})
        this.settingsDiv = document.querySelector('.settings')

        this.screen = document.querySelector('.screen')


        // DEFAULT SETTINGS
        this.foodDensity = document.querySelector('#food').value = 15
        this.waterDensity = document.querySelector('#water').value = 35

        this.viewrange = document.querySelector('#viewrange').checked = false
        this.hud = document.querySelector('#hud').checked = true
        this.destination = document.querySelector('#destination').checked = false

        this.maleNum = document.querySelector('#malesCount').value = 10
        this.femaleNum = document.querySelector('#femalesCount').value = 10

        this.worldSize = document.querySelector('#worldSize').value = this.defaultSize()

    }

    update(populationArray) {
        let population = populationArray.length
        let men = populationArray.filter(person => person.gender == 'M').length

        this.populationText.innerText = `Population: ${population}`
        this.maleText.innerText = `Males: ${men}`
        this.femaleText.innerText = `Females: ${population - men}`
    }

    toggleSettings(){
        if(this.isOpen) {
            this.isOpen = false
            this.settingsDiv.classList.add('hidden')
        } else {
            this.isOpen = true
            this.settingsDiv.classList.remove('hidden')
        }
    }

    getSettings() {
        this.foodDensity = document.querySelector('#food').value
        this.waterDensity = document.querySelector('#water').value
        this.viewrange = document.querySelector('#viewrange').checked
        this.hud = document.querySelector('#hud').checked
        this.destination = document.querySelector('#destination').checked
        this.maleNum = document.querySelector('#malesCount').value
        this.femaleNum = document.querySelector('#femalesCount').value
        this.worldSize = +document.querySelector('#worldSize').value

        return {
            width: this.WIDTH,
            height: this.HEIGHT,
            food: this.foodDensity / 100,                 
            water: this.waterDensity / 100,                 
            x: this.worldSize,                        
            male: this.maleNum,                  
            female: this.femaleNum,                   
            viewrange: this.viewrange,            
            hud: this.hud,                   
            dot: this.destination,
            pregnancyDuration: 15000    
        }
    }

    defaultSize() {

        if (this.WIDTH <= 460) {
            return 24
        }

        if (this.WIDTH <= 724) {
            return 32
        }

        if (this.WIDTH <= 1100) {
            return 48
        }

        return 64
    }
}