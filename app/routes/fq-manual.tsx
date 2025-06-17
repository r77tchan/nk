import { useState } from "react";
import type { Route } from "./+types/fq-manual";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "FQ Manual" },
    { name: "description", content: "FQ 手動変換ツール" },
  ];
}

export default function FqManual() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const run = () => {
    setError(null);
    const rows1 = input1
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l !== "");
    const rows2 = input2
      .split(/\r?\n/)
      .map((l) => l.split("\t").map((c) => c.trim()));
    const results: string[] = [];

    for (const row of rows1) {
      const cols = row.split("\t").map((c) => c.trim());
      if (cols.length < 4) {
        setError("入力1の形式が不正です");
        return;
      }
      const [code, name, comment, unit] = cols;
      const idx = parseInt(code.slice(1, 4), 10) - 1;
      if (Number.isNaN(idx) || idx < 0 || !rows2[idx]) {
        setError(`入力2の ${idx + 1} 行目がありません`);
        return;
      }
      const cols2 = rows2[idx];
      if (cols2.length < 12) {
        setError("入力2の列数が不足しています");
        return;
      }
      const out = [
        code.charAt(0) + "31" + code.slice(1, 4),
        name,
        unit,
        cols2[2],
        cols2[3],
        cols2[4],
        cols2[5],
        cols2[8],
        cols2[9],
        cols2[10],
        cols2[11],
        comment,
      ]
        .map((v) => v.trim())
        .join("\t");
      results.push(out);
    }
    setOutput(results.join("\n"));
  };

  return (
    <main className="pt-16 p-4 container mx-auto space-y-4">
      <h1 className="text-xl font-bold">/fq-manual</h1>
      <label htmlFor="teigi">定義書「X001	項目名	定義	単位」</label>
      <textarea
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        rows={4}
        wrap="off"
        className="w-full border p-2 rounded font-mono overflow-x-auto"
        id="teigi"
      />
      <label htmlFor="hoshitori">星取表「▲	▲	○	○	□	□	▲	▲	○	○	□	□」</label>
      <textarea
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        rows={4}
        wrap="off"
        className="w-full border p-2 rounded font-mono overflow-x-auto"
        id="hoshitori"
      />
      <div>
        <button
          onClick={run}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 transition"
        >
          実行
        </button>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <textarea
        value={output}
        readOnly
        rows={4}
        wrap="off"
        className="w-full border p-2 rounded font-mono overflow-x-auto"
      />
    </main>
  );
}
