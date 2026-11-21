import { useState } from "react";
import {
  elements,
  byId,
  categories,
  clue,
  number,
  type Element,
  type Pair,
} from "../engine/graph";
import type { Save } from "../engine/save";
import { CardFace, Icon, Emblem } from "./Artwork";
import { Modal } from "./Modal";
import { Filters, Search, type Filter } from "./Filters";

function Tree({
  id,
  lineage,
  level = 0,
}: {
  id: string;
  lineage: Record<string, Pair>;
  level?: number;
}) {
  const [open, toggle] = useState(level < 2),
    pair = lineage[id];
  return (
    <li>
      <button
        className="tree-node"
        disabled={!pair}
        aria-expanded={pair ? open : undefined}
        onClick={() => toggle(!open)}
      >
        <Emblem id={id} />
        {id}
        <i>{byId.get(id)?.en}</i>
        {pair && <span>{open ? "−" : "+"}</span>}
      </button>
      {pair && open && (
        <ul>
          {pair.map((p, i) => (
            <Tree key={i} id={p} lineage={lineage} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
export function Compendium({ save }: { save: Save }) {
  const [query, search] = useState(""),
    [filter, setFilter] = useState<Filter>("全部"),
    [selected, select] = useState<Element | null>(null),
    [knownOnly, toggleKnown] = useState(false),
    [page, setPage] = useState(1);
  const found = new Set(save.known),
    filtered = elements.filter(
      (e) =>
        (filter === "全部" || e.category === filter) &&
        (!knownOnly || found.has(e.id)) &&
        ((found.has(e.id) ? e.id + " " + e.en : "未发现") + " " + number(e.no))
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    );
  const size = 32,
    pages = Math.ceil(filtered.length / size);
  return (
    <>
      <div className="category-stats">
        {categories.map((c) => {
          const all = elements.filter((e) => e.category === c),
            n = all.filter((e) => found.has(e.id)).length;
          return (
            <button
              key={c}
              onClick={() => {
                setFilter(c);
                setPage(1);
              }}
            >
              <b>{c}</b>
              <span>
                {n} / {all.length}
              </span>
              <progress value={n} max={all.length} />
            </button>
          );
        })}
      </div>
      <section className="panel">
        <div className="panel-head">
          <h2>
            馆藏目录 <i>Catalogue</i>
          </h2>
          <Search
            query={query}
            set={(s) => {
              search(s);
              setPage(1);
            }}
            placeholder="搜索名称或编号…"
          />
        </div>
        <Filters
          filter={filter}
          set={(s) => {
            setFilter(s);
            setPage(1);
          }}
        />
        <label className="check">
          <input
            type="checkbox"
            checked={knownOnly}
            onChange={(e) => {
              toggleKnown(e.target.checked);
              setPage(1);
            }}
          />
          仅看已发现
        </label>
        <div className="catalog-grid">
          {filtered.slice((page - 1) * size, page * size).map((e) => (
            <button
              key={e.id}
              onClick={() => select(e)}
              className={
                "catalog-card " +
                (found.has(e.id) ? "unlocked" : "locked") +
                (e.category === "奇观" ? " rare" : "")
              }
            >
              {found.has(e.id) ? (
                <CardFace id={e.id} />
              ) : (
                <>
                  <Icon name="lock" />
                  <div>
                    <small>№ {number(e.no)}</small>
                    <b>未发现</b>
                    <i>{e.category} · 查看线索</i>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
        {!filtered.length && <p className="empty">没有找到匹配的词条</p>}
        {pages > 1 && (
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              上一页
            </button>
            <span>
              {page} / {pages}
            </span>
            <button disabled={page === pages} onClick={() => setPage(page + 1)}>
              下一页
            </button>
          </div>
        )}
      </section>
      {selected && (
        <Modal
          title={found.has(selected.id) ? "合成谱系" : "未发现的藏品"}
          onClose={() => select(null)}
        >
          <div className="detail-hero">
            {found.has(selected.id) ? (
              <Emblem id={selected.id} />
            ) : (
              <Icon name="lock" size={38} />
            )}
            <div>
              <small>
                № {number(selected.no)} · {selected.category}
              </small>
              <h3>{found.has(selected.id) ? selected.id : "未知元素"}</h3>
              {found.has(selected.id) && <i>{selected.en}</i>}
            </div>
          </div>
          {found.has(selected.id) ? (
            <>
              {save.lineage[selected.id] ? (
                <>
                  <p>首次发现的合成路径。点击节点可展开原料。</p>
                  <ul className="tree">
                    <Tree id={selected.id} lineage={save.lineage} />
                  </ul>
                </>
              ) : (
                <p>这是旅程开始时便拥有的四种初始元素之一。</p>
              )}
            </>
          ) : (
            <p className="clue">{clue(selected.id)}</p>
          )}
        </Modal>
      )}
    </>
  );
}
