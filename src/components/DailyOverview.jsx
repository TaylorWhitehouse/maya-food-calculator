import { TargetIcon } from './Icons';

const CENTER = 100;
const RADIUS = 80;
const THICKNESS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3; // small white gap between segments

// Ring chart: each segment is a circle stroke where only one dash is drawn.
// strokeDasharray sets the dash length; strokeDashoffset slides it to where the previous segment ended.
export default function DailyOverview({ dailyCalories, factor, dryKcal, wetKcal, treatKcal, foodCalories }) {
  const target = Math.round(dailyCalories);
  const total = dryKcal + wetKcal + treatKcal;
  // Scale to whichever is bigger, so an over-target day still fits in one lap
  const scale = Math.max(total, target, 1);

  let start = 0;
  const segments = [
    { key: 'dry', label: 'Dry', kcal: dryKcal },
    { key: 'wet', label: 'Wet', kcal: wetKcal },
    { key: 'treats', label: 'Treats', kcal: treatKcal },
  ].map((seg) => {
    const length = (seg.kcal / scale) * CIRCUMFERENCE;
    const arc = { ...seg, dash: Math.max(0, length - GAP), offset: -start };
    start += length;
    return arc;
  });

  return (
    <section className="card overview" aria-label="Daily overview">
      <div className="card-header">
        <div className="card-title">
          <span className="icon-badge"><TargetIcon /></span>
          <h2>Daily target</h2>
        </div>
        <span className="pill">× {factor.toFixed(2)} factor</span>
      </div>

      <div className="ring-wrap">
        <svg
          className="ring"
          viewBox="0 0 200 200"
          role="img"
          aria-label={`${total} of ${target} kcal planned: dry ${dryKcal}, wet ${wetKcal}, treats ${treatKcal}`}
        >
          <circle className="ring-track" cx={CENTER} cy={CENTER} r={RADIUS} />
          <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            {segments
              .filter((s) => s.kcal > 0)
              .map((s) => (
                <circle
                  key={s.key}
                  className={`ring-seg ring-seg--${s.key}`}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  strokeDasharray={`${s.dash} ${CIRCUMFERENCE}`}
                  strokeDashoffset={s.offset}
                />
              ))}
          </g>
          <circle className="ring-outline" cx={CENTER} cy={CENTER} r={RADIUS + THICKNESS / 2} />
          <circle className="ring-outline" cx={CENTER} cy={CENTER} r={RADIUS - THICKNESS / 2} />
        </svg>
        <div className="ring-center">
          <span className="ring-caption">Planned today</span>
          <span className="ring-total">{total}</span>
          <span className="ring-caption">of {target} kcal</span>
        </div>
      </div>

      <div className="legend">
        {segments.map((s) => (
          <div key={s.key} className={`legend-chip legend-chip--${s.key}`}>
            <span className="legend-label">{s.label}</span>
            <span className="legend-value">{s.kcal} <small>kcal</small></span>
          </div>
        ))}
      </div>

      <div className="budget-strip">
        <div>
          <span className="budget-num">{target}</span>
          <span className="budget-label">Target</span>
        </div>
        <span className="budget-op" aria-hidden="true">−</span>
        <div>
          <span className="budget-num">{treatKcal}</span>
          <span className="budget-label">Treats</span>
        </div>
        <span className="budget-op" aria-hidden="true">=</span>
        <div>
          <span className="budget-num">{Math.round(foodCalories)}</span>
          <span className="budget-label">Food budget</span>
        </div>
      </div>
    </section>
  );
}
