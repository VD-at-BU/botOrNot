// ts-puzzles/puzzle-data.ts

export type CategoryName =
  | "books"
  | "boots"
  | "fish"
  | "flowers"
  | "food"
  | "jewelry"
  | "tools";

export type Edibility = "edible" | "nonEdible" | "ambiguous";

export interface Asset {
  fileName: string;
  category: CategoryName;
  edibility: Edibility;
}

export type AssetsByCategory = Record<CategoryName, Asset[]>;

export interface AssetsJson {
  itemsPerPuzzle: number;
  categories: AssetsByCategory;
}

// This function runs in the browser (puzzles.html),
// so it uses fetch to load assets.json.
export async function loadAssetsJson(): Promise<AssetsJson> {
  const response = await fetch("models/assets.json");
  if (!response.ok) {
    throw new Error(`Failed to load assets.json: ${response.status}`);
  }
  return (await response.json()) as AssetsJson;
}
