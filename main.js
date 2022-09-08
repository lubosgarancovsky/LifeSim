import FoodMap from './classes/FoodMap'
import Terrain from './classes/Terrain'
import Population from './classes/Population'
import Info from './classes/Info'

const canvas = document.querySelector('.canvas')
const ctx = canvas.getContext("2d")

const app = document.querySelector('#app').getBoundingClientRect()

canvas.width = app.width
canvas.height = app.height

var WIDTH = canvas.width
var HEIGHT = canvas.height

var info = new Info(WIDTH, HEIGHT)

//var defaultSize = info.defaultSize()

var settings = info.getSettings()

var terrain = new Terrain(ctx, settings)
var foodmap = new FoodMap(ctx, settings, terrain.GRID)


var data = {
  terrain: terrain.GRID,
  water: terrain.WATER,
  foodmap: foodmap.FOOD
}

var populationArray = []
var population = new Population(ctx, settings, data)


const restartButton = document.querySelector('#applySettings').addEventListener('click', ()=>{
  init()
})

function init() {
  settings = info.getSettings()
  terrain = new Terrain(ctx, settings)
  foodmap = new FoodMap(ctx, settings, terrain.GRID)

  data = {
    terrain: terrain.GRID,
    water: terrain.WATER,
    foodmap: foodmap.FOOD
  }

  populationArray = []

  population = new Population(ctx, settings, data)
}


function gameloop(){
  terrain.update()
  foodmap.update()
  populationArray = population.update()
  info.update(populationArray)
  window.requestAnimationFrame(gameloop)
}

gameloop()


