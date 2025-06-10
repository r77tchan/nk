import type { Route } from "./+types/test";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Test Page" },
    { name: "description", content: "Dummy text page" },
  ];
}

export default function Test() {
  return (
    <main className="pt-16 p-4 container mx-auto">
      <p>ダミーテキストです。</p>
    </main>
  );
}
