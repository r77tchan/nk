import { useMemo, useState } from "react";
import type { Route } from "./+types/test";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Test Page" },
    { name: "description", content: "Dummy text page" },
  ];
}

export default function Test() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [mode, setMode] = useState<"common" | "diff">("common");

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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="areaA" className="font-bold">
            A
          </label>
          <textarea
            id="areaA"
            rows={10}
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
        <div>
          <label htmlFor="areaB" className="font-bold">
            B
          </label>
          <textarea
            id="areaB"
            rows={10}
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            className="w-full border p-2 rounded mt-1"
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
      <ul className="list-disc pl-6">
        {results.map((r) => (
          <li key={r.word}>
            {r.word}
            {mode === "diff" && <span className="text-sm text-gray-500"> ({r.from})</span>}
          </li>
        ))}
      </ul>
    </main>
  );
}
