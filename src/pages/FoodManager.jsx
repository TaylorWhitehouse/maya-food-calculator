import { useState } from 'react';
import { Link } from 'react-router-dom';

function generateId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
}

function FoodForm({ type, food, onSave, onCancel }) {
  const isNew = !food;
  const isTreat = type === 'treat';

  const [name, setName] = useState(food?.name || '');
  const [brand, setBrand] = useState(food?.brand || '');
  const [kcalPerG, setKcalPerG] = useState(food?.kcalPerG ?? '');
  const [kcalPerCup, setKcalPerCup] = useState(food?.kcalPerCup ?? '');
  const [kcalPerCan, setKcalPerCan] = useState(food?.kcalPerCan ?? '');
  const [canSizeG, setCanSizeG] = useState(food?.canSizeG ?? '');
  const [kcalPerTreat, setKcalPerTreat] = useState(food?.kcalPerTreat ?? '');

  function handleSubmit(e) {
    e.preventDefault();
    const id = food?.id || generateId(name);

    if (isTreat) {
      onSave({ id, name, brand, kcalPerTreat: parseFloat(kcalPerTreat) || 0 });
    } else if (type === 'dry') {
      onSave({
        id, name, brand,
        kcalPerG: parseFloat(kcalPerG) || 0,
        kcalPerCup: parseFloat(kcalPerCup) || 0,
      });
    } else {
      onSave({
        id, name, brand,
        kcalPerG: parseFloat(kcalPerG) || 0,
        kcalPerCan: parseFloat(kcalPerCan) || 0,
        canSizeG: parseFloat(canSizeG) || 385,
      });
    }
  }

  return (
    <form className="food-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="input-group">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Brand</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
      </div>

      {isTreat ? (
        <div className="input-group">
          <label>Calories per treat (kcal)</label>
          <input
            type="number"
            step="0.1"
            value={kcalPerTreat}
            onChange={(e) => setKcalPerTreat(e.target.value)}
            required
          />
        </div>
      ) : (
        <>
          <div className="input-group">
            <label>Calories per gram (kcal/g)</label>
            <input
              type="number"
              step="0.01"
              value={kcalPerG}
              onChange={(e) => setKcalPerG(e.target.value)}
              required
            />
          </div>
          {type === 'dry' ? (
            <div className="input-group">
              <label>Calories per cup (kcal/cup)</label>
              <input
                type="number"
                step="1"
                value={kcalPerCup}
                onChange={(e) => setKcalPerCup(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="form-row">
              <div className="input-group">
                <label>Calories per can (kcal)</label>
                <input
                  type="number"
                  step="1"
                  value={kcalPerCan}
                  onChange={(e) => setKcalPerCan(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Can size (g)</label>
                <input
                  type="number"
                  step="1"
                  value={canSizeG}
                  onChange={(e) => setCanSizeG(e.target.value)}
                  placeholder="385"
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isNew ? 'Add' : 'Save'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function FoodSection({ title, type, items, fields, saveFood, deleteFood }) {
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  function handleSave(food) {
    saveFood(type === 'treat' ? 'treat' : type, food);
    setEditingId(null);
    setAdding(false);
  }

  return (
    <div className="card">
      <h2>{title}</h2>

      {items.map((item) =>
        editingId === item.id ? (
          <FoodForm
            key={item.id}
            type={type}
            food={item}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div key={item.id} className="food-item">
            <div className="food-item-info">
              <span className="food-item-name">{item.name}</span>
              <span className="food-item-detail">
                {fields.map((f) => f.render(item)).join(' · ')}
              </span>
            </div>
            <div className="food-item-actions">
              <button
                className="btn-icon"
                onClick={() => setEditingId(item.id)}
                title="Edit"
              >
                Edit
              </button>
              <button
                className="btn-icon btn-danger"
                onClick={() => deleteFood(type === 'treat' ? 'treat' : type, item.id)}
                title="Delete"
              >
                Delete
              </button>
            </div>
          </div>
        )
      )}

      {adding ? (
        <FoodForm
          type={type}
          onSave={handleSave}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button className="btn btn-add" onClick={() => setAdding(true)}>
          + Add {type === 'treat' ? 'treat' : type + ' food'}
        </button>
      )}
    </div>
  );
}

export default function FoodManager({ dryFoods, wetFoods, treats, saveFood, deleteFood }) {
  return (
    <div className="app">
      <header>
        <Link to="/" className="back-link">&larr; Back to calculator</Link>
        <h1>Manage Foods</h1>
      </header>

      <main>
        <FoodSection
          title="Dry Foods"
          type="dry"
          items={dryFoods}
          fields={[
            { render: (f) => `${f.kcalPerG} kcal/g` },
            { render: (f) => `${f.kcalPerCup} kcal/cup` },
          ]}
          saveFood={saveFood}
          deleteFood={deleteFood}
        />

        <FoodSection
          title="Wet Foods"
          type="wet"
          items={wetFoods}
          fields={[
            { render: (f) => `${f.kcalPerG} kcal/g` },
            { render: (f) => f.kcalPerCan ? `${f.kcalPerCan} kcal/can` : '' },
          ]}
          saveFood={saveFood}
          deleteFood={deleteFood}
        />

        <FoodSection
          title="Treats"
          type="treat"
          items={treats}
          fields={[
            { render: (f) => `${f.kcalPerTreat} kcal/treat` },
          ]}
          saveFood={saveFood}
          deleteFood={deleteFood}
        />
      </main>
    </div>
  );
}
