import { clamp, randInt, randRange } from "../../utils/math";
import { averageFloat, averageInt } from "../../utils/population";
import Human from "./Human";

export class Genetics {
  speed: number;
  viewRange: number;
  hungerModificator: number;
  thirstModificator: number;
  matingModificator: number;
  fertility: number;

  static randomGenes(): Genetics {
    const genes = new Genetics();
    genes.speed = randInt(40, 70);
    genes.viewRange = randInt(80, 200);
    genes.hungerModificator = randRange(0.5, 2);
    genes.thirstModificator = randRange(0.5, 2);
    genes.matingModificator = randRange(1, 4);
    genes.fertility = randRange(0, 10);
    return genes;
  }

  static getGenesFromParents(father: Human, mother: Human): Genetics {
    const genes = new Genetics();
    genes.speed = clamp(
      averageInt(father.genes.speed, mother.genes.speed) + randInt(-5, 10),
      40,
      80
    );
    genes.viewRange = clamp(
      averageInt(father.genes.viewRange, mother.genes.viewRange) +
        randInt(-1, 1),
      80,
      200
    );
    genes.hungerModificator = clamp(
      averageFloat(
        father.genes.hungerModificator,
        mother.genes.hungerModificator
      ) + randInt(-0.1, 0.2),
      0.5,
      2
    );
    genes.thirstModificator = clamp(
      averageFloat(
        father.genes.thirstModificator,
        mother.genes.thirstModificator
      ) + randInt(-0.1, 0.2),
      0.5,
      2
    );
    genes.matingModificator = clamp(
      averageFloat(
        father.genes.matingModificator,
        mother.genes.matingModificator
      ) + randInt(-0.2, 0.4),
      1,
      4
    );
    genes.fertility = clamp(
      averageFloat(father.genes.viewRange, mother.genes.viewRange) +
        randRange(-1, 2),
      0,
      10
    );
    return genes;
  }
}
