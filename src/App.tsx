import { useEffect, useRef, useState } from "react";
import { elements } from "./engine/graph";
import { readSave, STORAGE } from "./engine/save";
import { tone } from "./engine/audio";
import { Icon, Seal } from "./components/Artwork";
import { Workbench } from "./components/Workbench";
import { Compendium } from "./components/Compendium";
import { Chronicle } from "./components/Chronicle";
import { Modal } from "./components/Modal";
const views = [
  {
    label: "炼金工作台",
    short: "工作台",
    en: "Workbench",
    icon: "flask",
    intro: "从四种原初元素开始，发现万物之间的隐秘联系。",
  },
  {
    label: "博物图鉴",
    short: "图鉴",
    en: "Compendium",
    icon: "book",
    intro: "翻阅已发现的造物，追溯每一条合成谱系。",
  },
  {
    label: "炼金手记",
    short: "手记",
    en: "Chronicle",
    icon: "archive",
    intro: "记录探索的里程碑，珍藏你的炼金旅程。",
  },
];
export default function App() {
  const [initial] = useState(readSave),
    [save, setSave] = useState(initial.save),
    [view, setView] = useState(0),
    [help, setHelp] = useState(false),
    [message, notify] = useState("");
  const [storageError, error] = useState(initial.warning),
    first = useRef(true),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (initial.warning) return;
    }
    try {
      localStorage.setItem(STORAGE, JSON.stringify(save));
      error("");
    } catch {
      error("此设备无法保存进度，请在手记中导出备份。");
    }
  }, [save]);
  useEffect(() => () => clearTimeout(timer.current), []);
  function toast(s: string) {
    notify(s);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => notify(""), 2800);
  }
  const meta = views[view];
  return (
    <>
      <header className="masthead">
        <div className="mast-inner">
          <div className="brand">
            <Seal />
            <div>
              <strong>万物炼金手记</strong>
              <span>CODEX ALCHEMIA</span>
            </div>
          </div>
          <div className="utilities">
            <button
              className={"sound " + (!save.sound ? "muted" : "")}
              aria-pressed={save.sound}
              aria-label={save.sound ? "关闭声音" : "开启声音"}
              onClick={() => {
                if (!save.sound) tone("touch");
                setSave((s) => ({ ...s, sound: !s.sound }));
              }}
            >
              <Icon name={save.sound ? "sound" : "mute"} size={16} />
              <span>声音{save.sound ? "开启" : "关闭"}</span>
            </button>
            <b />
            <button
              className="icon-btn"
              aria-label="操作指南"
              onClick={() => setHelp(true)}
            >
              <Icon name="help" size={20} />
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="intro">
          <div>
            <div className="eyebrow">
              <span /> THE ALCHEMIST’S{" "}
              {["WORKSPACE", "COMPENDIUM", "CHRONICLE"][view]}
            </div>
            <h1>
              {meta.label}
              <i>{meta.en}</i>
            </h1>
            <p>{meta.intro}</p>
          </div>
          <div className="discovery">
            <span className="discovery-icon">
              <Icon name="star" size={23} />
            </span>
            <div>
              <small>探索进度</small>
              <strong>
                {String(save.known.length).padStart(3, "0")}{" "}
                <em>/ {elements.length}</em>
              </strong>
              <progress
                aria-label="探索进度"
                max={elements.length}
                value={save.known.length}
              />
            </div>
          </div>
        </div>
        {storageError && <p role="alert">{storageError}</p>}
        {view === 0 ? (
          <Workbench save={save} setSave={setSave} notify={toast} />
        ) : view === 1 ? (
          <Compendium save={save} />
        ) : (
          <Chronicle save={save} replace={setSave} notify={toast} />
        )}
      </main>
      <nav className="bottom-nav" aria-label="主导航">
        <div>
          {views.map((v, i) => (
            <button
              key={v.en}
              className={view === i ? "active" : ""}
              aria-current={view === i ? "page" : undefined}
              onClick={() => {
                setView(i);
                window.scrollTo(0, 0);
              }}
            >
              <Icon name={v.icon} size={21} />
              <span>
                {v.short}
                <i>{v.en}</i>
              </span>
            </button>
          ))}
        </div>
      </nav>
      <div className={"toast " + (message ? "show" : "")} role="status">
        {message}
      </div>
      {help && (
        <Modal title="工作台操作指南" onClose={() => setHelp(false)}>
          <dl className="guide">
            <dt>投放与合成</dt>
            <dd>
              点击抽屉里的元素投放铭牌。拖动两张铭牌重叠后松手，或依次轻点两张铭牌尝试合成。
            </dd>
            <dt>复制与清空</dt>
            <dd>
              长按或双击铭牌即可复制。双指轻点画布或点击清空按钮，可清理桌面。
            </dd>
            <dt>键盘操作</dt>
            <dd>用 Tab 选中铭牌，按 Enter 选择两个原料，按 D 复制当前铭牌。</dd>
            <dt>查阅与存档</dt>
            <dd>
              在图鉴里查看合成谱系与未知线索，在手记里管理成就和 JSON 存档。
            </dd>
          </dl>
        </Modal>
      )}
    </>
  );
}
