// ts-puzzles/puzzle-utils.ts
import { AssetsJson, Asset, CategoryName, Edibility } from "./puzzle-data";

// Utility to get a flat list of all assets
export function flattenAssets(data: AssetsJson): Asset[] {
  const all: Asset[] = [];
  for (const category of Object.keys(data.categories) as CategoryName[]) {
    all.push(...data.categories[category]);
  }
  return all;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Category classification: e.g., edible vs non-edible
export function buildEdibleVsNonEdiblePuzzle(data: AssetsJson): Asset[] {
  const all = flattenAssets(data);

  const edible = all.filter(a => a.edibility === "edible");
  const nonEdible = all.filter(a => a.edibility === "nonEdible");

  const needed = data.itemsPerPuzzle ?? 8;
  const half = Math.floor(needed / 2);

  const edibleSample = shuffle(edible).slice(0, half);
  const nonEdibleSample = shuffle(nonEdible).slice(0, needed - half);

  return shuffle([...edibleSample, ...nonEdibleSample]);
}

// Odd One Out: 7 from one category, 1 from another
export function buildOddOneOutPuzzle(
  data: AssetsJson,
  majorityCategory: CategoryName,
  oddCategory: CategoryName
): Asset[] {
  const majorityList = data.categories[majorityCategory];
  const oddList = data.categories[oddCategory];

  const needed = data.itemsPerPuzzle ?? 8;
  const majorityCount = needed - 1;

  const majority = shuffle(majorityList).slice(0, majorityCount);
  const odd = shuffle(oddList).slice(0, 1);

  return shuffle([...majority, ...odd]);
}

// Concept Sorting: drag all assets from a given category
export function buildConceptCategoryPuzzle(
  data: AssetsJson,
  targetCategory: CategoryName
): Asset[] {
  const all = flattenAssets(data);
  const target = all.filter(a => a.category === targetCategory);
  const distractors = all.filter(a => a.category !== targetCategory);

  const needed = data.itemsPerPuzzle ?? 8;
  const targetCount = Math.max(2, Math.min(4, needed - 3)); // 2-4 targets
  const distractorCount = needed - targetCount;

  const targetSample = shuffle(target).slice(0, targetCount);
  const distractorSample = shuffle(distractors).slice(0, distractorCount);

  return shuffle([...targetSample, ...distractorSample]);
}

// Make helpers available to plain JS by attaching to window
declare global {
  interface Window {
    BotOrNotPuzzles?: any;
  }
}

// Attach to window so puzzles.js can call window.BotOrNotPuzzles.*
window.BotOrNotPuzzles = {
  buildEdibleVsNonEdiblePuzzle,
  buildOddOneOutPuzzle,
  buildConceptCategoryPuzzle
};
