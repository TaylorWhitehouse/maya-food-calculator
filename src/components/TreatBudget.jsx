export default function TreatBudget({ treats, selectedTreats, onToggleTreat, totalTreatCalories }) {
  return (
    <div className="card">
      <h2>Treats</h2>
      <div className="treat-list">
        {treats.map((treat) => {
          const isSelected = selectedTreats.includes(treat.id);
          return (
            <label key={treat.id} className={`treat-item ${isSelected ? 'active' : ''}`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleTreat(treat.id)}
              />
              <span className="treat-name">{treat.name}</span>
              <span className="treat-cal">{treat.kcalPerTreat} kcal</span>
            </label>
          );
        })}
      </div>
      {totalTreatCalories > 0 && (
        <div className="treat-total">
          <span className="label">Treat calories</span>
          <span className="value">-{totalTreatCalories} kcal</span>
        </div>
      )}
    </div>
  );
}
