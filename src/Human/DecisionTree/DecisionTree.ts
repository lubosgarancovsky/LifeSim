import Human from "../Human";
import { Node } from "./TreeNode";

// Main branch -> checks if human is doing some action
export class HumanDecisionTree extends Node {
  isEatingNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.isEatingNode = new EatFoodLeaf();
    this.falseNode = new HungerCheckBranch();
  }

  evaluate(human: Human) {
    if (human.isEating) {
      this.isEatingNode.evaluate(human);
      return true;
    }

    this.falseNode.evaluate(human);
    return false;
  }
}

// Checks if is hungry -> T: Has food in inventory? | F: Is Thirsty ?
export class HungerCheckBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new HasFoodInInventoryBranch();
    this.falseNode = new MoveLeaf();
  }

  evaluate(human: Human): boolean {
    if (human.hunger > 50) {
      this.trueNode.evaluate(human);
      return true;
    }
    this.falseNode.evaluate(human);
    return false;
  }
}

// Checks for food in inventory -> T: Eats food | F: Checks if has food resource
export class HasFoodInInventoryBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new StartEatingLeaf();
    this.falseNode = new HasFoodObjectBranch();
  }

  evaluate(human: Human): boolean {
    if (human.inventory.food > 0) {
      this.trueNode.evaluate(human);
      return true;
    }
    this.falseNode.evaluate(human);
    return false;
  }
}

// Check if has a food object to eat from -> T: Checks if has walked whole path | F: Looks for food
export class HasFoodObjectBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new HasReachedEndOfPathToFoodBranch();
    this.falseNode = new LookForFoodLeaf();
  }

  evaluate(human: Human): boolean {
    if (!!human.foundResource) {
      this.trueNode.evaluate(human);
      return true;
    }

    this.falseNode.evaluate(human);
    return false;
  }
}

// Checks if is at the food resource -> T: Eats it | F: Moves towards it
export class HasReachedEndOfPathToFoodBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new StartEatingLeaf();
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

// Leaf -> Looks for food resource
export class LookForFoodLeaf extends Node {
  evaluate(human: Human): boolean {
    const food = human.findFoodResource();
    if (!food) {
      human.move();
    }
    return true;
  }
}

// Leaf -> Handles food resource when hungry
export class EatFoodLeaf extends Node {
  evaluate(human: Human): boolean {
    human.handleEating();
    return true;
  }
}

export class StartEatingLeaf extends Node {
  evaluate(human: Human): boolean {
    human.isEating = true;
    human.state = "Eating";
    return true;
  }
}

export class MoveLeaf extends Node {
  evaluate(human: Human): boolean {
    human.move();
    return true;
  }
}

export class WanderLeaf extends Node {
  evaluate(human: Human): boolean {
    human.findRandomDestination();
    return true;
  }
}

export class NullLeaf extends Node {
  evaluate(human: Human): boolean {
    throw new Error("Null leaf called");
  }
}
