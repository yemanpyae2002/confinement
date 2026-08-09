"use client";

import { useEffect, useState } from "react";

const KEY = "cfsg_compare";
const MAX = 3;

function readSel(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function writeSel(v: string[]) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

export default function CompareBar() {
  const [sel, setSel] = useState<string[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    setSel(readSel());

    const boxes = Array.from(document.querySelectorAll<HTMLInputElement>("[data-cmp]"));
    const nameMap: Record<string, string> = {};
    boxes.forEach((b) => (nameMap[b.value] = b.dataset.name || b.value));
    setNames(nameMap);

    const initial = readSel();
    boxes.forEach((b) => {
      b.checked = initial.includes(b.value);
      b.disabled = !b.checked && initial.length >= MAX;
    });

    function onChange(e: Event) {
      const b = e.target as HTMLInputElement;
      setSel((prev) => {
        let next = prev;
        const i = prev.indexOf(b.value);
        if (b.checked && i === -1) {
          if (prev.length >= MAX) {
            b.checked = false;
            return prev;
          }
          next = [...prev, b.value];
        } else if (!b.checked && i > -1) {
          next = prev.filter((x) => x !== b.value);
        }
        writeSel(next);
        boxes.forEach((bb) => {
          bb.checked = next.includes(bb.value);
          bb.disabled = !bb.checked && next.length >= MAX;
        });
        return next;
      });
    }

    boxes.forEach((b) => b.addEventListener("change", onChange));
    return () => boxes.forEach((b) => b.removeEventListener("change", onChange));
  }, []);

  function clearAll() {
    setSel([]);
    writeSel([]);
    document.querySelectorAll<HTMLInputElement>("[data-cmp]").forEach((b) => {
      b.checked = false;
      b.disabled = false;
    });
  }

  if (sel.length === 0) return null;

  return (
    <div className="cmpbar show">
      <span>
        Comparing <b>{sel.length}</b> of {MAX}
        <span className="names">{sel.map((s) => names[s] || s).join(", ")}</span>
      </span>
      <span>
        <button className="linkbtn" type="button" style={{ color: "#fff", marginRight: 12 }} onClick={clearAll}>
          Clear
        </button>
        <a className="btn btn-sm" href={`/compare/?ids=${sel.join(",")}`}>
          Compare now
        </a>
      </span>
    </div>
  );
}
