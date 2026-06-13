import {
  HeadContent,
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import Header from "@/components/Header";

type RouterContext = {
  queryClient: QueryClient;
};
export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        title: "IdeaDrop - Your Idea Hub",
      },
      {
        name: "decription",
        content:
          "Share explore and build on the best startup ideas and side hustels",
      },
    ],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <HeadContent />
      <Header />
      <main className="flex justify-center p-6">
        <div className="max-w-4xl w-full bg-white rounded-2xl p-8">
          <Outlet />
        </div>
      </main>
      <TanstackDevtools
        config={{
          position: "bottom-left",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center py-24">
      <h1 className="text-8xl font-bold text-gray-700">404</h1>
      <p className="mt-4 text-lg text-gray-500">Oops! The page you are looking for does not exist</p>
      <Link to="/" className="mt-4 bg-blue-500 text-gray-200 rounded-lg px-4 py-2 font-medium hover:bg-blue-600 active:scale-102 hover:scale-105 transition">
        Go Back Home
      </Link>
    </div>
  );
}
