import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  calculateMixPortions,
  calculateFromGrams,
  gramsForCalories,
  cupsForCalories,
} from '../utils/calories';

export default function MealCalculator({ dryFoods, wetFoods, foodCalories }) {
  const [selectedDry, setSelectedDry] = useState(dryFoods[0].id);
  const [selectedWet, setSelectedWet] = useState(wetFoods[0].id);
  const [mode, setMode] = useState('mix'); // 'dry', 'wet', 'mix'
  const [wetPct, setWetPct] = useState(50);

  // Editable gram overrides — null means "use calculated value"
  const [wetGramsOverride, setWetGramsOverride] = useState(null);
  const [dryGramsOverride, setDryGramsOverride] = useState(null);

  const dryFood = dryFoods.find((f) => f.id === selectedDry);
  const wetFood = wetFoods.find((f) => f.id === selectedWet);

  // Reset overrides when mode, food selection, or calorie budget changes
  useEffect(() => {
    setWetGramsOverride(null);
    setDryGramsOverride(null);
  }, [mode, selectedDry, selectedWet, foodCalories]);

  // Calculate base portions from the slider percentage
  const effectiveWetPct =
    mode === 'dry' ? 0 : mode === 'wet' ? 100 : wetPct;

  const basePortion = calculateMixPortions(
    foodCalories,
    effectiveWetPct,
    dryFood,
    wetFood
  );

  // If user overrode wet grams, recalculate dry from remaining calories
  let displayWetGrams = Math.round(basePortion.wetGrams);
  let displayDryGrams = Math.round(basePortion.dryGrams);
  let displayDryCups = basePortion.dryCups;
  let displayWetKcal = Math.round(basePortion.wetKcal);
  let displayDryKcal = Math.round(basePortion.dryKcal);
  let overBudget = false;

  if (wetGramsOverride !== null && mode === 'mix') {
    const result = calculateFromGrams(
      wetGramsOverride,
      wetFood,
      dryFood,
      foodCalories
    );
    displayWetGrams = wetGramsOverride;
    displayWetKcal = Math.round(result.fixedKcal);
    displayDryGrams = Math.round(result.otherGrams);
    displayDryCups = result.otherCups ?? 0;
    displayDryKcal = Math.round(result.remainingKcal);
    overBudget = result.overBudget;
  } else if (dryGramsOverride !== null && mode === 'mix') {
    const result = calculateFromGrams(
      dryGramsOverride,
      dryFood,
      wetFood,
      foodCalories
    );
    displayDryGrams = dryGramsOverride;
    displayDryKcal = Math.round(result.fixedKcal);
    displayDryCups = dryFood.kcalPerCup
      ? cupsForCalories(result.fixedKcal, dryFood.kcalPerCup)
      : 0;
    displayWetGrams = Math.round(result.otherGrams);
    displayWetKcal = Math.round(result.remainingKcal);
    overBudget = result.overBudget;
  }

  function handleWetGramsChange(value) {
    const grams = parseFloat(value);
    if (value === '' || isNaN(grams)) {
      setWetGramsOverride(null);
      setDryGramsOverride(null);
      return;
    }
    setWetGramsOverride(grams);
    setDryGramsOverride(null);
    // Update the slider to reflect the new split
    const result = calculateFromGrams(grams, wetFood, dryFood, foodCalories);
    setWetPct(Math.round(result.fixedPct));
  }

  function handleDryGramsChange(value) {
    const grams = parseFloat(value);
    if (value === '' || isNaN(grams)) {
      setDryGramsOverride(null);
      setWetGramsOverride(null);
      return;
    }
    setDryGramsOverride(grams);
    setWetGramsOverride(null);
    // Update the slider to reflect the new split
    const result = calculateFromGrams(grams, dryFood, wetFood, foodCalories);
    setWetPct(100 - Math.round(result.fixedPct));
  }

  function handleSliderChange(value) {
    setWetPct(parseInt(value));
    setWetGramsOverride(null);
    setDryGramsOverride(null);
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Meal Calculator</h2>
        <Link to="/foods" className="manage-link">Manage foods</Link>
      </div>

      {/* Food selection */}
      <div className="food-selectors">
        <div className="input-group">
          <label htmlFor="dry-food">Dry food</label>
          <select
            id="dry-food"
            value={selectedDry}
            onChange={(e) => setSelectedDry(e.target.value)}
          >
            {dryFoods.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="wet-food">Wet food</label>
          <select
            id="wet-food"
            value={selectedWet}
            onChange={(e) => setSelectedWet(e.target.value)}
          >
            {wetFoods.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="mode-tabs">
        {[
          { key: 'dry', label: '100% Dry' },
          { key: 'mix', label: 'Mix' },
          { key: 'wet', label: '100% Wet' },
        ].map((m) => (
          <button
            key={m.key}
            className={`tab ${mode === m.key ? 'active' : ''}`}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Mix slider */}
      {mode === 'mix' && (
        <div className="mix-slider">
          <label>
            Wet/Dry split: {wetPct}% wet / {100 - wetPct}% dry
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={wetPct}
            onChange={(e) => handleSliderChange(e.target.value)}
          />
          <div className="slider-labels">
            <span>All dry</span>
            <span>All wet</span>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="results">
        {/* Dry food row */}
        {(mode === 'dry' || mode === 'mix') && (
          <div className="result-row">
            <span className="food-name">{dryFood.name}</span>
            <span className="amount">
              {mode === 'mix' ? (
                <input
                  type="number"
                  className="gram-input"
                  min="0"
                  value={dryGramsOverride !== null ? dryGramsOverride : displayDryGrams}
                  onChange={(e) => handleDryGramsChange(e.target.value)}
                  placeholder={displayDryGrams}
                />
              ) : (
                <span>{displayDryGrams}</span>
              )}
              <span className="unit">g</span>
              <span className="secondary">
                ({displayDryCups.toFixed(2)} cups)
              </span>
            </span>
            <span className="kcal">{displayDryKcal} kcal</span>
          </div>
        )}

        {/* Wet food row */}
        {(mode === 'wet' || mode === 'mix') && (
          <div className="result-row">
            <span className="food-name">{wetFood.name}</span>
            <span className="amount">
              {mode === 'mix' ? (
                <input
                  type="number"
                  className="gram-input"
                  min="0"
                  value={wetGramsOverride !== null ? wetGramsOverride : displayWetGrams}
                  onChange={(e) => handleWetGramsChange(e.target.value)}
                  placeholder={displayWetGrams}
                />
              ) : (
                <span>{displayWetGrams}</span>
              )}
              <span className="unit">g</span>
            </span>
            <span className="kcal">{displayWetKcal} kcal</span>
          </div>
        )}

        {overBudget && (
          <p className="warning">
            That amount exceeds the calorie budget — the other food is set to 0g.
          </p>
        )}
      </div>

      {mode === 'mix' && (
        <p className="hint">
          Edit either gram amount to auto-calculate the other.
        </p>
      )}

      <div className="food-budget">
        <span className="label">Food calorie budget</span>
        <span className="value">{Math.round(foodCalories)} kcal</span>
      </div>
    </div>
  );
}
