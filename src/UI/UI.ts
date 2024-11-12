import Gender from "../Human/Gender";
import Human from "../Human/Human";
import Settings from "../Settings";

class UI {
  private population: any = {
    population: 0,
    males: 0,
    females: 0,
  };
  private UIElements: any = {
    population: null,
    males: null,
    females: null,
    commandButton: null,
    settingsButton: null,
    commandSection: null,
    settingsSection: null,
    cammandPopulationList: null,
  };
  private state: any = {
    command: false,
    settings: false,
  };
  private settingsNodes: any = {
    viewRange: null,
    subgrid: null,
    path: null,
    resources: null,
    resourceAmount: null,
    resourceItem: null,
    hud: null,
    food: null,
    water: null,
    preganancy: null,
    pregnancyChance: null,
    adultAge: null,
    growSpeed: null,
    males: null,
    females: null,
    tileSize: null,
    waterDensity: null,
    foodDensity: null,
    foodMaxAmount: null,
  };

  constructor() {
    this.UIElements.population = document.querySelector(
      "#ui-population-value-population"
    ) as HTMLSpanElement;
    this.UIElements.males = document.querySelector(
      "#ui-population-value-males"
    ) as HTMLSpanElement;
    this.UIElements.females = document.querySelector(
      "#ui-population-value-females"
    ) as HTMLSpanElement;
    this.UIElements.commandButton = document.querySelector(
      "#command-button"
    ) as HTMLButtonElement;
    this.UIElements.settingsButton = document.querySelector(
      "#settings-button"
    ) as HTMLButtonElement;
    this.UIElements.commandSection = document.querySelector(
      "#command-section"
    ) as HTMLDivElement;
    this.UIElements.settingsSection = document.querySelector(
      "#settings-section"
    ) as HTMLDivElement;
    this.UIElements.cammandPopulationList = document.querySelector(
      "#command-section-population-list"
    ) as HTMLDivElement;

    this.settingsNodes.viewRange = document.querySelector(
      "#viewRange"
    ) as HTMLInputElement;
    this.settingsNodes.subgrid = document.querySelector(
      "#subgrid"
    ) as HTMLInputElement;
    this.settingsNodes.path = document.querySelector(
      "#path"
    ) as HTMLInputElement;
    this.settingsNodes.resources = document.querySelector(
      "#resources"
    ) as HTMLInputElement;
    this.settingsNodes.resourceAmount = document.querySelector(
      "#resourceAmount"
    ) as HTMLInputElement;
    this.settingsNodes.resourceItem = document.querySelector(
      "#resourceItem"
    ) as HTMLInputElement;

    this.settingsNodes.males = document.querySelector(
      "#males"
    ) as HTMLInputElement;
    this.settingsNodes.females = document.querySelector(
      "#females"
    ) as HTMLInputElement;
    this.settingsNodes.hud = document.querySelector("#hud") as HTMLInputElement;
    this.settingsNodes.food = document.querySelector(
      "#food"
    ) as HTMLInputElement;
    this.settingsNodes.water = document.querySelector(
      "#water"
    ) as HTMLInputElement;
    this.settingsNodes.pregnancy = document.querySelector(
      "#pregnancy"
    ) as HTMLInputElement;
    this.settingsNodes.adultAge = document.querySelector(
      "#adultAge"
    ) as HTMLInputElement;
    this.settingsNodes.pregnancyChance = document.querySelector(
      "#chance"
    ) as HTMLInputElement;

    this.settingsNodes.growSpeed = document.querySelector(
      "#growSpeed"
    ) as HTMLInputElement;
    this.settingsNodes.tileSize = document.querySelector(
      "#tileSize"
    ) as HTMLInputElement;
    this.settingsNodes.waterDensity = document.querySelector(
      "#waterDensity"
    ) as HTMLInputElement;
    this.settingsNodes.foodDensity = document.querySelector(
      "#foodDensity"
    ) as HTMLInputElement;
    this.settingsNodes.foodMaxAmount = document.querySelector(
      "#foodMaxAmount"
    ) as HTMLInputElement;

    //DEBUG
    this.settingsNodes.viewRange.addEventListener("change", (e) => {
      Settings.settings.debug.viewRange = e.target.checked;
    });

    this.settingsNodes.subgrid.addEventListener("change", (e) => {
      Settings.settings.debug.subgrid = e.target.checked;
    });

    this.settingsNodes.path.addEventListener("change", (e) => {
      Settings.settings.debug.path = e.target.checked;
    });

    this.settingsNodes.resources.addEventListener("change", (e) => {
      Settings.settings.debug.resources = e.target.checked;
    });

    this.settingsNodes.resourceAmount.addEventListener("change", (e) => {
      Settings.settings.debug.resourceAmount = e.target.checked;
    });

    this.settingsNodes.resourceItem.addEventListener("change", (e) => {
      Settings.settings.debug.resourceItem = e.target.checked;
    });

    // GAME
    this.settingsNodes.males.addEventListener("change", (e) => {
      Settings.settings.game.males = e.target.value;
    });

    this.settingsNodes.females.addEventListener("change", (e) => {
      Settings.settings.game.females = e.target.value;
    });

    this.settingsNodes.hud.addEventListener("change", (e) => {
      Settings.settings.game.hud = e.target.checked;
    });

    this.settingsNodes.food.addEventListener("change", (e) => {
      Settings.settings.game.foodInventoryLimit = e.target.value;
    });

    this.settingsNodes.water.addEventListener("change", (e) => {
      Settings.settings.game.waterInventoryLimit = e.target.value;
    });

    this.settingsNodes.pregnancy.addEventListener("change", (e) => {
      Settings.settings.game.pregnancyMeterSpeed = e.target.value;
    });

    this.settingsNodes.pregnancyChance.addEventListener("change", (e) => {
      Settings.settings.game.pregnancyChance = e.target.value;
    });

    this.settingsNodes.adultAge.addEventListener("change", (e) => {
      Settings.settings.game.adultAge = e.target.value;
    });

    // World
    this.settingsNodes.growSpeed.addEventListener("change", (e) => {
      Settings.settings.world.foodGrowingSpeed = e.target.value;
    });

    this.settingsNodes.tileSize.addEventListener("change", (e) => {
      Settings.settings.world.tileSize = e.target.value;
    });

    this.settingsNodes.waterDensity.addEventListener("change", (e) => {
      Settings.settings.world.waterDensity = e.target.value;
    });

    this.settingsNodes.foodDensity.addEventListener("change", (e) => {
      Settings.settings.world.foodDensity = e.target.value;
    });

    this.settingsNodes.foodMaxAmount.addEventListener("change", (e) => {
      Settings.settings.world.foodMaxAmount = e.target.value;
    });

    this.UIElements.commandButton.addEventListener("click", () => {
      this.state.command = !this.state.command;
      if (this.state.command) {
        this.UIElements.commandSection.classList.remove("hidden");
      } else {
        this.UIElements.commandSection.classList.add("hidden");
      }

      if (this.state.settings) {
        this.state.settings = false;
        this.UIElements.settingsSection.classList.add("hidden");
      }
    });

    this.UIElements.settingsButton.addEventListener("click", () => {
      this.state.settings = !this.state.settings;
      if (!!this.state.settings) {
        this.UIElements.settingsSection.classList.remove("hidden");
      } else {
        this.UIElements.settingsSection.classList.add("hidden");
      }

      if (this.state.command) {
        this.state.command = false;
        this.UIElements.commandSection.classList.add("hidden");
      }
    });
  }

  humanChange(gender: Gender, val: number) {
    this.population.population += val;
    this.UIElements.population.innerHTML = this.population.population;

    if (gender === Gender.MALE) {
      this.population.males += val;
      this.UIElements.males.innerHTML = this.population.males;
    }

    if (gender === Gender.FEMALE) {
      this.population.females += val;
      this.UIElements.females.innerHTML = this.population.females;
    }
  }

  drawPopulationList(population: Human[]) {
    if (!!this.state.command && !!population.length) {
      const mappedHumans = population.map((human, index) => {
        return `
        <div class='ui-human-infocard' key=${index}>
          <div>
            <div class='ui-name'><span>${
              human.name
            }</span><span>Age: ${Math.floor(human.age)}</span></div>
            <div class=${human.gender === 0 ? "ui-male" : "ui-female"}>${
          human.gender === 0 ? "Male" : "Female"
        }</div>
            <div class='ui-unimportant'>${human.id}</div>
          </div>
          <div class='ui-card-middlepart'>
            <div class='ui-inventory-wrapper'>
              <div>Food: <span>${Math.round(human.inventory.food)}</span></div>
              <div>Water: <span>${Math.round(
                human.inventory.water
              )}</span></div>
            </div>
            <div class='ui-progressbars'>
              <div>Hunger: <progress id='pb-hunger' value=${
                human.hunger
              } max="100"></progress></div>
              <div>Thirst: <progress id='pb-thirst' value=${
                human.thirst
              } max="100"></progress></div>
              <div>Mating: <progress id='pb-mating' value=${
                human.matingUrge
              } max="100"></progress></div>
              ${
                human.isPregnant
                  ? `<div>Pregnancy: <progress id='pb-pregnancy' value=${human.pregnancyMeter} max="100"></progress></div>`
                  : ""
              }
            </div>
          </div>
          <div class='ui-values'>
            <div><span>Has food:</span> <span class=${
              !!human.foundFoodObject ? "ui-success" : "ui-error"
            }>${!!human.foundFoodObject}</span></div>
            <div><span>Has water:</span> <span class=${
              !!human.foundWaterObject ? "ui-success" : "ui-error"
            }>${!!human.foundWaterObject}</span></div>
            <div><span>Has mate:</span> <span class=${
              !!human.foundMate ? "ui-success" : "ui-error"
            }>${!!human.foundMate}</span></div>
            <div><span>Path length:</span> <span>${
              human.path.length
            }</span></div>
          </div>
          <div class=ui-state>${human.state}</div>
        </div>`;
      });

      this.UIElements.cammandPopulationList.innerHTML = mappedHumans.join("");
    }
  }

  resetPopulation() {
    this.population.population = 0;
    this.population.males = 0;
    this.population.females = 0;
    this.UIElements.population.innerHTML = this.population.population;
    this.UIElements.males.innerHTML = this.population.males;
    this.UIElements.females.innerHTML = this.population.females;
  }
}

export default UI;
