import { useMemo, useRef, useState, useLayoutEffect } from "react";
import type { Route } from "./+types/compare";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Test Page" },
    { name: "description", content: "Dummy text page" },
  ];
}

export default function Test() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [fileAName, setFileAName] = useState("");
  const [fileBName, setFileBName] = useState("");
  const [mode, setMode] = useState<"common" | "diff">("common");

  const areaARef = useRef<HTMLTextAreaElement>(null);
  const areaBRef = useRef<HTMLTextAreaElement>(null);
  const lastHeightRef = useRef<number>();

  useLayoutEffect(() => {
    const a = areaARef.current;
    const b = areaBRef.current;
    if (!a || !b) return;

    const update = () => {
      const max = Math.max(a.clientHeight, b.clientHeight);
      if (lastHeightRef.current !== max) {
        lastHeightRef.current = max;
        a.style.height = `${max}px`;
        b.style.height = `${max}px`;
      }
    };

    const observer = new ResizeObserver(update);
    observer.observe(a);
    observer.observe(b);
    update();
    return () => observer.disconnect();
  }, []);

  const handleFileA = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileAName(file.name);
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder("shift-jis").decode(buffer);
    setTextA(content);
  };

  const handleFileB = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileBName(file.name);
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder("shift-jis").decode(buffer);
    setTextB(content);
  };

  const wordsA = useMemo(() => {
    return new Set(
      textA
        .split(/\r?\n/)
        .map((w) => w.trim())
        .filter(Boolean)
    );
  }, [textA]);

  const wordsB = useMemo(() => {
    return new Set(
      textB
        .split(/\r?\n/)
        .map((w) => w.trim())
        .filter(Boolean)
    );
  }, [textB]);

  const results = useMemo(() => {
    if (mode === "common") {
      const list: { word: string; from?: string }[] = [];
      for (const w of wordsA) {
        if (wordsB.has(w)) list.push({ word: w });
      }
      return list;
    }
    const list: { word: string; from: string }[] = [];
    for (const w of wordsA) {
      if (!wordsB.has(w)) list.push({ word: w, from: "A" });
    }
    for (const w of wordsB) {
      if (!wordsA.has(w)) list.push({ word: w, from: "B" });
    }
    return list;
  }, [mode, wordsA, wordsB]);

  return (
    <main className="pt-16 p-4 container mx-auto space-y-4">
      <div className="grid grid-cols-2 gap-4 grid-rows-[auto_1fr]">
        <div>
          <label htmlFor="areaA" className="font-bold">A</label>
          <input
            type="file"
            accept="text/*"
            onChange={handleFileA}
            className="block w-fit mt-1 text-sm file:mr-2 file:rounded file:border file:border-gray-300 file:bg-gray-50 file:px-2 file:py-1 file:text-gray-700 hover:file:bg-gray-100 text-transparent cursor-pointer"
          />
          <div className="mt-1 text-sm break-words whitespace-pre-wrap">
            {fileAName || "選択されていません"}
          </div>
        </div>
        <div>
          <label htmlFor="areaB" className="font-bold">B</label>
          <input
            type="file"
            accept="text/*"
            onChange={handleFileB}
            className="block w-fit mt-1 text-sm file:mr-2 file:rounded file:border file:border-gray-300 file:bg-gray-50 file:px-2 file:py-1 file:text-gray-700 hover:file:bg-gray-100 text-transparent cursor-pointer"
          />
          <div className="mt-1 text-sm break-words whitespace-pre-wrap">
            {fileBName || "選択されていません"}
          </div>
        </div>
        <div className="h-full col-start-1 row-start-2">
          <textarea
            ref={areaARef}
            id="areaA"
            rows={10}
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            wrap="off"
            className="w-full h-full resize-y border p-2 rounded mt-1 overflow-x-auto whitespace-pre font-mono"
          />
        </div>
        <div className="h-full col-start-2 row-start-2">
          <textarea
            ref={areaBRef}
            id="areaB"
            rows={10}
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            wrap="off"
            className="w-full h-full resize-y border p-2 rounded mt-1 overflow-x-auto whitespace-pre font-mono"
          />
        </div>
      </div>
      <div className="space-x-4">
        <label className="cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="common"
            checked={mode === "common"}
            onChange={() => setMode("common")}
            className="mr-1"
          />
          どっちにもある単語
        </label>
        <label className="cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="diff"
            checked={mode === "diff"}
            onChange={() => setMode("diff")}
            className="mr-1"
          />
          どっちかにしかない単語
        </label>
      </div>
      <ul className="list-disc pl-6 overflow-x-auto whitespace-nowrap font-mono">
        {results.map((r) => (
          <li key={r.word} className="whitespace-nowrap">
            {r.word}
            {mode === "diff" && (
              <span className="text-sm text-gray-500 select-none"> ({r.from})</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
