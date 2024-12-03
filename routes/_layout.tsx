import type { PageProps } from "fresh";
import { ThemeController } from "../components/ThemeController.tsx";
import { FreshBadge } from "../islands/Theme.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <>
      <header className="bg-base-100">
        <div className="h-16 flex items-center justify-between max-w-7xl mx-auto px-4">
          <a href="/">OALY2000</a>
          <div className="flex gap-4 items-center">
            <a href="/tag">标签</a>
            <ThemeController />
          </div>
        </div>
      </header>
      <main className="overflow-y-scroll flex-1">
        <div className="max-w-7xl mx-auto p-4">
          <Component />
        </div>
      </main>
      <footer>
        <div className="flex items-center justify-center gap-x-5 gap-y-2 max-md:flex-col max-md:pb-5">
          <a href="https://github.com/OALY2000">© OALY2000</a>
          <p className="flex gap-2 items-center">
            <span>Powered by Fresh</span>
            <a href="https://fresh.deno.dev">
              <FreshBadge />
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
