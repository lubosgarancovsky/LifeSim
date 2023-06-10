import names from "../src/data/names.json";
import { randChoice } from "./math";

export function randomMale() {
  return randChoice(names.male);
}

export function randomFemale() {
  return randChoice(names.female);
}

export function randomId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function averageInt(a: number, b: number) {
  return Math.round((a + b) / 2);
}

export function averageFloat(a: number, b: number) {
  return (a + b) / 2;
}