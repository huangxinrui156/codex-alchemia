import { byId, combine, roots, type Pair } from "./graph";

export interface Token {
  uid: string;
  id: string;
  x: number;
  y: number;
}
export interface Save {
  version: 1;
  known: string[];
  board: Token[];
  lineage: Record<string, Pair>;
  mixes: number;
  sound: boolean;
}
export const STORAGE = "codex-alchemia:v1";
export function fresh(): Save {
  const compact =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 600px)").matches;
  const points = compact
    ? [
        [0.08, 0.2],
        [0.84, 0.16],
        [0.16, 0.79],
        [0.9, 0.73],
      ]
    : [
        [0.25, 0.22],
        [0.69, 0.17],
        [0.32, 0.79],
        [0.77, 0.7],
      ];
  return {
    version: 1,
    known: [...roots],
    board: roots.map((id, i) => ({
      uid: crypto.randomUUID(),
      id,
      x: points[i][0],
      y: points[i][1],
    })),
    lineage: {},
    mixes: 0,
    sound: true,
  };
}
export function decode(text: string): Save {
  const s = JSON.parse(text);
  if (
    !s ||
    s.version !== 1 ||
    !Array.isArray(s.known) ||
    !Array.isArray(s.board) ||
    !s.lineage ||
    typeof s.lineage !== "object" ||
    Array.isArray(s.lineage) ||
    typeof s.sound !== "boolean" ||
    !Number.isSafeInteger(s.mixes) ||
    s.mixes < 0
  )
    throw Error("存档格式或版本无效");
  const seen = new Set(roots);
  const known = s.known as string[];
  if (
    known.length !== new Set(known).size ||
    roots.some((r) => !known.includes(r))
  )
    throw Error("初始元素或发现记录无效");
  const lineage: Record<string, Pair> = {};
  for (const id of known) {
    if (!byId.has(id)) throw Error("存档包含未知元素");
    if (roots.includes(id)) continue;
    const inputs = s.lineage[id];
    if (
      !Array.isArray(inputs) ||
      inputs.length !== 2 ||
      !inputs.every((x) => seen.has(x)) ||
      combine(inputs[0], inputs[1]) !== id
    )
      throw Error("合成谱系不完整");
    seen.add(id);
    lineage[id] = [inputs[0], inputs[1]];
  }
  const uids = new Set<string>();
  const board = s.board.map((t: Token) => {
    if (
      !t ||
      !seen.has(t.id) ||
      typeof t.uid !== "string" ||
      !t.uid ||
      uids.has(t.uid) ||
      ![t.x, t.y].every((n) => Number.isFinite(n) && n >= 0 && n <= 1)
    )
      throw Error("工作台布局无效");
    uids.add(t.uid);
    return { uid: t.uid, id: t.id, x: t.x, y: t.y };
  });
  return { version: 1, known, board, lineage, mixes: s.mixes, sound: s.sound };
}
export function readSave(): { save: Save; warning: string } {
  try {
    const raw = localStorage.getItem(STORAGE);
    return { save: raw ? decode(raw) : fresh(), warning: "" };
  } catch {
    return {
      save: fresh(),
      warning: "未能读取本机存档。操作前可先在手记中导入备份。",
    };
  }
}
export function transmute(save: Save, source: string, target: string): Save {
  const a = save.board.find((t) => t.uid === source),
    b = save.board.find((t) => t.uid === target);
  if (!a || !b || a === b) return save;
  const id = combine(a.id, b.id);
  if (!id) return save;
  const isNew = !save.known.includes(id);
  return {
    ...save,
    known: isNew ? [...save.known, id] : save.known,
    lineage: isNew ? { ...save.lineage, [id]: [a.id, b.id] } : save.lineage,
    mixes: save.mixes + 1,
    board: [...save.board.filter((t) => t !== a && t !== b), { ...b, id }],
  };
}
