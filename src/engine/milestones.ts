import { byId, elements } from "./graph";
import type { Save } from "./save";
type Milestone = [string, string, (s: Save) => number, number];
const count = (s: Save) => s.known.length;
const mixes = (s: Save) => s.mixes;
const collect =
  (...ids: string[]) =>
  (s: Save) =>
    ids.filter((x) => s.known.includes(x)).length;
const category = (name: string) => (s: Save) =>
  s.known.filter((id) => byId.get(id)?.category === name).length;
export const milestones: Milestone[] = [
  ["初窥门径", "完成第一次合成", mixes, 1],
  ["初级博物家", "发现 25 个元素", count, 25],
  ["百物入册", "发现 100 个元素", count, 100],
  ["博闻多识", "发现 200 个元素", count, 200],
  ["造物主视角", "收集全部元素", count, elements.length],
  ["炉火不息", "完成 50 次合成", mixes, 50],
  ["千锤百炼", "完成 200 次合成", mixes, 200],
  ["山河入卷", "发现 40 种自然元素", category("自然"), 40],
  ["生命之初", "发现细胞", collect("细胞"), 1],
  ["林间漫游", "发现 30 种生命元素", category("生命"), 30],
  ["能工巧匠", "发现 30 种造物", category("造物"), 30],
  ["文明曙光", "建立村落", collect("村落"), 1],
  ["工业革命", "发现蒸汽机与工厂", collect("蒸汽机", "工厂"), 2],
  ["仰望星空", "发现望远镜与天文台", collect("望远镜", "天文台"), 2],
  ["思想之光", "发现哲学与逻辑", collect("哲学", "逻辑"), 2],
  ["星际旅人", "发现空间站", collect("空间站"), 1],
  ["神话初现", "发现第一件奇观", category("奇观"), 1],
  ["万象归典", "集齐十五件奇观", category("奇观"), 15],
];
