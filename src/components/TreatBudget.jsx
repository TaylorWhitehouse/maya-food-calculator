import { BoneIcon, CheckIcon } from './Icons';

export default function TreatBudget({ treats, selectedTreats, onToggleTreat, totalTreatCalories }) {
  return (
    <section className="card">
      <div className="card-header">
        <div className="card-title">
          <span className="icon-badge icon-badge--pink"><BoneIcon /></span>
          <h2>Treats</h2>
        </div>
        {totalTreatCalories > 0 && (
          <span className="pill pill--pink">−{totalTreatCalories} kcal</span>
        )}
      </div>

      <div className="treat-list">
        {treats.map((treat) => {
          const isSelected = selectedTreats.includes(treat.id);
          return (
            <button
              key={treat.id}
              type="button"
              aria-pressed={isSelected}
              className={`treat-item ${isSelected ? 'active' : ''}`}
              onClick={() => onToggleTreat(treat.id)}
            >
              <span className="treat-check">{isSelected && <CheckIcon />}</span>
              <span className="treat-name">{treat.name}</span>
              <span className="treat-cal">{treat.kcalPerTreat} <small>kcal</small></span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
