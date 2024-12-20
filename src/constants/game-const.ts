import Level from "../entities/Level";

enum LEVEL_NAMES {
  LEVEL_1 = "Marble's Curse",
  LEVEL_2 = "Harpoon Rampage",
}

export type LevelType = {
  name: LEVEL_NAMES;
  numOfFloors: number;
};

export const LEVELS: LevelType[] = [
  {
    name: LEVEL_NAMES.LEVEL_1,
    numOfFloors: 5,
  },
  {
    name: LEVEL_NAMES.LEVEL_2,
    numOfFloors: 5,
  },
];
