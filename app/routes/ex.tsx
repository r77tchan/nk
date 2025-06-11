import type { Route } from "./+types/ex";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Extract Page" },
    { name: "description", content: "データ抽出ページ" },
  ];
}

export default function Extract() {
  return (
    <main className="pt-16 p-4 container mx-auto">
      <p>ここは抽出ページです。</p>
    </main>
  );
}
