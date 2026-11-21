import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Artwork";
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current!;
    el.showModal();
    return () => el.close();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <article className="modal-content">
        <header>
          <h2>{title}</h2>
          <button className="icon-btn" aria-label="关闭" onClick={onClose}>
            <Icon name="close" />
          </button>
        </header>
        {children}
      </article>
    </dialog>
  );
}
