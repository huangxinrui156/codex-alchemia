import { describe, it, expect } from "vitest";
import {
  byId,
  categories,
  elements,
  recipes,
  roots,
  combine,
  atlas,
  parents,
} from "./graph";
import { fresh, decode, transmute } from "./save";
import { milestones } from "./milestones";

describe("本地图谱", () => {
  it("词条与配方达到设计规模，包含十五件深层奇观", () => {
    expect(elements.length).toBeGreaterThanOrEqual(354);
    expect(recipes.length).toBeGreaterThanOrEqual(600);
    expect(elements.filter((e) => e.category === "奇观")).toHaveLength(15);
    for (const e of elements.filter((e) => e.category === "奇观"))
      expect(atlas.depth.get(e.id)).toBeGreaterThanOrEqual(10);
    expect(milestones).toHaveLength(18);
  });
  it("从四个根做定点展开，解锁全部元素", () => {
    const found = new Set(roots);
    let count = 0;
    while (count !== found.size) {
      count = found.size;
      for (const {
        inputs: [a, b],
        output,
      } of recipes)
        if (found.has(a) && found.has(b)) found.add(output);
    }
    expect(elements.filter((e) => !found.has(e.id))).toEqual([]);
    expect(
      elements.filter((e) => !parents.get(e.id)?.length).map((e) => e.id),
    ).toEqual(roots);
  });
  it("每条配方引用有效词条，交换输入保持结果，编号唯一", () => {
    for (const {
      inputs: [a, b],
      output,
    } of recipes) {
      expect(byId.has(a) && byId.has(b)).toBe(true);
      expect(combine(b, a)).toBe(output);
    }
    expect(new Set(elements.map((e) => e.no)).size).toBe(elements.length);
    expect(elements.every((e) => categories.includes(e.category))).toBe(true);
    expect(combine("水", "水")).toBe("湖泊");
    expect(combine("火", "火")).toBe("烈焰");
  });
  it("最短推导树每一级都通向更浅的节点", () => {
    for (const [id, inputs] of Object.entries(atlas.path))
      for (const ingredient of inputs)
        expect(atlas.depth.get(ingredient)!).toBeLessThan(atlas.depth.get(id)!);
  });
});
describe("存档与工作台", () => {
  it("首次合成记录真实父节点，存档往返一致", () => {
    const s = fresh(),
      next = transmute(s, s.board[0].uid, s.board[1].uid);
    expect(next.known.at(-1)).toBe("蒸汽");
    expect(next.board).toHaveLength(3);
    expect(next.lineage["蒸汽"]).toEqual(["水", "火"]);
    expect(decode(JSON.stringify(next))).toEqual(next);
  });
  it("一张铭牌不能与自身合成，两份相同元素可以", () => {
    const s = fresh();
    expect(transmute(s, s.board[0].uid, s.board[0].uid)).toBe(s);
    s.board.push({ ...s.board[0], uid: "copy" });
    expect(transmute(s, s.board[0].uid, "copy").known).toContain("湖泊");
  });
  it("拒绝断裂的谱系、错误坐标与不兼容版本", () => {
    const s = fresh();
    expect(() =>
      decode(JSON.stringify({ ...s, known: [...s.known, "银河"] })),
    ).toThrow();
    expect(() =>
      decode(JSON.stringify({ ...s, board: [{ ...s.board[0], x: -1 }] })),
    ).toThrow();
    expect(() => decode(JSON.stringify({ ...s, version: 2 }))).toThrow();
  });
});
