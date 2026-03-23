import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { calculateDailyCalories } from './utils/calories';
import useFoods from './hooks/useFoods';
import WeightInput from './components/WeightInput';
import MealCalculator from './components/MealCalculator';
import TreatBudget from './components/TreatBudget';
import FoodSummary from './components/FoodSummary';
import FoodManager from './pages/FoodManager';
import './App.css';

// Load a setting from localStorage with a fallback default
function usePersisted(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  function setPersisted(newValue) {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  return [value, setPersisted];
}

function Calculator({ dryFoods, wetFoods, treats }) {
  const [weightKg, setWeightKg] = usePersisted('maya-weight', 8.78);
  const [targetWeightKg, setTargetWeightKg] = usePersisted('maya-target-weight', 6.5);
  const [factor, setFactor] = usePersisted('maya-factor', 0.9);
  const [selectedTreats, setSelectedTreats] = useState([]);

  const dailyCalories = calculateDailyCalories(weightKg, factor);

  const totalTreatCalories = selectedTreats.reduce((sum, treatId) => {
    const treat = treats.find((t) => t.id === treatId);
    return sum + (treat ? treat.kcalPerTreat : 0);
  }, 0);

  const foodCalories = dailyCalories - totalTreatCalories;

  function handleToggleTreat(treatId) {
    setSelectedTreats((prev) =>
      prev.includes(treatId)
        ? prev.filter((id) => id !== treatId)
        : [...prev, treatId]
    );
  }

  return (
    <div className="app">
      <header>
        <img src="/maya.jpg" alt="Maya the cavapoo" className="maya-avatar" />
        <h1>Maya's Food Calculator</h1>
      </header>

      <main>
        <WeightInput
          weightKg={weightKg}
          onWeightChange={setWeightKg}
          targetWeightKg={targetWeightKg}
          onTargetWeightChange={setTargetWeightKg}
          factor={factor}
          onFactorChange={setFactor}
          dailyCalories={dailyCalories}
        />

        <FoodSummary
          dailyCalories={dailyCalories}
          treatCalories={totalTreatCalories}
          foodCalories={foodCalories}
        />

        <TreatBudget
          treats={treats}
          selectedTreats={selectedTreats}
          onToggleTreat={handleToggleTreat}
          totalTreatCalories={totalTreatCalories}
        />

        <MealCalculator
          dryFoods={dryFoods}
          wetFoods={wetFoods}
          foodCalories={Math.max(0, foodCalories)}
        />
      </main>
    </div>
  );
}

function App() {
  const { dryFoods, wetFoods, treats, saveFood, deleteFood } = useFoods();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Calculator
              dryFoods={dryFoods}
              wetFoods={wetFoods}
              treats={treats}
            />
          }
        />
        <Route
          path="/foods"
          element={
            <FoodManager
              dryFoods={dryFoods}
              wetFoods={wetFoods}
              treats={treats}
              saveFood={saveFood}
              deleteFood={deleteFood}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
