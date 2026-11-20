import { ReceiptIcon } from './Icons';

export default function DailyTotal({ mealCalories, treatCalories, dailyCalories }) {
  const { dryKcal, wetKcal, dryFoodName, wetFoodName } = mealCalories;
  const total = dryKcal + wetKcal + treatCalories;
  const target = Math.round(dailyCalories);
  const diff = total - target;
  const onTarget = Math.abs(diff) <= 2; // allow for rounding
  const status = onTarget
    ? 'Right on target'
    : diff > 0
      ? `${diff} kcal over`
      : `${-diff} kcal under`;

  return (
    <section className="card total-card">
      <div className="card-title">
        <span className="icon-badge"><ReceiptIcon /></span>
        <h2>Today's bowl</h2>
      </div>

      <div className="total-lines">
        {dryFoodName && (
          <div className="total-line">
            <span className="dot dot--dry" />
            <span className="total-line-name">{dryFoodName}</span>
            <span className="total-line-kcal">{dryKcal} kcal</span>
          </div>
        )}
        {wetFoodName && (
          <div className="total-line">
            <span className="dot dot--wet" />
            <span className="total-line-name">{wetFoodName}</span>
            <span className="total-line-kcal">{wetKcal} kcal</span>
          </div>
        )}
        {treatCalories > 0 && (
          <div className="total-line">
            <span className="dot dot--treats" />
            <span className="total-line-name">Treats</span>
            <span className="total-line-kcal">{treatCalories} kcal</span>
          </div>
        )}
      </div>

      <div className="total-sum">
        <span className="total-sum-label">Total</span>
        <span className="total-sum-value">{total} <small>kcal</small></span>
      </div>

      <div className="total-target">
        <span>Daily target {target} kcal</span>
        <span className={`status ${onTarget ? 'status--ok' : 'status--warn'}`}>{status}</span>
      </div>
    </section>
  );
}
