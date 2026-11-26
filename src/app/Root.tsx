import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function Root() {
  const { pathname } = useLocation();

  // Scroll to top only on real page navigation.
  // Skip when only the service sub-path changes within /categorias/:slug/:servicePath
  // so that switching tabs doesn't reset scroll position.
  const baseRoute = pathname.replace(/^(\/categorias\/[^/]+)\/.*$/, "$1");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [baseRoute]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
