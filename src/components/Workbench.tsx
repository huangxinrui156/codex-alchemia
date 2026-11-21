import {
  useRef,
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type PointerEvent as PE,
} from "react";
import { byId, combine, type Element } from "../engine/graph";
import { transmute, type Save, type Token } from "../engine/save";
import { tone } from "../engine/audio";
import { CardFace, Icon } from "./Artwork";
import { Celestial } from "./Celestial";
import { Search, Filters, type Filter } from "./Filters";
import { Modal } from "./Modal";

type Drag = {
  uid: string;
  pointer: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  w: number;
  h: number;
  sw: number;
  sh: number;
  moved: boolean;
  held: boolean;
  target?: string;
};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const position = (p: number, size: string) =>
  `calc(${p * 100}% - ${p} * var(--${size}))`;
export function Workbench({
  save,
  setSave,
  notify,
}: {
  save: Save;
  setSave: Dispatch<SetStateAction<Save>>;
  notify: (s: string) => void;
}) {
  const [query, search] = useState(""),
    [filter, setFilter] = useState<Filter>("全部"),
    [open, setOpen] = useState(true),
    [clear, askClear] = useState(false);
  const field = useRef<HTMLDivElement>(null),
    drag = useRef<Drag | null>(null),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined),
    frame = useRef(0);
  const [preview, setPreview] = useState<Drag | null>(null),
    [burst, setBurst] = useState<{ uid: string; time: number } | null>(null),
    [chosen, choose] = useState("");
  const lastTap = useRef({ uid: "", time: 0 }),
    fingers = useRef(new Set<number>()),
    multi = useRef<{ x: number; y: number; at: number; valid: boolean } | null>(
      null,
    ),
    swipe = useRef<number | null>(null);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
      cancelAnimationFrame(frame.current);
    },
    [],
  );
  const play = () => {
    if (save.sound) tone("touch");
  };
  function add(id: string, near?: Token) {
    play();
    setSave((s) => {
      const i = s.board.length,
        offset = near?.x && near.x > 0.72 ? -0.1 : 0.1;
      const x = near
          ? clamp(near.x + offset)
          : clamp(0.49 + Math.sin(i * 2.4) * 0.12),
        y = near
          ? clamp(near.y + (near.y > 0.76 ? -0.14 : 0.14))
          : clamp(0.5 + Math.cos(i * 2.4) * 0.15);
      return {
        ...s,
        board: [...s.board, { uid: crypto.randomUUID(), id, x, y }],
      };
    });
  }
  function react(a: Token, b: Token) {
    choose("");
    const result = combine(a.id, b.id);
    if (!result) {
      notify("「" + a.id + "」与「" + b.id + "」暂时没有反应");
      return false;
    }
    if (save.sound) tone("mix");
    setSave((s) => transmute(s, a.uid, b.uid));
    setBurst({ uid: b.uid, time: Date.now() });
    notify(
      (save.known.includes(result) ? "合成成功" : "新发现") +
        " · " +
        a.id +
        " + " +
        b.id +
        " → " +
        result,
    );
    return true;
  }
  function cancelDrag() {
    clearTimeout(timer.current);
    cancelAnimationFrame(frame.current);
    drag.current = null;
    setPreview(null);
  }
  function start(e: PE<HTMLButtonElement>, t: Token) {
    if (e.button !== 0 || fingers.current.size > 1 || drag.current) return;
    const button = e.currentTarget,
      r = button.getBoundingClientRect(),
      box = field.current!.getBoundingClientRect();
    button.setPointerCapture(e.pointerId);
    const d: Drag = {
      uid: t.uid,
      pointer: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      x: t.x,
      y: t.y,
      dx: 0,
      dy: 0,
      w: r.width,
      h: r.height,
      sw: Math.max(1, box.width - r.width),
      sh: Math.max(1, box.height - r.height),
      moved: false,
      held: false,
    };
    drag.current = d;
    timer.current = setTimeout(() => {
      if (drag.current === d && !d.moved) {
        d.held = true;
        add(t.id, t);
        notify("已复制「" + t.id + "」");
      }
    }, 520);
  }
  function move(e: PE<HTMLButtonElement>) {
    const d = drag.current;
    if (!d || d.pointer !== e.pointerId || d.held) return;
    d.dx = e.clientX - d.startX;
    d.dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(d.dx, d.dy) < 5) return;
    if (!d.moved) {
      play();
      choose("");
    }
    d.moved = true;
    clearTimeout(timer.current);
    const x = clamp(d.x + d.dx / d.sw),
      y = clamp(d.y + d.dy / d.sh);
    let closest = Infinity;
    d.target = undefined;
    for (const t of save.board) {
      const dx = ((t.x - x) * d.sw) / d.w,
        dy = ((t.y - y) * d.sh) / d.h,
        dist = Math.hypot(dx, dy);
      if (
        t.uid !== d.uid &&
        Math.abs(dx) < 0.8 &&
        Math.abs(dy) < 0.8 &&
        dist < closest
      ) {
        closest = dist;
        d.target = t.uid;
      }
    }
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setPreview({ ...d }));
  }
  function tap(t: Token) {
    const now = performance.now();
    if (lastTap.current.uid === t.uid && now - lastTap.current.time < 350) {
      add(t.id, t);
      lastTap.current = { uid: "", time: 0 };
      choose("");
      return;
    }
    lastTap.current = { uid: t.uid, time: now };
    const other = save.board.find((p) => p.uid === chosen && p.uid !== t.uid);
    if (other) {
      react(t, other);
      return;
    }
    choose(t.uid === chosen ? "" : t.uid);
    play();
  }
  function end(e: PE<HTMLButtonElement>, t: Token) {
    const d = drag.current;
    if (!d || d.pointer !== e.pointerId) return;
    cancelDrag();
    if (d.held) return;
    if (!d.moved) {
      tap(t);
      return;
    }
    const target = save.board.find((p) => p.uid === d.target);
    if (target && react(t, target)) return;
    if (!target)
      setSave((s) => ({
        ...s,
        board: s.board.map((p) =>
          p.uid === t.uid
            ? { ...p, x: clamp(d.x + d.dx / d.sw), y: clamp(d.y + d.dy / d.sh) }
            : p,
        ),
      }));
  }
  const visible = save.known
    .map((id) => byId.get(id)!)
    .filter(
      (e: Element) =>
        (filter === "全部" || filter === e.category) &&
        (e.id + " " + e.en).toLowerCase().includes(query.trim().toLowerCase()),
    );
  return (
    <>
      <section className="field frame" aria-label="炼金画布">
        <div className="field-label">
          <span className="live-dot" />
          合成区域 <span className="eng">/ TRANSMUTATION FIELD</span>
        </div>
        <button
          className="clear-btn"
          disabled={!save.board.length}
          onClick={() => askClear(true)}
        >
          <Icon name="trash" size={14} />
          清空桌面
        </button>
        <Celestial />
        <div
          className="drag-field"
          ref={field}
          onPointerDownCapture={(e) => {
            fingers.current.add(e.pointerId);
            if (fingers.current.size === 2) {
              cancelDrag();
              multi.current = {
                x: e.clientX,
                y: e.clientY,
                at: Date.now(),
                valid: true,
              };
              e.currentTarget.setPointerCapture(e.pointerId);
            }
          }}
          onPointerMoveCapture={(e) => {
            const m = multi.current;
            if (m && Math.hypot(e.movementX, e.movementY) > 8) m.valid = false;
          }}
          onPointerCancelCapture={(e) => {
            fingers.current.delete(e.pointerId);
            multi.current = null;
            cancelDrag();
          }}
          onPointerUpCapture={(e) => {
            fingers.current.delete(e.pointerId);
            if (!fingers.current.size && multi.current) {
              if (
                multi.current.valid &&
                Date.now() - multi.current.at < 550 &&
                save.board.length
              )
                askClear(true);
              multi.current = null;
            }
          }}
        >
          {save.board.map((t) => {
            const d = preview?.uid === t.uid ? preview : null;
            const x = d ? clamp(t.x + d.dx / d.sw) : t.x,
              y = d ? clamp(t.y + d.dy / d.sh) : t.y;
            return (
              <button
                key={t.uid}
                className={[
                  "token",
                  byId.get(t.id)?.category === "奇观" ? "rare" : "",
                  d ? "dragging" : "",
                  preview?.target === t.uid ? "magnetic" : "",
                  chosen === t.uid ? "selected" : "",
                ].join(" ")}
                aria-label={t.id + "，选择或拖动合成"}
                aria-pressed={chosen === t.uid}
                style={{ left: position(x, "tw"), top: position(y, "th") }}
                onPointerDown={(e) => start(e, t)}
                onPointerMove={move}
                onPointerUp={(e) => end(e, t)}
                onClick={(e) => {
                  if (e.detail === 0) tap(t);
                }}
                onKeyDown={(e) => {
                  if (e.key === "d") {
                    add(t.id, t);
                  }
                }}
              >
                <CardFace id={t.id} />
                {burst?.uid === t.uid && (
                  <span className="burst" key={burst.time} aria-hidden="true">
                    {Array.from({ length: 14 }, (_, i) => (
                      <b
                        key={i}
                        style={{
                          transform: "rotate(" + (i * 360) / 14 + "deg)",
                        }}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="field-foot">
          <span>
            <Icon name="hand" size={13} />
            {chosen ? "再选一张铭牌进行合成" : "拖动元素重叠以合成"}
          </span>
          <span className="field-count">
            桌面元素 <b>{String(save.board.length).padStart(2, "0")}</b>
          </span>
        </div>
      </section>
      <section className="shelf">
        <button
          className="drawer-handle"
          aria-label={open ? "收起元素抽屉" : "展开元素抽屉"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          onPointerDown={(e) => {
            swipe.current = e.clientY;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerUp={(e) => {
            if (
              swipe.current !== null &&
              Math.abs(e.clientY - swipe.current) > 18
            ) {
              setOpen(e.clientY < swipe.current);
              e.preventDefault();
              swipe.current = -9999;
            } else swipe.current = null;
          }}
          onClickCapture={(e) => {
            if (swipe.current === -9999) {
              e.stopPropagation();
              swipe.current = null;
            }
          }}
        >
          <span />
        </button>
        <div className="shelf-head">
          <button
            className="shelf-title"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            <Icon name="drawer" size={23} />
            <h2>元素抽屉</h2>
            <i>Element Drawer</i>
            <small>{String(save.known.length).padStart(2, "0")}</small>
          </button>
          {open && (
            <Search query={query} set={search} placeholder="搜索已发现元素…" />
          )}
        </div>
        {open && (
          <>
            <Filters filter={filter} set={setFilter} />
            <div className="shelf-grid">
              {visible.map((el) => (
                <button
                  className={
                    "shelf-card " + (el.category === "奇观" ? "rare" : "")
                  }
                  key={el.id}
                  onClick={() => add(el.id)}
                  aria-label={"投放" + el.id}
                >
                  <CardFace id={el.id} />
                  <span className="add-sign">+</span>
                </button>
              ))}
              {!visible.length && <p className="empty">没有匹配的已发现元素</p>}
            </div>
          </>
        )}
      </section>
      {clear && (
        <Modal title="清空工作台？" onClose={() => askClear(false)}>
          <p>
            将移除桌面的 {save.board.length}{" "}
            张铭牌，已发现的元素仍可从抽屉取用。
          </p>
          <div className="actions">
            <button onClick={() => askClear(false)}>取消</button>
            <button
              className="primary"
              onClick={() => {
                setSave((s) => ({ ...s, board: [] }));
                choose("");
                askClear(false);
              }}
            >
              清空桌面
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
