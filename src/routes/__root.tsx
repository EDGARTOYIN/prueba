import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: App,
});

function App() {
  return (
    <main className="dark text-foreground bg-background">
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </main>
  );
}
