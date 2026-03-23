export default function FoodSummary({ dailyCalories, treatCalories, foodCalories }) {
  return (
    <div className="card summary-card">
      <h2>Daily Summary</h2>
      <div className="summary-row">
        <span>Total daily target</span>
        <span>{Math.round(dailyCalories)} kcal</span>
      </div>
      {treatCalories > 0 && (
        <div className="summary-row subtract">
          <span>Treats</span>
          <span>−{treatCalories} kcal</span>
        </div>
      )}
      <div className="summary-row total">
        <span>Food budget</span>
        <span>{Math.round(foodCalories)} kcal</span>
      </div>
    </div>
  );
}
