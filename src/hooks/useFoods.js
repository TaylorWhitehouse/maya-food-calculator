import { useState } from 'react';
import { defaultDryFoods, defaultWetFoods, defaultTreats } from '../data/foods';

// Load from localStorage, merging in any new defaults the user doesn't have yet
function loadFromStorage(key, defaults) {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaults;
    const parsed = JSON.parse(stored);
    const existingIds = new Set(parsed.map((item) => item.id));
    const missing = defaults.filter((d) => !existingIds.has(d.id));
    return missing.length ? [...parsed, ...missing] : parsed;
  } catch {
    return defaults;
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function useFoods() {
  const [dryFoods, setDryFoods] = useState(() =>
    loadFromStorage('maya-dry-foods', defaultDryFoods)
  );
  const [wetFoods, setWetFoods] = useState(() =>
    loadFromStorage('maya-wet-foods', defaultWetFoods)
  );
  const [treats, setTreats] = useState(() =>
    loadFromStorage('maya-treats', defaultTreats)
  );

  function updateDryFoods(foods) {
    setDryFoods(foods);
    saveToStorage('maya-dry-foods', foods);
  }

  function updateWetFoods(foods) {
    setWetFoods(foods);
    saveToStorage('maya-wet-foods', foods);
  }

  function updateTreats(newTreats) {
    setTreats(newTreats);
    saveToStorage('maya-treats', newTreats);
  }

  // Helper: add or update a single item in a list
  function saveFood(type, food) {
    const setter =
      type === 'dry' ? updateDryFoods :
      type === 'wet' ? updateWetFoods : updateTreats;
    const list =
      type === 'dry' ? dryFoods :
      type === 'wet' ? wetFoods : treats;

    const existing = list.findIndex((f) => f.id === food.id);
    if (existing >= 0) {
      const updated = [...list];
      updated[existing] = food;
      setter(updated);
    } else {
      setter([...list, food]);
    }
  }

  function deleteFood(type, id) {
    const setter =
      type === 'dry' ? updateDryFoods :
      type === 'wet' ? updateWetFoods : updateTreats;
    const list =
      type === 'dry' ? dryFoods :
      type === 'wet' ? wetFoods : treats;

    setter(list.filter((f) => f.id !== id));
  }

  return { dryFoods, wetFoods, treats, saveFood, deleteFood };
}
