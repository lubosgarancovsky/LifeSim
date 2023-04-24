import Human from "../Human";
import { Node } from "./TreeNode";
import { CollectingNode } from "./collectingBranch";
import { EatFoodLeaf, HungerCheckBranch } from "./hungerBranch";
import { MatingLeaf } from "./matingBranch";
import { DrinkWaterLeaf } from "./thirstBranch";

// Main branch -> checks if human is doing some action
export class HumanDecisionTree extends Node {
  isEatingNode: Node;
  isDrinkingNode: Node;
  isMatingNode: Node;
  isCollectingNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.isEatingNode = new EatFoodLeaf();
    this.isDrinkingNode = new DrinkWaterLeaf();
    this.isMatingNode = new MatingLeaf();
    this.isCollectingNode = new CollectingNode();
    this.falseNode = new HungerCheckBranch();
  }

  evaluate(human: Human) {
    if (human.isEating) {
      this.isEatingNode.evaluate(human);
      return true;
    }

    if (human.isDrinking) {
      this.isDrinkingNode.evaluate(human);
      return true;
    }

    if (human.isCollecting) {
      this.isCollectingNode.evaluate(human);
      return true;
    }

    if (human.isMating) {
      this.isMatingNode.evaluate(human);
      return true;
    }

    this.falseNode.evaluate(human);
    return false;
  }
}

export class MoveLeaf extends Node {
  evaluate(human: Human): boolean {
    human.move();
    return true;
  }
}
