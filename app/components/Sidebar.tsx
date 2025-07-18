import { NavLink } from "react-router";

export function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "block px-3 py-2 rounded",
      isActive
        ? "bg-blue-500 text-white"
        : "text-blue-700 hover:bg-blue-100",
    ].join(" ");

  return (
    <aside className="w-48 shrink-0 h-full overflow-y-auto bg-gray-100 p-4">
      <nav className="space-y-2">
        <NavLink to="/" end className={linkClass}>
          /
        </NavLink>
        <NavLink to="/test" className={linkClass}>
          /test
        </NavLink>
        <NavLink to="/dup" className={linkClass}>
          /dup
        </NavLink>
        <NavLink to="/ex" className={linkClass}>
          /ex
        </NavLink>
        <NavLink to="/edit" className={linkClass}>
          /edit
        </NavLink>
        <NavLink to="/fq-manual" className={linkClass}>
          /fq-manual
        </NavLink>
      </nav>
    </aside>
  );
}
