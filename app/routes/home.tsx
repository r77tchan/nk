import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "トップページ" },
    { name: "description", content: "シンプルなトップページ" },
  ];
}

export default function Home() {
  return (
    <main className="pt-16 p-4 container mx-auto space-y-4">
      <h1 className="text-xl font-bold">トップページ</h1>
      <p>
        <Link to="/compare" className="text-blue-700 hover:underline">
          /compare へ移動
        </Link>
      </p>
    </main>
  );
}
