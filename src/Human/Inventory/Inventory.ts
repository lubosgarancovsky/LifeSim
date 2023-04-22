class Inventory {
    wood: number;
    food: number;
    stone: number;

    constructor() {
        this.wood = 0;
        this.food = 0;
        this.stone = 0;
    }

    addWood(val: number) {
        this.wood += val;
    }

    addStone(val: number) {
        this.stone += val;
    }

    addFood(val: number) {
        this.food += val;
    }

    removeWood(val: number) {
        this.wood -= val;
    }

    removeStone(val: number) {
        this.stone -= val;
    }

    removeFood(val: number) {
        this.food -= val;
    }
}

export default Inventory;