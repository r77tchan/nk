import { useMemo, useState } from "react";
import type { Route } from "./+types/ex";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "抽出" },
    { name: "description", content: "データ抽出ページ" },
  ];
}

export default function Extract() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [fileAName, setFileAName] = useState("");
  const [fileBName, setFileBName] = useState("");
  const [typeA, setTypeA] = useState<"text" | "csv">("text");
  const [typeB, setTypeB] = useState<"text" | "csv">("text");
  const [startA, setStartA] = useState(1);
  const [endA, setEndA] = useState(9999);
  const [startB, setStartB] = useState(1);
  const [endB, setEndB] = useState(9999);
  const [colA, setColA] = useState(1);
  const [colB, setColB] = useState(1);

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

  const parseCsv = (line: string): string[] => {
    const res: string[] = [];
    let cur = "";
    let quote = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (quote && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          quote = !quote;
        }
      } else if (ch === ',' && !quote) {
        res.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    res.push(cur);
    return res.map((v) => {
      let t = v.trim();
      if (t.startsWith('"') && t.endsWith('"')) {
        t = t.slice(1, -1);
      }
      return t;
    });
  };

  const extract = (
    text: string,
    type: "text" | "csv",
    start: number,
    end: number,
    col: number
  ): { list: string[]; error?: string } => {
    const lines = text.split(/\r?\n/);
    const result: string[] = [];
    if (type === "text") {
      const s = Math.max(0, start - 1);
      const e = Math.min(end, 9999);
      for (const line of lines) {
        const part = line.slice(s, Math.min(e, line.length));
        const trimmed = part.trim();
        if (trimmed) result.push(trimmed);
      }
      return { list: Array.from(new Set(result)) };
    }
    for (const line of lines) {
      if (!line.trim()) continue;
      const arr = parseCsv(line);
      if (col < 1 || col > arr.length) {
        return { list: [], error: "指定された列は存在しません" };
      }
      const value = arr[col - 1].trim();
      if (value) result.push(value);
    }
    return { list: Array.from(new Set(result)) };
  };

  const processedA = useMemo(
    () => extract(textA, typeA, startA, endA, colA),
    [textA, typeA, startA, endA, colA]
  );

  const processedB = useMemo(
    () => extract(textB, typeB, startB, endB, colB),
    [textB, typeB, startB, endB, colB]
  );

  const results = useMemo(() => {
    if (processedA.error || processedB.error) return [] as string[];
    const targets = processedA.list;
    const words = new Set(processedB.list);
    if (words.size === 0) return targets;
    const list: string[] = [];
    for (const t of targets) {
      if (words.has(t)) list.push(t);
    }
    return list;
  }, [processedA, processedB]);

  return (
    <main className="pt-16 p-4 container mx-auto space-y-4">
      <h1 className="text-xl font-bold">抽出</h1>
      <div className="grid grid-cols-2 gap-4 grid-rows-[auto_1fr]">
        <div>
          <label htmlFor="areaA" className="font-bold">抽出対象</label>
          <label className="block w-fit mt-1 text-sm cursor-pointer">
            <span className="inline-block file:mr-2 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-gray-700 hover:bg-gray-100">
              ファイルを選択
            </span>
            <input
              type="file"
              accept="text/*"
              onChange={handleFileA}
              className="hidden"
            />
          </label>
          <div className="mt-1 text-sm break-words whitespace-pre-wrap">
            {fileAName || "選択されていません"}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="typeA"
                value="text"
                checked={typeA === "text"}
                onChange={() => setTypeA("text")}
                className="mr-1"
              />
              テキスト
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="typeA"
                value="csv"
                checked={typeA === "csv"}
                onChange={() => setTypeA("csv")}
                className="mr-1"
              />
              csv
            </label>
            {typeA === "text" ? (
              <>
                <input
                  type="number"
                  value={startA}
                  onChange={(e) => setStartA(Number(e.target.value))}
                  className="border w-20 px-1 py-0.5 text-right"
                  min={1}
                  max={9999}
                />
                <span>~</span>
                <input
                  type="number"
                  value={endA}
                  onChange={(e) => setEndA(Number(e.target.value))}
                  className="border w-20 px-1 py-0.5 text-right"
                  min={1}
                  max={9999}
                />
              </>
            ) : (
              <input
                type="number"
                value={colA}
                onChange={(e) => setColA(Number(e.target.value))}
                className="border w-20 px-1 py-0.5 text-right"
                min={1}
              />
            )}
          </div>
          {processedA.error && (
            <div className="text-sm text-red-600 mt-1">{processedA.error}</div>
          )}
        </div>
        <div>
          <label htmlFor="areaB" className="font-bold">抽出単語</label>
          <label className="block w-fit mt-1 text-sm cursor-pointer">
            <span className="inline-block file:mr-2 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-gray-700 hover:bg-gray-100">
              ファイルを選択
            </span>
            <input
              type="file"
              accept="text/*"
              onChange={handleFileB}
              className="hidden"
            />
          </label>
          <div className="mt-1 text-sm break-words whitespace-pre-wrap">
            {fileBName || "選択されていません"}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <label className="cursor-pointer">
              <input
                type="radio"
                name="typeB"
                value="text"
                checked={typeB === "text"}
                onChange={() => setTypeB("text")}
                className="mr-1"
              />
              テキスト
            </label>
            <label className="cursor-pointer">
              <input
                type="radio"
                name="typeB"
                value="csv"
                checked={typeB === "csv"}
                onChange={() => setTypeB("csv")}
                className="mr-1"
              />
              csv
            </label>
            {typeB === "text" ? (
              <>
                <input
                  type="number"
                  value={startB}
                  onChange={(e) => setStartB(Number(e.target.value))}
                  className="border w-20 px-1 py-0.5 text-right"
                  min={1}
                  max={9999}
                />
                <span>~</span>
                <input
                  type="number"
                  value={endB}
                  onChange={(e) => setEndB(Number(e.target.value))}
                  className="border w-20 px-1 py-0.5 text-right"
                  min={1}
                  max={9999}
                />
              </>
            ) : (
              <input
                type="number"
                value={colB}
                onChange={(e) => setColB(Number(e.target.value))}
                className="border w-20 px-1 py-0.5 text-right"
                min={1}
              />
            )}
          </div>
          {processedB.error && (
            <div className="text-sm text-red-600 mt-1">{processedB.error}</div>
          )}
        </div>
        <textarea
          id="areaA"
          rows={2}
          value={textA}
          onChange={(e) => setTextA(e.target.value)}
          wrap="off"
          className="w-full border p-2 rounded mt-1 overflow-x-auto whitespace-pre col-start-1 row-start-2 font-mono"
        />
        <textarea
          id="areaB"
          rows={2}
          value={textB}
          onChange={(e) => setTextB(e.target.value)}
          wrap="off"
          className="w-full border p-2 rounded mt-1 overflow-x-auto whitespace-pre col-start-2 row-start-2 font-mono"
        />
      </div>
      <ul className="list-disc pl-6 overflow-x-auto whitespace-nowrap font-mono">
        {results.map((r) => (
          <li key={r} className="whitespace-nowrap">
            {r}
          </li>
        ))}
      </ul>
    </main>
  );
}
