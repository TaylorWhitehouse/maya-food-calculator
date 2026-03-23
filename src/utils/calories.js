// Resting Energy Requirement (RER) for dogs
// Formula: 70 × (body weight in kg) ^ 0.75
export function calculateRER(weightKg) {
  return 70 * Math.pow(weightKg, 0.75);
}

// Daily calories = RER × weight loss factor
// Typical factors: 1.0-1.2 for maintenance, 0.8 for weight loss
export function calculateDailyCalories(weightKg, factor) {
  return calculateRER(weightKg) * factor;
}

// Calculate grams of food needed for a given calorie target
export function gramsForCalories(targetKcal, kcalPerG) {
  return targetKcal / kcalPerG;
}

// Calculate cups of food needed (dry food only)
export function cupsForCalories(targetKcal, kcalPerCup) {
  return targetKcal / kcalPerCup;
}

// Calculate how many calories are in a given weight of food
export function caloriesInGrams(grams, kcalPerG) {
  return grams * kcalPerG;
}

// Calculate portions for a dry/wet mix
// Returns { dryGrams, dryCups, wetGrams } for a given calorie target
export function calculateMixPortions(totalKcal, wetPct, dryFood, wetFood) {
  const wetKcal = totalKcal * (wetPct / 100);
  const dryKcal = totalKcal * ((100 - wetPct) / 100);

  return {
    dryGrams: dryKcal > 0 ? gramsForCalories(dryKcal, dryFood.kcalPerG) : 0,
    dryCups: dryKcal > 0 ? cupsForCalories(dryKcal, dryFood.kcalPerCup) : 0,
    dryKcal,
    wetGrams: wetKcal > 0 ? gramsForCalories(wetKcal, wetFood.kcalPerG) : 0,
    wetKcal,
  };
}

// Given grams of one food, calculate what % of total calories it represents
// and how much of the other food is needed for the remainder
export function calculateFromGrams(grams, fixedFood, otherFood, totalKcal) {
  const fixedKcal = Math.min(caloriesInGrams(grams, fixedFood.kcalPerG), totalKcal);
  const remainingKcal = Math.max(0, totalKcal - fixedKcal);
  const fixedPct = totalKcal > 0 ? (fixedKcal / totalKcal) * 100 : 0;

  return {
    fixedKcal,
    fixedPct,
    remainingKcal,
    otherGrams: remainingKcal > 0 ? gramsForCalories(remainingKcal, otherFood.kcalPerG) : 0,
    otherCups: otherFood.kcalPerCup
      ? cupsForCalories(remainingKcal, otherFood.kcalPerCup)
      : null,
    overBudget: caloriesInGrams(grams, fixedFood.kcalPerG) > totalKcal,
  };
}
