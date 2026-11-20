import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { calculateDailyCalories } from './utils/calories';
import useFoods from './hooks/useFoods';
import WeightInput from './components/WeightInput';
import MealCalculator from './components/MealCalculator';
import TreatBudget from './components/TreatBudget';
import DailyOverview from './components/DailyOverview';
import DailyTotal from './components/DailyTotal';
import { Heart, Sparkle } from './components/Icons';
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
  const [mealCalories, setMealCalories] = useState({ dryKcal: 0, wetKcal: 0, dryFoodName: null, wetFoodName: null });

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
      <header className="app-header">
        <div className="avatar-wrap">
          <Heart className="deco deco-heart lg" />
          <Heart className="deco deco-heart sm" />
          <Sparkle className="deco deco-sparkle" />
          <img src="/maya.jpg" alt="Maya the cavapoo" className="maya-avatar" />
        </div>
        <h1>Maya's Food Calculator</h1>
        <div className="pill-row">
          <span className="pill">Cavapoo</span>
          <span className="pill">Goal {targetWeightKg} kg</span>
        </div>
      </header>

      <main>
        <DailyOverview
          dailyCalories={dailyCalories}
          factor={factor}
          dryKcal={mealCalories.dryKcal}
          wetKcal={mealCalories.wetKcal}
          treatKcal={totalTreatCalories}
          foodCalories={foodCalories}
        />

        <WeightInput
          weightKg={weightKg}
          onWeightChange={setWeightKg}
          targetWeightKg={targetWeightKg}
          onTargetWeightChange={setTargetWeightKg}
          factor={factor}
          onFactorChange={setFactor}
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
          onMealCaloriesChange={setMealCalories}
        />

        <DailyTotal
          mealCalories={mealCalories}
          treatCalories={totalTreatCalories}
          dailyCalories={dailyCalories}
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
