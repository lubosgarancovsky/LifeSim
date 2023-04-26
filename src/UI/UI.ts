import Gender from "../Human/Gender";
import Human from "../Human/Human";

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
      "#settings-secion"
    ) as HTMLDivElement;
    this.UIElements.cammandPopulationList = document.querySelector(
      "#command-section-population-list"
    ) as HTMLDivElement;

    this.UIElements.commandButton.addEventListener("click", () => {
      this.state.command = !this.state.command;
      if (this.state.command) {
        this.UIElements.commandSection.classList.remove("hidden");
      } else {
        this.UIElements.commandSection.classList.add("hidden");
      }
    });

    this.UIElements.settingsButton.addEventListener("click", () => {
      this.state.settings = !this.state.settings;
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
            <div class='ui-name'><span>${human.name}</span><span>Age: ${Math.floor(human.age)}</span></div>
            <div class=${human.gender === 0 ? "ui-male" : "ui-female"}>${
          human.gender === 0 ? "Male" : "Female"
        }</div>
            <div class='ui-unimportant'>${human.id}</div>
          </div>
          <div class='ui-card-middlepart'>
            <div class='ui-inventory-wrapper'>
              <div>Food: <span>${Math.round(human.inventory.food)}</span></div>
              <div>Water: <span>${Math.round(human.inventory.water)}</span></div>
            </div>
            <div class='ui-progressbars'>
              <div>Hunger: <progress id='pb-hunger' value=${ human.hunger} max="100"></progress></div>
              <div>Thirst: <progress id='pb-thirst' value=${human.thirst} max="100"></progress></div>
              <div>Mating: <progress id='pb-mating' value=${human.matingUrge} max="100"></progress></div>
              ${human.isPregnant ? `<div>Pregnancy: <progress id='pb-pregnancy' value=${human.pregnancyMeter} max="100"></progress></div>` : ''}
            </div>
          </div>
          <div class='ui-values'>
            <div><span>Has food:</span> <span class=${!!human.foundFoodObject ? 'ui-success' : 'ui-error'}>${!!human.foundFoodObject}</span></div>
            <div><span>Has water:</span> <span class=${!!human.foundWaterObject ? 'ui-success' : 'ui-error'}>${!!human.foundWaterObject}</span></div>
            <div><span>Has mate:</span> <span class=${!!human.foundMate ? 'ui-success' : 'ui-error'}>${!!human.foundMate}</span></div>
            <div><span>Path length:</span> <span>${human.path.length}</span></div>
          </div>
          <div class=ui-state>${human.state}</div>
        </div>`;
      });

      this.UIElements.cammandPopulationList.innerHTML = mappedHumans.join("");
    }
  }
}

export default UI;

/*
`
              <div class='ui-human-infocard' key=${index}>
                  <div class='ui-human-card-layout'>
                    <div>
                        <div>${human.name}</div>
                        <div class=${
                          human.gender === 0 ? "ui-male" : "ui-female"
                        }>${human.gender === 0 ? "Male" : "Female"}</div>
                        <div class='ui-unimportant'>${human.id}</div>
                        <div class='ui-inventory-wrapper'>
                          <div>Food: <span>${Math.round(
                            human.inventory.food
                          )}</span></div>
                          <div>Water: <span>${Math.round(
                            human.inventory.water
                          )}</span></div>
                        </div>
                        
                    </div>
                    <div class='ui-info-wrapper'>
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
                          <div>Pregnancy: <progress id='pb-pregnancy' value=${
                            human.pregnancyMeter
                          } max="100"></progress></div>
                        </div>
                        <div class='ui-values'>
                          <div><span>Has food:</span> <span>${!!human.foundFoodObject}</span></div>
                          <div><span>Has water:</span> <span>${!!human.foundWaterObject}</span></div>
                          <div><span>Has mate:</span> <span>${!!human.foundMate}</span></div>
                          <div><span>Path length:</span> <span>${
                            human.path.length
                          }</span></div>
                        </div>
                    </div>
                  </div>
              </div>
              `

*/
