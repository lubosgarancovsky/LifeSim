import Human from "../Human";
import { MoveLeaf } from "./DecisionTree";
import { Node } from "./TreeNode";
import { HasFoodObjectBranch } from "./collectingBranch";

export class HasMateBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new IsAtMateBranch();
    this.falseNode = new MatingCheckBranch();
  }

  evaluate(human: Human): boolean {
    if (!!human.foundMate) {
      this.trueNode.evaluate(human);
      return true;
    }

    this.falseNode.evaluate(human);
    return false;
  }
}

export class MatingCheckBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new FindMateLeaf();
    this.falseNode = new HasFoodObjectBranch();
  }

  evaluate(human: Human): boolean {
    if (human.matingUrge > 90) {
      this.trueNode.evaluate(human);
      return true;
    }

    this.falseNode.evaluate(human);
    return false;
  }
}

export class IsAtMateBranch extends Node {
  trueNode: Node;
  falseNode: Node;

  constructor() {
    super();
    this.trueNode = new StartMatingLeaf();
    this.falseNode = new MoveLeaf();
  }

  evaluate(human: Human): boolean {
    if (!!human.path.length) {
      this.falseNode.evaluate(human);
      return false;
    }

    this.trueNode.evaluate(human);
    return true;
  }
}

export class FindMateLeaf extends Node {
  evaluate(human: Human): boolean {
    human.findMate();
    return true;
  }
}

export class MatingLeaf extends Node {
  evaluate(human: Human): boolean {
    human.handleMating();
    return true;
  }
}

export class StartMatingLeaf extends Node {
  evaluate(human: Human): boolean {
    human.state = "Mating";
    human.isMating = true;
    return true;
  }
}
