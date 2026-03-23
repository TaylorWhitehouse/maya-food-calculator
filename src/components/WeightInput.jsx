export default function WeightInput({
  weightKg,
  onWeightChange,
  targetWeightKg,
  onTargetWeightChange,
  factor,
  onFactorChange,
  dailyCalories,
}) {
  return (
    <div className="card">
      <h2>Weight & Calorie Target</h2>
      <div className="input-row">
        <div className="input-group">
          <label htmlFor="weight">Current weight (kg)</label>
          <input
            id="weight"
            type="number"
            step="0.01"
            min="0"
            value={weightKg}
            onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="target-weight">Target weight (kg)</label>
          <input
            id="target-weight"
            type="number"
            step="0.1"
            min="0"
            value={targetWeightKg}
            onChange={(e) => onTargetWeightChange(parseFloat(e.target.value) || 0)}
          />
        </div>
      </div>
      <div className="input-group">
        <label htmlFor="factor">
          Weight loss factor: {factor}
        </label>
        <input
          id="factor"
          type="range"
          min="0.5"
          max="1.2"
          step="0.05"
          value={factor}
          onChange={(e) => onFactorChange(parseFloat(e.target.value))}
        />
        <div className="slider-labels">
          <span>Aggressive (0.5)</span>
          <span>Maintenance (1.0+)</span>
        </div>
      </div>
      <div className="calorie-target">
        <span className="label">Daily calorie target</span>
        <span className="value">{Math.round(dailyCalories)} kcal</span>
      </div>
      <p className="hint">
        RER = 70 × weight^0.75, then × {factor} factor. Adjust factor per vet guidance.
      </p>
    </div>
  );
}
