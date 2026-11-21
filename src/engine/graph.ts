import source from "../data/catalogue.txt?raw";

export const categories = [
  "自然",
  "造物",
  "生命",
  "文明",
  "科技",
  "奇观",
  "概念",
] as const;
export type Category = (typeof categories)[number];
export interface Element {
  id: string;
  en: string;
  no: number;
  category: Category;
}
export type Pair = [string, string];
export interface Recipe {
  inputs: Pair;
  output: string;
}
export const elements: Element[] = [];
export const recipes: Recipe[] = [];
export const byId = new Map<string, Element>();
export const parents = new Map<string, Pair[]>();
const pairs = new Map<string, string>();
const key = (a: string, b: string) => JSON.stringify(a <= b ? [a, b] : [b, a]);
let category: Category = "自然";
for (const line of source.trim().split(/\r?\n/)) {
  if (line.startsWith("# ")) {
    category = line.slice(2) as Category;
    continue;
  }
  const [id, en, ...routes] = line.split("|");
  if (!id || byId.has(id) || !en) throw new Error("无效词条 " + id);
  const el = { id, en, category, no: elements.length + 1 };
  elements.push(el);
  byId.set(id, el);
  parents.set(
    id,
    routes.map((route) => {
      const [a, b] = route.split(" ");
      if (pairs.has(key(a, b)))
        throw new Error("重复配方 " + route + " → " + id);
      pairs.set(key(a, b), id);
      const inputs: Pair = [a, b];
      recipes.push({ inputs, output: id });
      return inputs;
    }),
  );
}
export const roots = ["水", "火", "土", "风"];
export const combine = (a: string, b: string) => pairs.get(key(a, b));
export const number = (n: number) => String(n).padStart(3, "0");
export function explore() {
  const depth = new Map(roots.map((id) => [id, 0]));
  const path: Record<string, Pair> = {};
  for (let layer = 1; ; layer++) {
    const additions = recipes.filter(
      ({ inputs: [a, b], output }) =>
        !depth.has(output) && depth.has(a) && depth.has(b),
    );
    if (!additions.length) break;
    for (const { inputs, output } of additions) {
      if (depth.has(output)) continue;
      depth.set(output, layer);
      path[output] = inputs;
    }
  }
  return { depth, path };
}
export const atlas = explore();
export function clue(id: string) {
  const pair = atlas.path[id];
  return pair
    ? "从「" +
        pair[0] +
        "」出发，寻找一种属于「" +
        byId.get(pair[1])!.category +
        "」的搭档。"
    : "四种初始元素之一。";
}
