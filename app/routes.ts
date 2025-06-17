import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("welcome", "routes/welcome.tsx"),
  route("test", "routes/test.tsx"),
  route("dup", "routes/dup.tsx"),
  route("ex", "routes/ex.tsx"),
  route("edit", "routes/edit.tsx"),
  route("fq-manual", "routes/fq-manual.tsx"),
] satisfies RouteConfig;
