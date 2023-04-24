class Inventory {
  water: number;
  food: number;

  constructor() {
    this.food = 0;
    this.water = 0;
  }

  addWater(val: number) {
    this.water += val;
  }

  addFood(val: number) {
    this.food += val;
  }

  removeWater(val: number) {
    this.water -= val;
  }

  removeFood(val: number) {
    this.food -= val;
  }
}

export default Inventory;
