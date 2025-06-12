import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/edit";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "編集" },
    { name: "description", content: "テキスト編集" },
  ];
}

export default function Edit() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [action, setAction] = useState<"line" | "prev" | "head">("line");
  const [lineOpt, setLineOpt] = useState<"number" | "contains" | "blank">("number");
  const [headOpt, setHeadOpt] = useState<"trim" | "space">("trim");
  const [input, setInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInput("");
  }, [action, lineOpt, headOpt]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const buffer = await file.arrayBuffer();
    const content = new TextDecoder("shift-jis").decode(buffer);
    setText(content);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const run = () => {
    const lines = text.split(/\r?\n/);
    let result: string[] = [];
    if (action === "line") {
      if (lineOpt === "number") {
        const n = Number(input) - 1;
        result = lines.filter((_, i) => i !== n);
      } else if (lineOpt === "contains") {
        result = lines.filter((l) => !l.includes(input));
      } else {
        const endsWithNewline = /\r?\n$/.test(text);
        result = lines.filter((l) => l.trim() !== "");
        setText(result.join("\n") + (endsWithNewline ? "\n" : ""));
        return;
      }
    } else if (action === "prev") {
      const prefix = input;
      for (const l of lines) {
        if (result.length > 0 && !l.startsWith(prefix)) {
          result[result.length - 1] += l;
        } else {
          result.push(l);
        }
      }
    } else {
      if (headOpt === "trim") {
        const prefix = input;
        const n = prefix.length;
        result = lines.map((l) => (l.startsWith(prefix) ? l : l.slice(n)));
      } else {
        result = lines.map((l) => l.replace(/^[ \t]+/, ""));
      }
    }
    setText(result.join("\n"));
  };

  return (
    <main className="pt-16 p-4 container mx-auto space-y-4">
      <h1 className="text-xl font-bold">編集</h1>
      <div>
        <label className="cursor-pointer inline-block">
          <span className="inline-block file:mr-2 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-gray-700 hover:bg-gray-100">ファイルを選択</span>
          <input
            type="file"
            accept="text/*"
            onChange={handleFile}
            ref={fileRef}
            className="hidden"
          />
        </label>
        <span className="ml-2 text-sm break-words">{fileName || "選択されていません"}</span>
      </div>
      <div className="space-x-4">
        <label className="cursor-pointer">
          <input type="radio" name="action" value="line" checked={action === "line"} onChange={() => setAction("line") } className="mr-1" />
          行削除
        </label>
        <label className="cursor-pointer">
          <input type="radio" name="action" value="prev" checked={action === "prev"} onChange={() => setAction("prev") } className="mr-1" />
          前削除
        </label>
        <label className="cursor-pointer">
          <input type="radio" name="action" value="head" checked={action === "head"} onChange={() => setAction("head") } className="mr-1" />
          行頭削除
        </label>
      </div>
      {action === "line" && (
        <div className="space-x-4">
          <label className="cursor-pointer">
            <input type="radio" name="lineOpt" value="number" checked={lineOpt === "number"} onChange={() => setLineOpt("number") } className="mr-1" />
            行数指定
          </label>
          <label className="cursor-pointer">
            <input type="radio" name="lineOpt" value="contains" checked={lineOpt === "contains"} onChange={() => setLineOpt("contains") } className="mr-1" />
            ○○を含む行
          </label>
          <label className="cursor-pointer">
            <input type="radio" name="lineOpt" value="blank" checked={lineOpt === "blank"} onChange={() => setLineOpt("blank") } className="mr-1" />
            全空行
          </label>
        </div>
      )}
      {action === "prev" && (
        <div>
          <label className="cursor-pointer">
            <input type="radio" name="prevOpt" checked readOnly className="mr-1" />行頭が○○じゃない
          </label>
        </div>
      )}
      {action === "head" && (
        <div className="space-x-4">
          <label className="cursor-pointer">
            <input type="radio" name="headOpt" value="trim" checked={headOpt === "trim"} onChange={() => setHeadOpt("trim") } className="mr-1" />
            行頭の○○
          </label>
          <label className="cursor-pointer">
            <input type="radio" name="headOpt" value="space" checked={headOpt === "space"} onChange={() => setHeadOpt("space") } className="mr-1" />
            空白タブ削除
          </label>
        </div>
      )}
      {((action === "line" && lineOpt !== "blank") || action === "prev" || (action === "head" && headOpt === "trim")) && (
        <div>
          <input
            type={action === "line" && lineOpt === "number" ? "number" : "text"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border px-2 py-1"
          />
        </div>
      )}
      <div>
        <button
          onClick={run}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 transition"
        >
          実行
        </button>
        <button
          onClick={() => {
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName || 'output.txt';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-1 bg-green-500 text-white rounded ml-2 hover:bg-green-600 active:bg-green-700 transition"
        >
          保存
        </button>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={20} wrap="off" className="w-full border p-2 rounded font-mono overflow-x-auto" />
    </main>
  );
}
