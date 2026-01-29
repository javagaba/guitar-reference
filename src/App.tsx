import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { ScaleSelector } from "./components/ScaleSelector";
import { AppProvider } from "./context/AppContext";
import { HomePage } from "./pages/HomePage";
import { ReferencePage } from "./pages/ReferencePage";

function navClass({ isActive }: { isActive: boolean }) {
  return `text-xs px-2 py-1 rounded transition-colors ${
    isActive
      ? "text-text bg-card border border-border"
      : "text-subtle hover:text-text"
  }`;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-bg px-4 pb-8 font-sans text-text sm:px-8">
          <div className="sticky top-0 z-50 bg-bg border-b border-border/50 py-4 -mx-4 px-4 sm:-mx-8 sm:px-8">
            <ScaleSelector />
            <nav className="mx-auto mt-2 flex max-w-[1200px] gap-2">
              <NavLink to="/" end className={navClass}>
                Home
              </NavLink>
              <NavLink to="/reference" className={navClass}>
                Reference
              </NavLink>
            </nav>
          </div>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/reference" element={<ReferencePage />} />
          </Routes>

          <div className="mt-8 text-center text-[11px] text-[#444]">
            Standard Tuning (EADGBE)
          </div>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
