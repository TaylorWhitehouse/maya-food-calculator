// Default food database — used as initial data on first load.
// At runtime, foods are managed via state + localStorage.

export const defaultWetFoods = [
  {
    id: 'rc-digestive-care',
    name: 'Royal Canin Digestive Care',
    brand: 'Royal Canin',
    kcalPerG: 0.92,
    kcalPerCan: 354,
    canSizeG: 385,
  },
  {
    id: 'rc-adult-wet',
    name: 'Royal Canin Adult Wet',
    brand: 'Royal Canin',
    kcalPerG: 1.00,
    kcalPerCan: 386,
    canSizeG: 385,
  },
];

export const defaultDryFoods = [
  {
    id: 'rc-small-breed',
    name: 'Royal Canin Small Breed Adult',
    brand: 'Royal Canin',
    kcalPerG: 3.74,
    kcalPerCup: 359,
  },
  {
    id: 'hills-td',
    name: "Hill's t/d Chicken",
    brand: "Hill's Science Diet",
    kcalPerG: 2.46,
    kcalPerCup: 246,
  },
];

export const defaultTreats = [
  {
    id: 'greenies-petite',
    name: 'Greenies (Petite, 15-25 lbs)',
    brand: 'Greenies',
    kcalPerTreat: 53,
  },
];
