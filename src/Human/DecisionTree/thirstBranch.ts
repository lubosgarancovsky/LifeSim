import Human from "../Human";
import { MoveLeaf } from "./DecisionTree";
import { Node } from "./TreeNode";
import { HasMateBranch } from "./matingBranch";

// Checks if is thirsty -> T: Has water in inventory? | F: Wants to mate ?
export class ThirstCheckBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new HasWaterInInventoryBranch();
    this.falseNode = new HasMateBranch();
  }

  evaluate(human: Human): boolean {
    if (human.thirst > 50) {
      this.trueNode.evaluate(human);
      return true;
    }
    this.falseNode.evaluate(human);
    return false;
  }
}

// Checks for water in inventory -> T: Drinks water | F: Checks if has water resource
export class HasWaterInInventoryBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new StartDrinkingLeaf();
    this.falseNode = new HasWaterObjectBranch();
  }

  evaluate(human: Human): boolean {
    if (human.inventory.water > 0) {
      this.trueNode.evaluate(human);
      return true;
    }
    this.falseNode.evaluate(human);
    return false;
  }
}

// Check if has a water object to eat from -> T: Checks if has walked whole path | F: Looks for water
export class HasWaterObjectBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new HasReachedEndOfPathToWaterBranch();
    this.falseNode = new LookForWaterLeaf();
  }

  evaluate(human: Human): boolean {
    if (!!human.foundWaterObject) {
      this.trueNode.evaluate(human);
      return true;
    }

    this.falseNode.evaluate(human);
    return false;
  }
}

// Checks if is at the water resource -> T: Drinks it | F: Moves towards it
export class HasReachedEndOfPathToWaterBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new StartDrinkingLeaf();
    this.falseNode = new MoveLeaf();
  }

  evaluate(human: Human): boolean {
    if (!human.path.length) {
      this.trueNode.evaluate(human);
      return true;
    }

    this.falseNode.evaluate(human);
    return false;
  }
}

// Leaf -> Looks for water resource
export class LookForWaterLeaf extends Node {
  evaluate(human: Human): boolean {
    const water = human.findWaterResource();
    if (!water) {
      human.move();
    }
    return true;
  }
}

// Leaf -> Handles food resource when hungry
export class DrinkWaterLeaf extends Node {
  evaluate(human: Human): boolean {
    human.handleDrinking();
    return true;
  }
}

export class StartDrinkingLeaf extends Node {
  evaluate(human: Human): boolean {
    human.isDrinking = true;
    human.state = "Drinking";
    return true;
  }
}
