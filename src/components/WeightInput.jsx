import { ScaleIcon } from './Icons';
import { sliderFill } from '../utils/sliderFill';

export default function WeightInput({
  weightKg,
  onWeightChange,
  targetWeightKg,
  onTargetWeightChange,
  factor,
  onFactorChange,
}) {
  const kgToGo = weightKg - targetWeightKg;

  return (
    <section className="card">
      <div className="card-title">
        <span className="icon-badge"><ScaleIcon /></span>
        <h2>Weight &amp; target</h2>
      </div>

      <div className="input-row">
        <div className="input-group">
          <label htmlFor="weight">Current weight</label>
          <div className="input-suffix">
            <input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              value={weightKg}
              onChange={(e) => onWeightChange(parseFloat(e.target.value) || 0)}
            />
            <span>kg</span>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="target-weight">Goal weight</label>
          <div className="input-suffix">
            <input
              id="target-weight"
              type="number"
              step="0.1"
              min="0"
              value={targetWeightKg}
              onChange={(e) => onTargetWeightChange(parseFloat(e.target.value) || 0)}
            />
            <span>kg</span>
          </div>
        </div>
      </div>

      <p className="to-go">
        {kgToGo > 0 ? (
          <>
            <span className="pill pill--pink">{kgToGo.toFixed(2)} kg to go</span>
            until goal weight
          </>
        ) : (
          <span className="pill pill--pink">At goal weight</span>
        )}
      </p>

      <div className="slider-group">
        <div className="slider-head">
          <label htmlFor="factor" className="field-label">Weight-loss factor</label>
          <span className="slider-value">{factor.toFixed(2)}</span>
        </div>
        <input
          id="factor"
          type="range"
          min="0.5"
          max="1.2"
          step="0.05"
          value={factor}
          onChange={(e) => onFactorChange(parseFloat(e.target.value))}
          style={{ background: sliderFill(factor, 0.5, 1.2) }}
        />
        <div className="slider-labels">
          <span>Aggressive · 0.5</span>
          <span>Maintenance · 1.0+</span>
        </div>
      </div>

      <p className="hint">
        RER = 70 × weight<sup>0.75</sup>, then × {factor} factor. Adjust the factor per vet guidance.
      </p>
    </section>
  );
}
