import { randInt, randRange } from "../../utils/math";
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
        genes.viewRange = randInt(2, 7);
        genes.hungerModificator = randRange(0.5, 2);
        genes.thirstModificator = randRange(0.5, 2);
        genes.matingModificator = randRange(1, 4);
        genes.fertility = randRange(0, 10);
        return genes;
    }

    static getGenesFromParents(father: Human, mother: Human): Genetics {
        return this.randomGenes();
    }
}