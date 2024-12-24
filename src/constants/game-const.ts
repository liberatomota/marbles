import Level from "../entities/Level";

const resolutions = {
  "4x3": [
    [800, 600],
    [1024, 768],
    [1280, 960],
    [1600, 1200],
  ],
  "16x9": [
    [1280, 720],
    [1366, 768],
    [1600, 900],
    [1920, 1080],
  ],
  "16x10": [
    [1280, 800],
    [1440, 900],
    [1680, 1050],
    [1920, 1200],
  ],
};

export const GAME_RESOLUTION = resolutions["16x9"][0];

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
    numOfFloors: 4,
  },
  {
    name: LEVEL_NAMES.LEVEL_2,
    numOfFloors: 5,
  },
];
