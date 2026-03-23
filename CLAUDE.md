# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A food portion calculator for Maya (cavapoo, target weight 6.5kg). Calculates daily calorie targets from body weight, then converts to grams/cups of her specific foods. Supports dry/wet food mixing and treat calorie budgets.

## Commands

- `npm run dev` — start Vite dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally

## Architecture

React + Vite, client-side only (no backend). All state lives in `App.jsx` and flows down via props.

**Data flow:** Weight (kg) → RER formula → daily kcal target → subtract treats → food calorie budget → portion calculator

Key files:
- `src/data/foods.js` — food & treat database (kcal/g, kcal/cup, kcal/can values)
- `src/utils/calories.js` — all calorie math (RER, portions, mix calculations)
- `src/App.jsx` — top-level state: weight, selected treats, calorie computations
- `src/components/MealCalculator.jsx` — most complex component, handles 4 modes (100% dry, 100% wet, mix slider, "I used X grams")

## Calorie Formula

RER (Resting Energy Requirement) = 70 × (weight_kg ^ 0.75)
Weight-loss daily target = RER × 0.8

## Adding Foods or Treats

Add entries to the arrays in `src/data/foods.js`. Dry foods need `kcalPerG` and `kcalPerCup`. Wet foods need `kcalPerG` and `kcalPerCan`. Treats need `kcalPerTreat`. Each entry needs a unique `id`.
