import Settings from "../../Settings";
import Human from "../Human";
import { MoveLeaf } from "./DecisionTree";
import { Node } from "./TreeNode";

export class HasFoodObjectBranch extends Node {
    trueNode: Node;
    falseNode: Node;
  
    constructor() {
      super();
      this.trueNode = new IsAtFoodBranch();
      this.falseNode = new HasWaterObjectBranch();
    }
  
    evaluate(human: Human): boolean {
      if (!!human.foundFoodObject) {
        this.trueNode.evaluate(human);
        return true;
      }
      this.falseNode.evaluate(human);
      return false;
    }
  }
  
  export class HasWaterObjectBranch extends Node {
    trueNode: Node;
    falseNode: Node;
  
    constructor() {
      super();
      this.trueNode = new IsAtWaterBranch();
      this.falseNode = new FindResourceLeaf();
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
  
  export class FindResourceLeaf extends Node {
    evaluate(human: Human): boolean {
      if (human.inventory.food < Settings.settings.game.foodInventoryLimit) {
        const food = human.findFoodResource();
  
        if (!!food) {
          return true;
        }
      }
  
      if (human.inventory.water < Settings.settings.game.waterInventoryLimit) {
        const water = human.findWaterResource();
        if (!!water) {
          return true;
        }
      }

      human.move();
      return false;
    }
  }
  
  export class IsAtFoodBranch extends Node {
    trueNode: Node;
    falseNode: Node;
  
    constructor() {
      super();
      this.trueNode = new StartCollectingLeaf();
      this.falseNode = new MoveLeaf();
    }
  
    evaluate(human: Human): boolean {
      if (!!human.path.length) {
        this.falseNode.evaluate(human);
        return true;
      }
  
      this.trueNode.evaluate(human);
      return false;
    }
  }
  
  export class IsAtWaterBranch extends Node {
    trueNode: Node;
    falseNode: Node;
  
    constructor() {
      super();
      this.trueNode = new StartCollectingLeaf();
      this.falseNode = new MoveLeaf();
    }
  
    evaluate(human: Human): boolean {
      if (!!human.path.length) {
        this.falseNode.evaluate(human);
        return true;
      }
  
      this.trueNode.evaluate(human);
      return false;
    }
  }
  
  export class StartCollectingLeaf extends Node {
    evaluate(human: Human): boolean {
      human.isCollecting = true;
      if (human.foundFoodObject) {
        human.state = "Collecting food";
        return true;
      }
  
      human.state = "Collecting water";
      return true;
    }
  }
  
  export class CollectingNode extends Node {
    evaluate(human: Human): boolean {
      
      if (human.state === "Collecting food") {
        human.collectFood();
        return true;
      }
  
      human.collectWater();
      return true;
    }
  }
  