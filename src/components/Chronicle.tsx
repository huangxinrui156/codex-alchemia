import { useRef, useState } from "react";
import { fresh, decode, type Save } from "../engine/save";
import { milestones } from "../engine/milestones";
import { Icon } from "./Artwork";
import { Modal } from "./Modal";
export function Chronicle({
  save,
  replace,
  notify,
}: {
  save: Save;
  replace: (s: Save) => void;
  notify: (s: string) => void;
}) {
  const [modal, show] = useState<"export" | "import" | "reset" | null>(null),
    [value, set] = useState(""),
    [error, fail] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const text = JSON.stringify(save, null, 2);
  function download() {
    const u = URL.createObjectURL(
      new Blob([text], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = u;
    a.download = "codex-alchemia.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  }
  return (
    <>
      <div className="record-stats">
        {[
          [save.known.length, "已发现元素"],
          [save.mixes, "成功合成"],
          [
            milestones.filter(([, , get, n]) => get(save) >= n).length +
              " / 18",
            "已达成里程碑",
          ],
        ].map(([n, label]) => (
          <div key={label}>
            <strong>{n}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <section className="panel save-panel">
        <div>
          <h2>
            探索存档 <i>Archive</i>
          </h2>
          <p>进度自动保存于此设备，可通过 JSON 迁移。</p>
        </div>
        <div className="actions">
          <button onClick={() => show("export")}>导出存档</button>
          <button
            onClick={() => {
              show("import");
              set("");
              fail("");
            }}
          >
            导入存档
          </button>
          <button onClick={() => show("reset")}>新周目</button>
        </div>
      </section>
      <section className="panel">
        <h2>
          炼金成就 <i>Milestones</i>
        </h2>
        <div className="achievements">
          {milestones.map(([name, hint, get, max]) => {
            const n = Math.min(max, get(save));
            return (
              <article key={name} className={n === max ? "achieved" : ""}>
                <Icon name="trophy" size={24} />
                <div>
                  <h3>{name}</h3>
                  <p>{hint}</p>
                  <progress max={max} value={n} />
                  <small>
                    {n} / {max}
                  </small>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {modal && (
        <Modal
          title={
            {
              export: "导出探索存档",
              import: "导入探索存档",
              reset: "开启新周目？",
            }[modal]
          }
          onClose={() => show(null)}
        >
          {modal === "export" && (
            <>
              <label>
                JSON 存档码
                <textarea
                  readOnly
                  value={text}
                  onFocus={(e) => e.target.select()}
                />
              </label>
              <div className="actions">
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(text);
                      notify("存档码已复制");
                    } catch {
                      notify("请选择并复制上方存档码");
                    }
                  }}
                >
                  复制存档码
                </button>
                <button className="primary" onClick={download}>
                  下载 JSON
                </button>
              </div>
            </>
          )}
          {modal === "import" && (
            <>
              <p>导入后会替换当前进度与桌面布局。</p>
              <label>
                粘贴 JSON 存档码
                <textarea
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder="粘贴完整的 JSON 内容"
                />
              </label>
              <input
                ref={file}
                type="file"
                accept=".json,application/json"
                hidden
                onChange={async (e) => {
                  try {
                    const f = e.target.files?.[0];
                    if (f) set(await f.text());
                  } catch {
                    fail("文件读取失败");
                  }
                }}
              />
              {error && <p role="alert">{error}</p>}
              <div className="actions">
                <button onClick={() => file.current?.click()}>选择文件</button>
                <button
                  className="primary"
                  disabled={!value.trim()}
                  onClick={() => {
                    try {
                      replace(decode(value));
                      show(null);
                      notify("存档已导入");
                    } catch (e) {
                      fail(
                        e instanceof SyntaxError
                          ? "JSON 格式有误，请检查存档码"
                          : (e as Error).message,
                      );
                    }
                  }}
                >
                  确认导入
                </button>
              </div>
            </>
          )}
          {modal === "reset" && (
            <>
              <p>
                当前探索记录及桌面将被重置。若要保留这段旅程，请先导出存档。
              </p>
              <div className="actions">
                <button onClick={() => show(null)}>取消</button>
                <button
                  className="primary"
                  onClick={() => {
                    replace(fresh());
                    show(null);
                    notify("已开启新周目");
                  }}
                >
                  重置进度
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </>
  );
}
