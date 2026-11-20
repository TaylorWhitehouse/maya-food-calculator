import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  calculateMixPortions,
  calculateFromGrams,
  gramsForCalories,
  cupsForCalories,
} from '../utils/calories';
import { sliderFill } from '../utils/sliderFill';
import { BowlIcon, ChevronDown } from './Icons';

export default function MealCalculator({ dryFoods, wetFoods, foodCalories, onMealCaloriesChange }) {
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

  // Report actual meal calories back to parent
  useEffect(() => {
    if (onMealCaloriesChange) {
      const showDry = mode === 'dry' || mode === 'mix';
      const showWet = mode === 'wet' || mode === 'mix';
      onMealCaloriesChange({
        dryKcal: showDry ? displayDryKcal : 0,
        wetKcal: showWet ? displayWetKcal : 0,
        dryFoodName: showDry ? dryFood.name : null,
        wetFoodName: showWet ? wetFood.name : null,
      });
    }
  }, [displayDryKcal, displayWetKcal, mode, dryFood?.name, wetFood?.name]);

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

  const showDry = mode === 'dry' || mode === 'mix';
  const showWet = mode === 'wet' || mode === 'mix';

  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon-badge icon-badge--leaf"><BowlIcon /></span>
          <h2>Meal plan</h2>
        </div>
        <Link to="/foods" className="manage-link">Manage foods</Link>
      </div>

      {/* Food selection */}
      <div className="food-selectors">
        <div className="input-group">
          <label htmlFor="dry-food">Dry food</label>
          <div className="select-wrap">
            <select
              id="dry-food"
              value={selectedDry}
              onChange={(e) => setSelectedDry(e.target.value)}
            >
              {dryFoods.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="wet-food">Wet food</label>
          <div className="select-wrap">
            <select
              id="wet-food"
              value={selectedWet}
              onChange={(e) => setSelectedWet(e.target.value)}
            >
              {wetFoods.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="mode-tabs" role="group" aria-label="Feeding mode">
        {[
          { key: 'dry', label: '100% Dry' },
          { key: 'mix', label: 'Mix' },
          { key: 'wet', label: '100% Wet' },
        ].map((m) => (
          <button
            key={m.key}
            type="button"
            aria-pressed={mode === m.key}
            className={`tab ${mode === m.key ? 'active' : ''}`}
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Mix slider */}
      {mode === 'mix' && (
        <div className="slider-group">
          <div className="slider-head">
            <label htmlFor="wet-split" className="field-label">Wet / dry split</label>
            <span className="slider-value">{wetPct}% wet · {100 - wetPct}% dry</span>
          </div>
          <input
            id="wet-split"
            type="range"
            min="0"
            max="100"
            step="5"
            value={wetPct}
            onChange={(e) => handleSliderChange(e.target.value)}
            style={{ background: sliderFill(wetPct, 0, 100) }}
          />
          <div className="slider-labels">
            <span>All dry</span>
            <span>All wet</span>
          </div>
        </div>
      )}

      {/* Results */}
      <div className={`portion-tiles ${mode === 'mix' ? '' : 'portion-tiles--single'}`}>
        {showDry && (
          <div className="portion-tile portion-tile--dry">
            <span className="tile-kicker">Dry</span>
            <span className="tile-name">{dryFood.name}</span>
            <span className="tile-amount">
              {mode === 'mix' ? (
                <input
                  type="number"
                  className="gram-input"
                  min="0"
                  aria-label="Dry food grams"
                  value={dryGramsOverride !== null ? dryGramsOverride : displayDryGrams}
                  onChange={(e) => handleDryGramsChange(e.target.value)}
                  placeholder={displayDryGrams}
                />
              ) : (
                <span className="tile-big">{displayDryGrams}</span>
              )}
              g
            </span>
            <span className="tile-meta">
              {displayDryCups.toFixed(2)} cups · {displayDryKcal} kcal
            </span>
          </div>
        )}

        {showWet && (
          <div className="portion-tile portion-tile--wet">
            <span className="tile-kicker">Wet</span>
            <span className="tile-name">{wetFood.name}</span>
            <span className="tile-amount">
              {mode === 'mix' ? (
                <input
                  type="number"
                  className="gram-input"
                  min="0"
                  aria-label="Wet food grams"
                  value={wetGramsOverride !== null ? wetGramsOverride : displayWetGrams}
                  onChange={(e) => handleWetGramsChange(e.target.value)}
                  placeholder={displayWetGrams}
                />
              ) : (
                <span className="tile-big">{displayWetGrams}</span>
              )}
              g
            </span>
            <span className="tile-meta">{displayWetKcal} kcal</span>
          </div>
        )}
      </div>

      {overBudget && (
        <p className="warning">
          That's more than the food budget, so the other food is set to 0 g.
        </p>
      )}

      {mode === 'mix' && (
        <p className="hint">Edit either gram amount and the other one recalculates.</p>
      )}

      <div className="food-budget">
        <span className="label">Food calorie budget</span>
        <span className="value">{Math.round(foodCalories)} kcal</span>
      </div>
    </section>
  );
}
