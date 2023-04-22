import Human from "../Human";

export abstract class Node {
  readonly trueNode: Node;
  readonly falseNode: Node;
  abstract evaluate(human: Human): boolean;
}
